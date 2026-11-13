import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

// Teach tailwind-merge the numeric font sizes from typography.css, otherwise
// it reads `text-16` as a colour and drops `text-foreground` next to it.
const twMerge = extendTailwindMerge({
  extend: {
    theme: {
      text: [
        "8",
        "11",
        "12",
        "13",
        "14",
        "16",
        "18",
        "20",
        "23",
        "24",
        "28",
        "36",
      ],
    },
  },
});

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
