import { type ProductSelection } from "@hooks/use-product-selection";
import { type Product } from "@integration/types";

export interface ProductInfoProps extends React.ComponentProps<"div"> {
  product: Product;
  /** Owned by the parent so the gallery can follow the selected color. */
  selection: ProductSelection;
  /** Average review rating shown beside the price. */
  rating?: number;
}
