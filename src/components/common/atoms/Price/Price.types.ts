import { type VariantProps } from "class-variance-authority";

import { priceVariants } from "./Price.variants";

export interface PriceProps
  extends
    Omit<React.ComponentProps<"span">, "children">,
    VariantProps<typeof priceVariants> {
  /** Always USD; converted for display. */
  amount: number;
}
