/** A product tile in "Related Product" / "Popular this week". */
export type CatalogProduct = {
  id: string;
  brand: string;
  name: string;
  price: number;
  imageUrl: string;
  rating: number;
  soldCount: number;
  href: string;
};
