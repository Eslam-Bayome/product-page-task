import { useTranslations } from "use-intl";

import arrowIcon from "@/assets/icons/arrow-down.svg";
import { getPageList } from "@lib/reviews";
import { cn } from "@lib/utils";

import { type ReviewPaginationProps } from "./ReviewPagination.types";

const pageBox =
  "flex h-9 w-9 items-center justify-center rounded-md border text-12 leading-relaxed font-medium lg:h-11 lg:w-11 lg:rounded-lg lg:text-14";

/** "1 2 … 19 ›" (Figma 57:1794 / 62:1614). */
function ReviewPagination({
  page,
  pageCount,
  onPageChange,
  className,
  ...props
}: ReviewPaginationProps) {
  const t = useTranslations("reviews");
  if (pageCount <= 1) return null;

  return (
    <nav
      aria-label={t("pages")}
      className={cn("flex items-center gap-1.5 lg:gap-2", className)}
      {...props}
    >
      {getPageList(page, pageCount).map((item, index) =>
        item === "ellipsis" ? (
          <span
            key={`ellipsis-${index}`}
            aria-hidden
            className={cn(pageBox, "border-border-soft text-faint-foreground")}
          >
            ...
          </span>
        ) : (
          <button
            key={item}
            type="button"
            aria-current={item === page ? "page" : undefined}
            aria-label={t("page", { page: item })}
            onClick={() => onPageChange(item)}
            className={cn(
              pageBox,
              item === page
                ? "border-border-strong bg-background text-foreground"
                : "border-border-soft text-faint-foreground hover:bg-muted",
            )}
          >
            {item}
          </button>
        ),
      )}
      <button
        type="button"
        aria-label={t("nextPage")}
        disabled={page >= pageCount}
        onClick={() => onPageChange(page + 1)}
        className="rounded-md p-2 disabled:opacity-30 lg:rounded-lg lg:p-2.5"
      >
        <img
          src={arrowIcon}
          alt=""
          className="size-5 -rotate-90 lg:size-6 rtl:rotate-90"
        />
      </button>
    </nav>
  );
}

export { ReviewPagination };
