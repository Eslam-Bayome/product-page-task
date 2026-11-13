import { cn } from "@lib/utils";

/** The design's 1200px content column with a 20px gutter on small screens. */
function PageContainer({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn("mx-auto w-full max-w-310 px-5", className)}
      {...props}
    />
  );
}

export { PageContainer };
