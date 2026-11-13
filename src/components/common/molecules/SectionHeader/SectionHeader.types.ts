export interface SectionHeaderProps extends React.ComponentProps<"div"> {
  title: string;
  /** Trailing slot, e.g. a "View All" link. */
  action?: React.ReactNode;
  /** Heading level; sections under the product title default to h2. */
  as?: "h2" | "h3";
}
