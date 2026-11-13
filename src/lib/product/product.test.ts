import { makeProduct, makeVariant } from "@/test/fixtures/product";

import { toCartInput } from "./cart-input";
import { MAX_QTY_PER_LINE } from "./constants";
import { getGalleryImages, getSelectionImage } from "./images";
import { getEffectivePrice } from "./pricing";
import {
  getMaxQuantity,
  getStockStatus,
  isInStock,
  isOptionAvailable,
} from "./stock";
import { findVariant, getMissingVariations } from "./variants";

describe("variants", () => {
  const product = makeProduct();

  it("finds the variant only for a complete selection", () => {
    expect(findVariant(product, { color: "brown" })).toBeUndefined();
    expect(findVariant(product, { color: "black", size: "40" })?.id).toBe(
      "variant-black-40",
    );
  });

  it("lists the variations still missing", () => {
    expect(getMissingVariations(product, { size: "38" })).toEqual(["color"]);
    expect(
      getMissingVariations(product, { color: "brown", size: "38" }),
    ).toEqual([]);
  });
});

describe("pricing", () => {
  it("uses the product's own sale price", () => {
    expect(getEffectivePrice(makeProduct())).toEqual({
      price: 160,
      compareAtPrice: 190,
      onSale: true,
    });
  });

  it("ignores variant prices", () => {
    const product = makeProduct({
      variants: [makeVariant("brown", "38", { price: 220, sale_price: 200 })],
    });
    expect(toCartInput(product, { color: "brown", size: "38" })).toMatchObject({
      unitPrice: 160,
      compareAtPrice: 190,
    });
  });

  it("ignores a sale price that is not lower than the price", () => {
    expect(getEffectivePrice(makeProduct({ sale_price: 250 })).onSale).toBe(
      false,
    );
  });
});

describe("stock", () => {
  it("treats everything as available when stock is not tracked", () => {
    const product = makeProduct();
    expect(isInStock(product, product.variants[0])).toBe(true);
    expect(getMaxQuantity(product)).toBe(MAX_QTY_PER_LINE);
  });

  it("disables combinations that are out of stock when tracked", () => {
    const product = makeProduct({
      track_stock: true,
      variants: [
        makeVariant("brown", "38", { quantity: 3 }),
        makeVariant("brown", "40", { quantity: 0 }),
        makeVariant("black", "40", { quantity: 20 }),
      ],
    });

    expect(isOptionAvailable(product, { color: "brown" }, "size", "38")).toBe(
      true,
    );
    expect(isOptionAvailable(product, { color: "brown" }, "size", "40")).toBe(
      false,
    );
    // No variant exists for this combination at all.
    expect(isOptionAvailable(product, { color: "brown" }, "size", "42")).toBe(
      false,
    );
    // Switching color ignores the current color selection.
    expect(
      isOptionAvailable(product, { color: "brown" }, "color", "black"),
    ).toBe(true);
    expect(getMaxQuantity(product, product.variants[0])).toBe(3);
    expect(getMaxQuantity(product, product.variants[2])).toBe(MAX_QTY_PER_LINE);
  });

  it("reports in, low and out of stock", () => {
    const tracked = makeProduct({
      track_stock: true,
      variants: [
        makeVariant("brown", "38", { quantity: 3 }),
        makeVariant("brown", "40", { quantity: 0 }),
        makeVariant("black", "40", { quantity: 20 }),
      ],
    });

    expect(getStockStatus(tracked, tracked.variants[0])).toEqual({
      status: "low_stock",
      left: 3,
    });
    expect(getStockStatus(tracked, tracked.variants[1])).toEqual({
      status: "out_of_stock",
    });
    expect(getStockStatus(tracked, tracked.variants[2])).toEqual({
      status: "in_stock",
    });
    expect(getStockStatus(makeProduct())).toEqual({ status: "in_stock" });
  });
});

describe("images", () => {
  it("lists images, thumbnail, then color photos, de-duplicated", () => {
    expect(
      getGalleryImages(
        makeProduct({
          images: ["a.webp", "a.webp", "https://cdn.test/thumb.webp"],
        }),
      ),
    ).toEqual([
      "a.webp",
      "https://cdn.test/thumb.webp",
      "https://cdn.test/brown.webp",
      "https://cdn.test/black.webp",
      "https://cdn.test/biege.webp",
    ]);
  });

  it("returns the swatch image of the selected color", () => {
    expect(getSelectionImage(makeProduct(), { color: "black" })).toBe(
      "https://cdn.test/black.webp",
    );
    expect(getSelectionImage(makeProduct(), {})).toBeUndefined();
  });
});

describe("toCartInput", () => {
  it("is null until every variation is picked", () => {
    expect(toCartInput(makeProduct(), { color: "black" })).toBeNull();
  });

  it("maps a complete selection to a cart line", () => {
    expect(toCartInput(makeProduct(), { color: "black", size: "40" })).toEqual({
      productId: "product-1",
      variantId: "variant-black-40",
      name: "Achilles Pro - Genuine Suede X Leather Sneakers",
      image: "https://cdn.test/black.webp",
      options: { color: "black", size: "40" },
      unitPrice: 160,
      compareAtPrice: 190,
      maxQuantity: MAX_QTY_PER_LINE,
    });
  });
});
