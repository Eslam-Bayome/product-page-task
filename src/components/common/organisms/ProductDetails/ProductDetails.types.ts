import { type Product } from "@integration/types";

export interface ProductDetailsProps extends React.ComponentProps<"div"> {
  product: Product;
  /** Average review rating, shown beside the price. */
  rating?: number;
}
