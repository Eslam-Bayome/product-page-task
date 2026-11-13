import { useTranslations } from "use-intl";

import { Skeleton } from "@components/ui/skeleton";

/** Loading placeholder with the hero's geometry, so nothing shifts on load. */
function ProductDetailsSkeleton() {
  const t = useTranslations("common");

  return (
    <div
      aria-busy
      aria-label={t("loadingProduct")}
      className="flex flex-col gap-14 py-6 lg:flex-row lg:justify-between lg:py-7.75"
    >
      <div className="grid grid-cols-[1fr_--spacing(11)] gap-x-3 gap-y-5 lg:w-136.25 lg:grid-cols-[1fr_--spacing(13)] lg:gap-x-8.75 lg:gap-y-6">
        <Skeleton className="aspect-3/4 rounded-lg" />
        <div />
        <div className="col-span-2 grid grid-cols-5 gap-3.75 lg:col-span-1 lg:gap-5">
          {Array.from({ length: 5 }, (_, index) => (
            <Skeleton key={index} className="aspect-19/25 rounded-lg" />
          ))}
        </div>
      </div>
      <div className="flex flex-col gap-5 lg:w-130 lg:pt-2.25">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-8 w-40" />
        <Skeleton className="mt-6 h-24 w-full" />
        <Skeleton className="h-10 w-80" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="mt-6 h-14.5 w-full" />
      </div>
    </div>
  );
}

export { ProductDetailsSkeleton };
