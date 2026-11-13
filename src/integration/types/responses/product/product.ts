import { type Category } from "./category";
import { type ProductVariant } from "./product-variant";
import { type ProductVariation } from "./product-variation";
import { type Review } from "./review";

export type Product = {
  id: string;
  store_id: string;
  name: string;
  slug: string;
  /** HTML string. */
  description: string;
  price: number;
  /** `0` means no sale price is set. */
  sale_price: number;
  thumb: string;
  images: string[];
  quantity: number;
  /** When false, stock quantities are not meaningful and everything is purchasable. */
  track_stock: boolean;
  disable_orders_for_no_stock: boolean;
  hidden: boolean;
  is_quantity_hidden: boolean;
  is_free_shipping: boolean;
  buy_now_text: string;
  /** Hours on the store's promotional countdown. */
  fake_timer_hours: number;
  /** Empty string when the store default currency applies. */
  custom_currency: string;
  variations: ProductVariation[];
  variants: ProductVariant[];
  categories: Category[];
  reviews?: Review[];
  created_at: string;
  updated_at: string;
};
