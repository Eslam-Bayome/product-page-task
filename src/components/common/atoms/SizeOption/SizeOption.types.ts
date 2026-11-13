import { type ToggleGroupItem } from "@components/ui/toggle-group";

export interface SizeOptionProps extends Omit<
  React.ComponentProps<typeof ToggleGroupItem>,
  "size" | "variant"
> {
  children: React.ReactNode;
}
