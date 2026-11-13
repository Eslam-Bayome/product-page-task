export interface ProductDescriptionProps extends React.ComponentProps<"section"> {
  /** Untrusted HTML from the API; sanitised before rendering. */
  html: string;
}
