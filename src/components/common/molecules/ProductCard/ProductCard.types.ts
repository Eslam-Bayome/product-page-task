export interface ProductCardProps extends React.ComponentProps<"article"> {
  imageUrl: string;
  brand: string;
  name: string;
  price: number;
  rating?: number;
  soldCount?: number;
  href?: string;
}
