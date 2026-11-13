export interface ReviewPaginationProps extends React.ComponentProps<"nav"> {
  /** 1-based. */
  page: number;
  pageCount: number;
  onPageChange: (page: number) => void;
}
