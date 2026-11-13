/** Not returned by the API yet despite `?join=reviews`; kept loose on purpose. */
export type Review = {
  id: string;
  rating: number;
  comment?: string;
  name?: string;
  created_at: string;
};
