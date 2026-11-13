import { type Category } from "@integration/types";

export interface ProductBreadcrumbProps extends React.ComponentProps<"nav"> {
  productName: string;
  /** The first category becomes the middle crumb. */
  categories: Category[];
}
