import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
});

test("adds a variant to the cart and manages it in the drawer", async ({
  page,
}) => {
  const addToCart = page.getByRole("button", { name: "Add To Cart" });

  // Without a selection nothing is added.
  await addToCart.click();
  await expect(
    page.getByRole("button", { name: /^Cart, empty$/ }),
  ).toBeVisible();

  await page.getByRole("radio", { name: "black" }).click();
  await page.getByRole("radio", { name: "40" }).click();
  await addToCart.click();

  const cartButton = page.getByRole("button", { name: "Cart, 1 item" });
  await expect(cartButton).toBeVisible();

  // The cart survives a reload.
  await page.reload();
  await expect(cartButton).toBeVisible();

  await cartButton.click();
  const drawer = page.getByRole("dialog");
  await expect(drawer.getByText("Your Cart (1)")).toBeVisible();

  await drawer.getByRole("button", { name: /^Increase .* quantity$/ }).click();
  await expect(drawer.getByText("Your Cart (2)")).toBeVisible();

  await drawer.getByRole("button", { name: /^Remove / }).click();
  await expect(drawer.getByText("Your cart is empty")).toBeVisible();
});

test("switches to Arabic, right-to-left", async ({ page }) => {
  await page.getByRole("button", { name: "Language: English" }).click();
  await page.getByRole("menuitemradio", { name: "العربية" }).click();

  await expect(page.locator("html")).toHaveAttribute("dir", "rtl");
  await expect(
    page.getByRole("button", { name: "أضف إلى السلة" }),
  ).toBeVisible();
});

test("shows prices in EGP at the live rate", async ({ page }) => {
  await page.getByRole("button", { name: "Currency: USD" }).click();
  await page.getByRole("menuitemradio", { name: "EGP" }).click();

  await expect(
    page.getByRole("button", { name: "Currency: EGP" }),
  ).toBeVisible();
  await expect(page.getByText(/EGP\s[\d,]+/).first()).toBeVisible();
});
