export interface RatingBarProps extends React.ComponentProps<"div"> {
  /** Star level this row represents (1–5). */
  stars: number;
  count: number;
  total: number;
}
