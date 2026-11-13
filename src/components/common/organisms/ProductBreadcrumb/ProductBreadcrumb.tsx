import { Fragment } from "react";
import { useTranslations } from "use-intl";

import arrowIcon from "@/assets/icons/arrow-right.svg";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@components/ui/breadcrumb";
import { cn } from "@lib/utils";

import { type ProductBreadcrumbProps } from "./ProductBreadcrumb.types";

/**
 * Homepage › category › product (Figma 57:1334 / 61:428). On mobile the
 * product name drops to its own line, as in the design.
 */
function ProductBreadcrumb({
  productName,
  categories,
  className,
  ...props
}: ProductBreadcrumbProps) {
  const t = useTranslations("breadcrumb");
  const category = categories[0];
  const trail = [
    { label: t("home"), href: "/" },
    ...(category
      ? [{ label: category.name, href: `/?category=${category.slug}` }]
      : []),
  ];

  return (
    <Breadcrumb
      aria-label={t("label")}
      className={cn("py-6 lg:py-7.75", className)}
      {...props}
    >
      <BreadcrumbList className="gap-x-2 gap-y-0.75 text-13 leading-relaxed font-medium text-subtle-foreground lg:text-16">
        {trail.map((crumb) => (
          <Fragment key={crumb.href}>
            <BreadcrumbItem>
              <BreadcrumbLink href={crumb.href} className="hover:text-heading">
                {crumb.label}
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator>
              <img src={arrowIcon} alt="" className="size-3 rtl:-scale-x-100" />
            </BreadcrumbSeparator>
          </Fragment>
        ))}
        <BreadcrumbItem className="basis-full lg:basis-auto">
          <BreadcrumbPage className="text-14 text-heading lg:text-16">
            {productName}
          </BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}

export { ProductBreadcrumb };
