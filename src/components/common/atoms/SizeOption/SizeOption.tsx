import { ToggleGroupItem } from "@components/ui/toggle-group";
import { cn } from "@lib/utils";

import { type SizeOptionProps } from "./SizeOption.types";

/**
 * Text option button (size, material…). Must render inside a `ToggleGroup`.
 * Figma 57:1399 (desktop) / 61:528 (mobile): 75×40 (a 39px-high grid cell on
 * mobile), 6 → 8px radius.
 */
function SizeOption({ className, children, ...props }: SizeOptionProps) {
  return (
    <ToggleGroupItem
      variant="outline"
      className={cn(
        "h-9.75 w-full rounded-md border-border bg-background px-0 text-20 leading-tight font-semibold text-option-foreground hover:bg-background hover:text-foreground disabled:cursor-not-allowed disabled:line-through disabled:opacity-40 data-[state=on]:border-border-strong data-[state=on]:bg-accent data-[state=on]:text-accent-foreground lg:h-10 lg:w-18.75 lg:rounded-lg",
        className,
      )}
      {...props}
    >
      {children}
    </ToggleGroupItem>
  );
}

export { SizeOption };
