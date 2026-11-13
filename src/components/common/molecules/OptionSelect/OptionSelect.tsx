import chevronDownIcon from "@/assets/icons/chevron-down-sm.svg";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@components/ui/dropdown-menu";
import { cn } from "@lib/utils";

import { type OptionSelectProps } from "./OptionSelect.types";

function OptionIcon({ src }: { src: string }) {
  return (
    <span className="h-3.5 w-4.5 shrink-0 overflow-hidden">
      <img src={src} alt="" className="h-3.5 max-w-none" />
    </span>
  );
}

/**
 * Text trigger with a chevron that opens a single-choice menu — the footer's
 * language / currency selectors (Figma 57:3788).
 */
function OptionSelect<T extends string>({
  label,
  value,
  options,
  onValueChange,
  className,
}: OptionSelectProps<T>) {
  const selected = options.find((option) => option.value === value);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label={`${label}: ${selected?.label ?? value}`}
        className={cn(
          "flex items-center gap-2 text-14 leading-6 font-medium text-footer-foreground outline-none",
          className,
        )}
      >
        {selected?.iconUrl && <OptionIcon src={selected.iconUrl} />}
        <span className="flex items-center gap-0.5">
          {selected?.label ?? value}
          <img src={chevronDownIcon} alt="" className="size-4.5" />
        </span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuRadioGroup
          value={value}
          onValueChange={(next) => onValueChange(next as T)}
        >
          {options.map((option) => (
            <DropdownMenuRadioItem
              key={option.value}
              value={option.value}
              className="gap-2"
            >
              {option.iconUrl && <OptionIcon src={option.iconUrl} />}
              {option.label}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export { OptionSelect };
