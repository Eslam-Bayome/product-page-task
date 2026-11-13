import { useTranslations } from "use-intl";

import { cn } from "@lib/utils";

import { type ThumbnailListProps } from "./ThumbnailList.types";

/**
 * Five-up thumbnail row (Figma 57:1348 / 61:443): 76×100 thumbs, 20px gap on
 * desktop, scaling down to fill the mobile width. Extra images wrap.
 */
function ThumbnailList({
  images,
  activeIndex,
  onSelect,
  className,
  ...props
}: ThumbnailListProps) {
  const t = useTranslations("gallery");

  return (
    <div
      role="group"
      aria-label={t("thumbnails")}
      className={cn("grid grid-cols-5 gap-3.75 lg:gap-5", className)}
      {...props}
    >
      {images.map((image, index) => {
        const isActive = index === activeIndex;
        return (
          <button
            key={image.src}
            type="button"
            aria-label={t("showImage", {
              index: index + 1,
              total: images.length,
            })}
            aria-current={isActive}
            onClick={() => onSelect(index)}
            className={cn(
              "aspect-19/25 overflow-hidden rounded-md border bg-surface-image transition-colors outline-none focus-visible:ring-3 focus-visible:ring-ring/50 lg:rounded-lg",
              isActive
                ? "border-foreground"
                : "border-transparent hover:border-border-dashed",
            )}
          >
            <img
              src={image.src}
              alt=""
              loading="lazy"
              decoding="async"
              className="size-full object-cover"
            />
          </button>
        );
      })}
    </div>
  );
}

export { ThumbnailList };
