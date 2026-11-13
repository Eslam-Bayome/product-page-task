import { useEffect, useState } from "react";

const pad = (value: number) => String(value).padStart(2, "0");

/** `mm:ss`, or `h:mm:ss` from one hour up. */
export const formatCountdown = (totalSeconds: number) => {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return hours > 0
    ? `${hours}:${pad(minutes)}:${pad(seconds)}`
    : `${pad(minutes)}:${pad(seconds)}`;
};

/**
 * Promotional countdown from `durationSeconds` to zero, ticking each second
 * and starting over when it runs out. Returns the formatted time left.
 */
export const useCountdown = (durationSeconds: number) => {
  const [secondsLeft, setSecondsLeft] = useState(durationSeconds);
  const [duration, setDuration] = useState(durationSeconds);

  // A new duration restarts the countdown (adjusted during render, not in an effect).
  if (duration !== durationSeconds) {
    setDuration(durationSeconds);
    setSecondsLeft(durationSeconds);
  }

  useEffect(() => {
    if (durationSeconds <= 0) return;

    const id = window.setInterval(() => {
      setSecondsLeft((left) => (left <= 1 ? durationSeconds : left - 1));
    }, 1000);
    return () => window.clearInterval(id);
  }, [durationSeconds]);

  return formatCountdown(secondsLeft);
};
