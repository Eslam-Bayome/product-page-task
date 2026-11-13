export interface CountBadgeProps extends React.ComponentProps<"span"> {
  count: number;
  /** Counts above this render as `${max}+`. */
  max?: number;
}
