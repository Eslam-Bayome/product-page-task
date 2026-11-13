import { ToggleGroupItem } from "@components/ui/toggle-group";
import { cn } from "@lib/utils";

import { type ColorSwatchProps } from "./ColorSwatch.types";
import { colorSwatchVariants } from "./ColorSwatch.variants";

/** Must render inside a `ToggleGroup` — selection and roving focus come from it. */
function ColorSwatch({
  label,
  imageUrl,
  color,
  className,
  ...props
}: ColorSwatchProps) {
  return (
    <ToggleGroupItem
      aria-label={label}
      title={label}
      className={cn(colorSwatchVariants(), className)}
      {...props}
    >
      <span
        data-swatch
        className="block bg-muted bg-cover bg-center"
        style={{
          backgroundColor: color,
          backgroundImage: imageUrl ? `url("${imageUrl}")` : undefined,
        }}
      />
    </ToggleGroupItem>
  );
}

export { ColorSwatch };
