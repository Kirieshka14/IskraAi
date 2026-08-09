import { cn } from "@/lib/utils";

type BrandMarkProps = {
  className?: string;
  title?: string;
};

/** Four-point Iskra mark with the small crescent from the supplied reference. */
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
      <path d="M28 2L34.2 23.8L56 30L34.2 36.2L28 58L21.8 36.2L0 30L21.8 23.8L28 2Z" fill="currentColor" /><path d="M55 8c-6 1.2-10 6.5-10 12.5S49 31.8 55 33c-3.2 2.8-8 3.2-11.7.8A14.5 14.5 0 0 1 55 8Z" fill="currentColor" opacity=".9" />
    </svg>
  );
}
