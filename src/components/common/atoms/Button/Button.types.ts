import { type VariantProps } from "class-variance-authority";

import { type Button as ShadcnButton } from "@components/ui/button";

import { buttonVariants } from "./Button.variants";

export interface ButtonProps
  extends
    Omit<React.ComponentProps<typeof ShadcnButton>, "variant" | "size">,
    VariantProps<typeof buttonVariants> {
  /** Shows a spinner and disables the button without changing its width. */
  loading?: boolean;
  /** Icon before the label. */
  startIcon?: React.ReactNode;
  /** Icon after the label. */
  endIcon?: React.ReactNode;
}
