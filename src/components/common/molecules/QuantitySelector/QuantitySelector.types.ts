export interface QuantitySelectorProps extends Omit<
  React.ComponentProps<"div">,
  "onChange"
> {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  disabled?: boolean;
  size?: "sm" | "md";
  /** Names the stepper in its accessible labels, e.g. "Sneakers quantity". */
  label: string;
}
