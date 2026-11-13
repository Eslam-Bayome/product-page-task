import { type CatalogProduct } from "@lib/catalog";

export interface ProductGridProps extends React.ComponentProps<"section"> {
  title: string;
  products: CatalogProduct[];
}
