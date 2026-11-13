import { type VariantProps } from "class-variance-authority";

import { typographyVariants } from "./Typography.variants";

export interface TypographyProps
  extends
    React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof typographyVariants> {
  /** Rendered element; defaults to a sensible tag per variant. */
  as?: React.ElementType;
}
