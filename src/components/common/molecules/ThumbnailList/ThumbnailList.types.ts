export interface ThumbnailImage {
  src: string;
  alt: string;
}

export interface ThumbnailListProps extends Omit<
  React.ComponentProps<"div">,
  "onSelect"
> {
  images: ThumbnailImage[];
  activeIndex: number;
  onSelect: (index: number) => void;
}
