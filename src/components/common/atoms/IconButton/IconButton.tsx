import { Button } from "../Button";
import { type IconButtonProps } from "./IconButton.types";

/** Square icon-only button (share, wishlist, gallery prev/next). */
function IconButton({
  icon,
  label,
  variant = "soft",
  size = "icon",
  ...props
}: IconButtonProps) {
  return (
    <Button
      variant={variant}
      size={size}
      aria-label={label}
      title={label}
      {...props}
    >
      {icon}
    </Button>
  );
}

export { IconButton };
