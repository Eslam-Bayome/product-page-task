import { cva } from "class-variance-authority";

/**
 * `lg` is the product hero (Figma 57:1371 / 61:500); mobile first, desktop `lg:`.
 * `leading-tight` sits after each `text-*`: tailwind-merge drops a leading
 * class that a later font-size class follows.
 */
export const priceVariants = cva("tabular-nums", {
  variants: {
    variant: {
      current: "font-semibold text-foreground",
      compare: "font-medium text-muted-foreground",
    },
    size: {
      sm: "text-14 leading-tight",
      md: "text-16 leading-tight",
      lg: "",
    },
  },
  compoundVariants: [
    {
      variant: "current",
      size: "lg",
      className: "text-20 leading-tight lg:text-28",
    },
    {
      variant: "compare",
      size: "lg",
      className: "text-14 leading-tight lg:text-18",
    },
  ],
  defaultVariants: { variant: "current", size: "md" },
});
