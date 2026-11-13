import { XIcon } from "lucide-react";
import { useTranslations } from "use-intl";

import { SheetClose } from "@components/ui/sheet";
import { cn } from "@lib/utils";

import { type SheetCloseButtonProps } from "./SheetCloseButton.types";
import { IconButton } from "../../atoms/IconButton";

/**
 * Close button for a `SheetContent` rendered with `showCloseButton={false}`.
 * The primitive's own button sits at the physical right with an English label;
 * this one sits at the inline end, so it never covers the title in Arabic.
 */
function SheetCloseButton({ className }: SheetCloseButtonProps) {
  const t = useTranslations("common");

  return (
    <SheetClose asChild>
      <IconButton
        variant="ghost"
        size="icon-sm"
        label={t("close")}
        icon={<XIcon className="size-4" />}
        className={cn("absolute end-3 top-3", className)}
      />
    </SheetClose>
  );
}

export { SheetCloseButton };
