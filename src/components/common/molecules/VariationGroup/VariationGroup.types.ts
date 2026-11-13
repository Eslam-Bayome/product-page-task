export interface VariationOption {
  value: string;
  label: string;
  /** Swatch image for `type: "image"` variations. */
  imageUrl?: string;
  disabled?: boolean;
}

export interface VariationGroupProps {
  /** Variation name, e.g. "Color". */
  name: string;
  /** EasyOrders variation type: image swatches or text buttons. */
  type: "image" | "button";
  options: VariationOption[];
  value: string | undefined;
  onValueChange: (value: string) => void;
  /** Trailing slot next to the label, e.g. a "View Size Chart" link. */
  action?: React.ReactNode;
  className?: string;
}
