import { cn } from "@/lib/utils";

type BrandMarkProps = {
  className?: string;
  title?: string;
};

/** A clean, single-colour four-ray spark derived from the IskraAi visual direction. */
export function BrandMark({ className, title }: BrandMarkProps) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("brand-mark", className)}
      role={title ? "img" : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
      focusable="false"
    >
      <path d="M32 2L38.7 25.3L62 32L38.7 38.7L32 62L25.3 38.7L2 32L25.3 25.3L32 2Z" fill="currentColor" />
    </svg>
  );
}
