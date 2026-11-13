import DOMPurify from "dompurify";
import { useCallback, useId, useMemo, useState } from "react";
import { useTranslations } from "use-intl";

import { cn } from "@lib/utils";

import { type ProductDescriptionProps } from "./ProductDescription.types";

/**
 * "Description:" with the product's HTML, clamped to four lines until
 * "See More" (Figma 57:1382 / 61:511).
 */
function ProductDescription({
  html,
  className,
  ...props
}: ProductDescriptionProps) {
  const t = useTranslations("product");
  const contentId = useId();
  const [expanded, setExpanded] = useState(false);
  const [overflows, setOverflows] = useState(false);
  const safeHtml = useMemo(() => DOMPurify.sanitize(html), [html]);

  // Measure once the clamped content is in the DOM: hide the toggle when it all fits.
  const measure = useCallback((node: HTMLDivElement | null) => {
    if (node) setOverflows(node.scrollHeight > node.clientHeight);
  }, []);

  return (
    <section
      className={cn("flex flex-col gap-2.5", className)}
      aria-labelledby={`${contentId}-title`}
      {...props}
    >
      <h2
        id={`${contentId}-title`}
        className="text-18 leading-tight font-semibold text-heading lg:text-20"
      >
        {t("description")}
      </h2>
      <div
        id={contentId}
        ref={measure}
        className={cn(
          "text-14 leading-snug text-muted-foreground lg:text-16 [&_a]:underline [&_li+li]:mt-1 [&_ol]:list-decimal [&_ol]:ps-5 [&_p]:mt-2 [&_strong]:font-medium [&_ul]:list-disc [&_ul]:ps-5 [&>:first-child]:mt-0",
          // Clamp by lines, not height: list margins would cut a line in half.
          !expanded && "line-clamp-4",
        )}
        dangerouslySetInnerHTML={{ __html: safeHtml }}
      />
      {overflows && (
        <button
          type="button"
          aria-expanded={expanded}
          aria-controls={contentId}
          onClick={() => setExpanded((value) => !value)}
          className="self-start text-14 leading-snug font-medium text-emphasis lg:text-16"
        >
          {expanded ? t("seeLess") : t("seeMore")}
        </button>
      )}
    </section>
  );
}

export { ProductDescription };
