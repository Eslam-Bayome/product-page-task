export interface SelectOption<T extends string> {
  value: T;
  label: string;
  /** Optional leading image, e.g. a flag. */
  iconUrl?: string;
}

export interface OptionSelectProps<T extends string> {
  /** Accessible name of the trigger, e.g. "Language". */
  label: string;
  value: T;
  options: SelectOption<T>[];
  onValueChange: (value: T) => void;
  className?: string;
}
