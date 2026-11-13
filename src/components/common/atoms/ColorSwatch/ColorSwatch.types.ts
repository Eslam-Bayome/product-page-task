import { type ToggleGroupItem } from "@components/ui/toggle-group";

export interface ColorSwatchProps extends Omit<
  React.ComponentProps<typeof ToggleGroupItem>,
  "children" | "size" | "variant"
> {
  /** Human-readable option name (used as the accessible label). */
  label: string;
  /** Image swatch (EasyOrders `type: "image"` variations). */
  imageUrl?: string;
  /** Solid fill when no image is provided. */
  color?: string;
}
