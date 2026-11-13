import { cn } from "@lib/utils";

import { type SectionHeaderProps } from "./SectionHeader.types";
import { Typography } from "../../atoms/Typography";

/** Section title with an end-aligned action, e.g. "View All" (Figma 57:1442). */
function SectionHeader({
  title,
  action,
  as = "h2",
  className,
  ...props
}: SectionHeaderProps) {
  return (
    <div
      className={cn("flex items-end justify-between gap-4", className)}
      {...props}
    >
      <Typography as={as} variant="heading" className="max-lg:text-heading">
        {title}
      </Typography>
      {action}
    </div>
  );
}

export { SectionHeader };
