import { type ReviewTopic } from "@lib/reviews";

export interface ReviewFiltersProps extends React.ComponentProps<"div"> {
  ratings: number[];
  topics: ReviewTopic[];
  onRatingsChange: (ratings: number[]) => void;
  onTopicsChange: (topics: ReviewTopic[]) => void;
}
