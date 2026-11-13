import { cva } from "class-variance-authority";

/**
 * Figma 57:1389 / 61:518: a 75×40 block (a 39px-high grid cell on mobile); when selected (Radix `data-state=on`)
 * it gets a 1px foreground border and a 5px white inset around the swatch.
 */
export const colorSwatchVariants = cva(
  "relative h-9.75 w-full min-w-0 overflow-hidden rounded-md border-0 bg-background p-0 hover:bg-background disabled:cursor-not-allowed disabled:opacity-40 data-[state=on]:border data-[state=on]:border-foreground data-[state=on]:bg-background data-[state=on]:p-1.25 lg:h-10 lg:w-18.75 lg:rounded-lg [&>[data-swatch]]:size-full [&>[data-swatch]]:rounded-md data-[state=on]:[&>[data-swatch]]:rounded-sm lg:data-[state=on]:[&>[data-swatch]]:rounded-md",
);
