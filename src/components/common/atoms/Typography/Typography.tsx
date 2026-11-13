import { cn } from "@lib/utils";

import { type TypographyProps } from "./Typography.types";
import {
  type TypographyVariant,
  typographyVariants,
} from "./Typography.variants";

const defaultTag: Record<TypographyVariant, React.ElementType> = {
  display: "h1",
  heading: "h2",
  title: "h3",
  body: "p",
  label: "span",
  caption: "span",
};

/** Single text primitive — owns the type scale so call sites never pick raw sizes. */
function Typography({
  as,
  variant,
  tone,
  className,
  ...props
}: TypographyProps) {
  const Comp = as ?? defaultTag[variant ?? "body"];
  return (
    <Comp
      className={cn(typographyVariants({ variant, tone }), className)}
      {...props}
    />
  );
}

export { Typography };
