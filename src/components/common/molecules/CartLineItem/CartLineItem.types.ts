export interface CartLineItemProps extends React.ComponentProps<"li"> {
  name: string;
  imageUrl: string;
  /** Selected variation values, e.g. `{ color: "brown", size: "40" }`. */
  options?: Record<string, string>;
  unitPrice: number;
  compareAtPrice?: number | null;
  quantity: number;
  maxQuantity: number;
  onQuantityChange: (quantity: number) => void;
  onRemove: () => void;
}
