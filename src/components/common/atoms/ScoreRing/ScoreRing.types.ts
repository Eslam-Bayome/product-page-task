export interface ScoreRingProps extends React.ComponentProps<"div"> {
  /** Average rating shown in the middle; the arc covers `score / max`. */
  score: number;
  max?: number;
}
