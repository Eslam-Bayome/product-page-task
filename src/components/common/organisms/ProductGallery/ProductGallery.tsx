import { useState } from "react";
import { toast } from "sonner";
import { useTranslations } from "use-intl";

import chevronIcon from "@/assets/icons/chevron.svg";
import heartIcon from "@/assets/icons/heart.svg";
import shareIcon from "@/assets/icons/share.svg";
import { analytics } from "@integration/analytics";
import { cn } from "@lib/utils";
import {
  makeSelectIsWishlisted,
  selectToggleWishlist,
  useWishlistStore,
} from "@store/wishlist";

import { type ProductGalleryProps } from "./ProductGallery.types";
import { IconButton } from "../../atoms/IconButton";
import { ThumbnailList } from "../../molecules/ThumbnailList";

const shareProduct = async (
  title: string,
  messages: { copied: string; failed: string },
) => {
  const url = window.location.href;
  try {
    if (navigator.share) {
      await navigator.share({ title, url });
      analytics.track("product_shared", { method: "native" });
      return;
    }
    await navigator.clipboard.writeText(url);
    analytics.track("product_shared", { method: "clipboard" });
    toast.success(messages.copied);
  } catch (error) {
    // Closing the native share sheet is not an error worth reporting.
    if (error instanceof DOMException && error.name === "AbortError") return;
    toast.error(messages.failed);
  }
};

/**
 * Main image with hover / tap zoom, thumbnails, and the share · wishlist ·
 * prev · next column (Figma 79:665 / 79:686).
 */
function ProductGallery({
  productId,
  productName,
  images,
  activeImage,
  className,
  ...props
}: ProductGalleryProps) {
  const t = useTranslations("gallery");
  const [activeIndex, setActiveIndex] = useState(0);
  const [zoomed, setZoomed] = useState(false);
  const [syncedImage, setSyncedImage] = useState(activeImage);

  // Follow `activeImage` (adjusting state during render, no effect needed).
  if (activeImage !== syncedImage) {
    setSyncedImage(activeImage);
    const index = activeImage ? images.indexOf(activeImage) : -1;
    if (index !== -1) setActiveIndex(index);
  }

  const isWishlisted = useWishlistStore(makeSelectIsWishlisted(productId));
  const toggleWishlist = useWishlistStore(selectToggleWishlist);

  const index = Math.min(activeIndex, images.length - 1);
  const src = images[index];
  const step = (delta: number) => {
    setZoomed(false);
    setActiveIndex((index + delta + images.length) % images.length);
  };

  return (
    <section
      aria-label={t("images", { name: productName })}
      className={cn(
        "grid grid-cols-[1fr_--spacing(11)] gap-x-3 gap-y-5 lg:grid-cols-[1fr_--spacing(13)] lg:gap-x-8.75 lg:gap-y-6",
        className,
      )}
      {...props}
    >
      <button
        type="button"
        aria-label={zoomed ? t("zoomOut") : t("zoomIn")}
        aria-pressed={zoomed}
        onClick={() => setZoomed((value) => !value)}
        onPointerLeave={() => setZoomed(false)}
        onPointerMove={(event) => {
          const rect = event.currentTarget.getBoundingClientRect();
          const x = ((event.clientX - rect.left) / rect.width) * 100;
          const y = ((event.clientY - rect.top) / rect.height) * 100;
          event.currentTarget.style.setProperty("--zoom-origin", `${x}% ${y}%`);
        }}
        onKeyDown={(event) => {
          if (images.length < 2) return;
          // "Next" follows the reading direction: → in LTR, ← in RTL.
          const rtl = getComputedStyle(event.currentTarget).direction === "rtl";
          if (event.key === "ArrowRight") step(rtl ? -1 : 1);
          if (event.key === "ArrowLeft") step(rtl ? 1 : -1);
        }}
        className="group aspect-3/4 cursor-zoom-in overflow-hidden rounded-lg bg-surface-image outline-none focus-visible:ring-3 focus-visible:ring-ring/50 aria-pressed:cursor-zoom-out"
      >
        {src && (
          <img
            key={src}
            src={src}
            alt={productName}
            fetchPriority="high"
            className={cn(
              "size-full origin-(--zoom-origin) animate-in object-cover transition-transform duration-300 fade-in [@media(hover:hover)]:group-hover:scale-200",
              zoomed && "scale-200",
            )}
          />
        )}
      </button>

      <div className="flex flex-col justify-between">
        <div className="flex flex-col gap-5">
          <IconButton
            size="icon-lg"
            label={t("share")}
            icon={<img src={shareIcon} alt="" className="size-5" />}
            onClick={() =>
              void shareProduct(productName, {
                copied: t("linkCopied"),
                failed: t("shareFailed"),
              })
            }
          />
          <IconButton
            size="icon-lg"
            variant={isWishlisted ? "primary" : "soft"}
            label={isWishlisted ? t("removeFromWishlist") : t("addToWishlist")}
            aria-pressed={isWishlisted}
            icon={
              <img
                src={heartIcon}
                alt=""
                className={cn("size-5", isWishlisted && "invert")}
              />
            }
            onClick={() => {
              toggleWishlist(productId);
              analytics.track("wishlist_toggled", {
                product_id: productId,
                saved: !isWishlisted,
              });
            }}
          />
        </div>
        {images.length > 1 && (
          <div className="flex flex-col gap-4 lg:gap-5">
            <IconButton
              size="icon-lg"
              label={t("previous")}
              icon={
                <img
                  src={chevronIcon}
                  alt=""
                  className="size-5 -rotate-90 rtl:rotate-90"
                />
              }
              onClick={() => step(-1)}
            />
            <IconButton
              size="icon-lg"
              label={t("next")}
              icon={
                <img
                  src={chevronIcon}
                  alt=""
                  className="size-5 rotate-90 rtl:-rotate-90"
                />
              }
              onClick={() => step(1)}
            />
          </div>
        )}
      </div>

      {images.length > 1 && (
        <ThumbnailList
          images={images.map((image) => ({ src: image, alt: productName }))}
          activeIndex={index}
          onSelect={(next) => {
            setZoomed(false);
            setActiveIndex(next);
          }}
          className="col-span-2 lg:col-span-1"
        />
      )}
    </section>
  );
}

export { ProductGallery };
