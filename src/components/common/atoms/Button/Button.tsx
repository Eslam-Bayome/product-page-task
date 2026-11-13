import { Loader2Icon } from "lucide-react";
import { Slot } from "radix-ui";

import { Button as ShadcnButton } from "@components/ui/button";
import { cn } from "@lib/utils";

import { type ButtonProps } from "./Button.types";
import { buttonVariants } from "./Button.variants";

/**
 * Design-system button built on the shadcn primitive. Adds `loading` and
 * icon slots. The loading branch keeps the content in flow (invisible) and
 * overlays the spinner so the button never resizes. `children` goes through
 * `Slot.Slottable` so `asChild` still works with the icon slots.
 */
function Button({
  variant,
  size,
  fullWidth,
  loading = false,
  startIcon,
  endIcon,
  disabled,
  className,
  children,
  ...props
}: ButtonProps) {
  const classes = cn(buttonVariants({ variant, size, fullWidth }), className);

  if (loading) {
    return (
      <ShadcnButton
        disabled
        aria-busy
        className={cn("relative", classes)}
        {...props}
      >
        <Loader2Icon className="absolute inset-0 m-auto animate-spin" />
        <span className="invisible contents">
          {startIcon}
          {children}
          {endIcon}
        </span>
      </ShadcnButton>
    );
  }

  return (
    <ShadcnButton disabled={disabled} className={classes} {...props}>
      {startIcon}
      <Slot.Slottable>{children}</Slot.Slottable>
      {endIcon}
    </ShadcnButton>
  );
}

export { Button };
