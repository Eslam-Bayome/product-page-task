import { useId } from "react";
import { useTranslations } from "use-intl";

import { ToggleGroup } from "@components/ui/toggle-group";
import { cn } from "@lib/utils";

import { type VariationGroupProps } from "./VariationGroup.types";
import { ColorSwatch } from "../../atoms/ColorSwatch";
import { SizeOption } from "../../atoms/SizeOption";

/** "Color: Brown" label plus a single-select row of swatches or text options. */
function VariationGroup({
  name,
  type,
  options,
  value,
  onValueChange,
  action,
  className,
}: VariationGroupProps) {
  const t = useTranslations("product");
  const labelId = useId();
  const selected = options.find((option) => option.value === value);

  return (
    <div className={cn("flex flex-col gap-4.5", className)}>
      <div className="flex items-center justify-between gap-4">
        <p
          id={labelId}
          className="text-18 leading-tight font-medium text-subtle-foreground capitalize lg:text-20"
        >
          {name}:{" "}
          <span className="font-semibold text-heading">
            {selected?.label ?? t("select")}
          </span>
        </p>
        {action}
      </div>
      <ToggleGroup
        type="single"
        aria-labelledby={labelId}
        value={value ?? ""}
        // Radix emits "" when the active item is clicked again; keep the selection.
        onValueChange={(next) => next && onValueChange(next)}
        // Figma 61:517 / 57:1388: four equal columns on mobile, fixed 75px tiles on desktop.
        className="grid w-full grid-cols-4 gap-x-3.25 gap-y-5.5 lg:flex lg:w-fit lg:flex-wrap lg:gap-x-3.5 lg:gap-y-3.5"
      >
        {options.map((option) =>
          type === "image" ? (
            <ColorSwatch
              key={option.value}
              value={option.value}
              label={option.label}
              imageUrl={option.imageUrl}
              disabled={option.disabled}
            />
          ) : (
            <SizeOption
              key={option.value}
              value={option.value}
              disabled={option.disabled}
            >
              {option.label}
            </SizeOption>
          ),
        )}
      </ToggleGroup>
    </div>
  );
}

export { VariationGroup };
