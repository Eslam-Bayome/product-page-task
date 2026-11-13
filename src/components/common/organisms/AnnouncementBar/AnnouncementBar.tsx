import { useTranslations } from "use-intl";

import { useCountdown } from "@hooks/use-countdown";
import { cn } from "@lib/utils";

import { type AnnouncementBarProps } from "./AnnouncementBar.types";

/** Promo strip above the header with a live countdown (Figma 57:1524 / 61:405). */
function AnnouncementBar({
  durationSeconds,
  className,
  ...props
}: AnnouncementBarProps) {
  const t = useTranslations("announcement");
  const timeLeft = useCountdown(durationSeconds);

  return (
    <div
      className={cn(
        "flex justify-center bg-announcement px-5 py-3 text-announcement-foreground",
        className,
      )}
      {...props}
    >
      {/* The timer runs inline so on mobile it follows the last line, as in Figma. */}
      <p className="max-w-60.75 text-14 leading-tight font-medium whitespace-pre-wrap lg:max-w-none">
        {t("message")}
        <span
          role="timer"
          aria-label={t("endsIn", { time: timeLeft })}
          className="ms-4 inline-flex h-4 min-w-11 items-center justify-center rounded-full bg-announcement-muted px-1.5 align-bottom text-11 leading-none font-medium tabular-nums lg:h-4.5 lg:min-w-12.25 lg:align-middle lg:text-12"
        >
          {timeLeft}
        </span>
      </p>
    </div>
  );
}

export { AnnouncementBar };
