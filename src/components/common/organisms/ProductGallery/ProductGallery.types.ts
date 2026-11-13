export interface ProductGalleryProps extends React.ComponentProps<"section"> {
  productId: string;
  productName: string;
  images: string[];
  /** Image to jump to when it changes, e.g. the selected color's photo. */
  activeImage?: string;
}
