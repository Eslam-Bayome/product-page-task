import { cn } from "@lib/utils";

import { type CountBadgeProps } from "./CountBadge.types";

/**
 * 13px count bubble over the top-end corner of its `relative` 20px icon
 * parent (Figma 57:1330: 4px above, 3px past the end edge).
 */
function CountBadge({ count, max = 99, className, ...props }: CountBadgeProps) {
  if (count <= 0) return null;

  return (
    <span
      aria-hidden
      className={cn(
        "absolute -end-0.75 -top-1 flex h-3.25 min-w-3.25 items-center justify-center rounded-full bg-primary px-0.5 text-8 leading-none font-medium text-primary-foreground tabular-nums",
        className,
      )}
      {...props}
    >
      {count > max ? `${max}+` : count}
    </span>
  );
}

export { CountBadge };
