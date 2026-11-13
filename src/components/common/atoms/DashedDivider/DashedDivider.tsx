import { cn } from "@lib/utils";

/**
 * The design's dashed section rule (Figma "Line 2–5"): 0.5px, 6px dash / 6px gap.
 * Drawn with a gradient because CSS `border-dashed` can't set the dash length.
 */
function DashedDivider({ className, ...props }: React.ComponentProps<"hr">) {
  return (
    <hr
      className={cn(
        "h-[0.5px] w-full border-0 bg-[repeating-linear-gradient(to_right,var(--color-border-dashed)_0_6px,transparent_6px_12px)]",
        className,
      )}
      {...props}
    />
  );
}

export { DashedDivider };
