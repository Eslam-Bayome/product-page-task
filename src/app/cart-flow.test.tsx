import { screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { makeProduct } from "@/test/fixtures/product";
import { renderWithProviders } from "@/test/render";
import { CartDrawer } from "@components/common/organisms/CartDrawer";
import { ProductDetails } from "@components/common/organisms/ProductDetails";
import { SiteHeader } from "@components/common/organisms/SiteHeader";
import { CART_STORAGE_KEY, useCartStore } from "@store/cart";

const product = makeProduct();

const renderPage = () =>
  renderWithProviders(
    <>
      <SiteHeader />
      <ProductDetails product={product} />
      <CartDrawer />
    </>,
  );

describe("cart flow", () => {
  it("validates, adds, adjusts and removes a line", async () => {
    const user = userEvent.setup();
    renderPage();
    const addToCart = screen.getByRole("button", { name: "Add To Cart" });

    // Nothing selected: nothing added, focus jumps to the first missing variation.
    await user.click(addToCart);
    expect(useCartStore.getState().items).toHaveLength(0);
    expect(screen.getByRole("radio", { name: "brown" })).toHaveFocus();

    // Pick a full variant: the price stays the product's sale price.
    await user.click(screen.getByRole("radio", { name: "black" }));
    await user.click(screen.getByRole("radio", { name: "40" }));
    await user.click(addToCart);

    expect(useCartStore.getState().items).toMatchObject([
      { variantId: "variant-black-40", unitPrice: 160, quantity: 1 },
    ]);
    expect(
      screen.getByRole("button", { name: "Cart, 1 item" }),
    ).toBeInTheDocument();
    // Persisted for the next visit.
    expect(localStorage.getItem(CART_STORAGE_KEY)).toContain(
      "variant-black-40",
    );

    // Open the drawer from the header and bump the quantity.
    await user.click(screen.getByRole("button", { name: "Cart, 1 item" }));
    const drawer = await screen.findByRole("dialog");
    expect(within(drawer).getByText("Your Cart (1)")).toBeInTheDocument();

    await user.click(
      within(drawer).getByRole("button", {
        name: `Increase ${product.name} quantity`,
      }),
    );
    expect(useCartStore.getState().items[0]?.quantity).toBe(2);
    expect(within(drawer).getAllByText("$320").length).toBeGreaterThan(0);

    // Remove → empty state.
    await user.click(
      within(drawer).getByRole("button", { name: `Remove ${product.name}` }),
    );
    expect(within(drawer).getByText("Your cart is empty")).toBeInTheDocument();
    expect(useCartStore.getState().items).toHaveLength(0);
  });
});
