import { type ButtonProps } from "../Button";

export interface IconButtonProps extends Omit<
  ButtonProps,
  "children" | "startIcon" | "endIcon" | "size"
> {
  icon: React.ReactNode;
  /** Required accessible name — the button has no visible text. */
  label: string;
  size?: "icon" | "icon-sm" | "icon-lg";
}
