import {
  type Product,
  type ProductVariant,
  type VariationProp,
} from "@integration/types";

const PRODUCT_ID = "product-1";

const prop = (
  variationId: string,
  name: string,
  value?: string,
): VariationProp => ({
  id: `${variationId}-${name}`,
  name,
  variation_id: variationId,
  value,
});

const variant = (
  color: string,
  size: string,
  overrides: Partial<ProductVariant> = {},
): ProductVariant => {
  const id = `variant-${color}-${size}`;
  return {
    id,
    product_id: PRODUCT_ID,
    price: 190,
    sale_price: 0,
    quantity: 0,
    taager_code: "",
    variation_props: [
      {
        id: `${id}-c`,
        variation: "color",
        variation_prop: color,
        product_variant_id: id,
      },
      {
        id: `${id}-s`,
        variation: "size",
        variation_prop: size,
        product_variant_id: id,
      },
    ],
    ...overrides,
  };
};

/** Mirrors the shape of the live `Sneakers12` response (3 colors × 3 sizes). */
export const makeProduct = (overrides: Partial<Product> = {}): Product => ({
  id: PRODUCT_ID,
  store_id: "store-1",
  name: "Achilles Pro - Genuine Suede X Leather Sneakers",
  slug: "Sneakers12",
  description: "<ul><li>Made with cowhide leather</li></ul>",
  price: 190,
  sale_price: 160,
  thumb: "https://cdn.test/thumb.webp",
  images: ["https://cdn.test/1.webp", "https://cdn.test/2.webp"],
  quantity: 0,
  track_stock: false,
  disable_orders_for_no_stock: false,
  hidden: false,
  is_quantity_hidden: false,
  is_free_shipping: false,
  buy_now_text: "Go To Checkout",
  fake_timer_hours: 1,
  custom_currency: "",
  variations: [
    {
      id: "color",
      name: "color",
      product_id: PRODUCT_ID,
      type: "image",
      props: [
        prop("color", "brown", "https://cdn.test/brown.webp"),
        prop("color", "black", "https://cdn.test/black.webp"),
        prop("color", "biege", "https://cdn.test/biege.webp"),
      ],
    },
    {
      id: "size",
      name: "size",
      product_id: PRODUCT_ID,
      type: "button",
      props: [prop("size", "38"), prop("size", "40"), prop("size", "42")],
    },
  ],
  variants: ["brown", "black", "biege"].flatMap((color) =>
    ["38", "40", "42"].map((size) => variant(color, size)),
  ),
  categories: [],
  created_at: "2025-01-02T16:57:51Z",
  updated_at: "2025-02-28T16:32:44Z",
  ...overrides,
});

export { variant as makeVariant };
