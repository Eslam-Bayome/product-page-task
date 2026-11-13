import { MinusIcon, PlusIcon } from "lucide-react";
import { useTranslations } from "use-intl";

import { cn } from "@lib/utils";

import { type QuantitySelectorProps } from "./QuantitySelector.types";
import { IconButton } from "../../atoms/IconButton";

/** Stepper clamped to [min, max]; the value is announced via `aria-live`. */
function QuantitySelector({
  value,
  onChange,
  min = 1,
  max = Number.POSITIVE_INFINITY,
  disabled = false,
  size = "md",
  label,
  className,
  ...props
}: QuantitySelectorProps) {
  const t = useTranslations("product");
  const buttonSize = size === "sm" ? "icon-sm" : "icon";

  return (
    <div
      role="group"
      aria-label={t("selectQuantity", { label })}
      className={cn(
        "inline-flex items-center rounded-md border border-border",
        className,
      )}
      {...props}
    >
      <IconButton
        variant="ghost"
        size={buttonSize}
        icon={<MinusIcon />}
        label={t("decrease", { label })}
        disabled={disabled || value <= min}
        onClick={() => onChange(Math.max(min, value - 1))}
      />
      <output
        aria-live="polite"
        className={cn(
          "min-w-8 text-center font-semibold tabular-nums",
          size === "sm" ? "text-12" : "text-14",
        )}
      >
        {value}
      </output>
      <IconButton
        variant="ghost"
        size={buttonSize}
        icon={<PlusIcon />}
        label={t("increase", { label })}
        disabled={disabled || value >= max}
        onClick={() => onChange(Math.min(max, value + 1))}
      />
    </div>
  );
}

export { QuantitySelector };
