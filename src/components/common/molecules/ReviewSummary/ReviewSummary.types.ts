import { type ReviewSummary as Summary } from "@lib/reviews";

export interface ReviewSummaryProps extends React.ComponentProps<"div"> {
  summary: Summary;
}
