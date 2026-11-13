import { cva, type VariantProps } from "class-variance-authority";

/** Figma text styles; mobile size first, desktop (`lg:`) second. */
export const typographyVariants = cva("", {
  variants: {
    variant: {
      // Product title — Semibold 23 / 36, lh 120%, −0.5%
      display: "text-23 leading-tight font-semibold tracking-title lg:text-36",
      // Section heading — Semibold 24 / 28, lh 120%
      heading: "text-24 leading-tight font-semibold lg:text-28",
      // H2 / Eh6 — Semibold 18 / 20, lh 140%, −0.2px
      title: "text-18 leading-normal font-semibold tracking-heading lg:text-20",
      // P1 — Regular 16, lh 160%
      body: "text-16 leading-relaxed",
      // P2 — Medium 14, lh 160%
      label: "text-14 leading-relaxed font-medium",
      caption: "text-12 leading-relaxed",
    },
    tone: {
      default: "text-foreground",
      heading: "text-heading",
      muted: "text-muted-foreground",
      subtle: "text-subtle-foreground",
      faint: "text-faint-foreground",
      inherit: "",
    },
  },
  defaultVariants: { variant: "body", tone: "default" },
});

export type TypographyVariant = NonNullable<
  VariantProps<typeof typographyVariants>["variant"]
>;
