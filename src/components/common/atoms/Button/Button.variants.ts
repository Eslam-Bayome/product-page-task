import { cva } from "class-variance-authority";

/**
 * Design overrides layered on the shadcn primitive through `cn` (tailwind-merge
 * resolves the conflicts), so `components/ui/button.tsx` stays regenerable.
 * `xl` is the product CTA pair (Figma 57:1411 / 61:540).
 */
export const buttonVariants = cva("leading-tight", {
  variants: {
    variant: {
      primary:
        "bg-primary font-semibold text-primary-foreground hover:bg-primary/85",
      outline:
        "border-border-button bg-background font-medium text-secondary-foreground hover:bg-muted",
      soft: "bg-muted font-semibold text-foreground hover:bg-accent",
      ghost: "bg-transparent font-semibold text-foreground hover:bg-muted",
      link: "h-auto bg-transparent px-0 font-medium text-foreground underline underline-offset-4 hover:no-underline",
    },
    size: {
      sm: "h-8 rounded-md px-3 text-12",
      md: "h-10 rounded-md px-4 text-14",
      lg: "h-12 rounded-md px-6 text-16",
      xl: "h-14 rounded-md px-8 text-18 lg:h-14.5 lg:rounded-lg lg:text-20",
      icon: "size-10 rounded-md",
      "icon-sm": "size-8 rounded-md",
      // Gallery side buttons (Figma 57:1419 / 61:458): 20px icon, 16 / 12px padding
      "icon-lg": "size-11 rounded-md lg:size-13 lg:rounded-lg",
    },
    fullWidth: {
      true: "w-full",
    },
  },
  compoundVariants: [{ variant: "link", className: "h-auto px-0" }],
  defaultVariants: { variant: "primary", size: "md" },
});
