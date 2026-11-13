export interface PriceBlockProps extends React.ComponentProps<"div"> {
  price: number;
  /** Original price; shown struck-through only when higher than `price`. */
  compareAtPrice?: number | null;
  size?: "sm" | "md" | "lg";
}
