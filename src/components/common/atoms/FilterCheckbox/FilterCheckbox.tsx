import { Checkbox } from "@components/ui/checkbox";
import { cn } from "@lib/utils";

/**
 * The review-filter checkbox (Figma 57:1541): a square 18px box with a 1.5px
 * border, centred in a 24px slot. Checked fills with the primary colour.
 */
function FilterCheckbox({
  className,
  ...props
}: React.ComponentProps<typeof Checkbox>) {
  return (
    <span className="flex size-6 shrink-0 items-center justify-center">
      <Checkbox
        className={cn(
          "size-4.5 rounded-none border-[1.5px] border-checkbox data-checked:border-primary",
          className,
        )}
        {...props}
      />
    </span>
  );
}

export { FilterCheckbox };
