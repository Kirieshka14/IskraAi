import Image from "next/image";
import { cn } from "@/lib/utils";

const basePath = process.env.GITHUB_PAGES === "true" ? "/IskraAi" : "";

type BrandMarkProps = {
  className?: string;
  title?: string;
};

export function BrandMark({ className, title }: BrandMarkProps) {
  return (
    <Image
      src={`${basePath}/logo.jpg`}
      alt={title ?? ""}
      width={64}
      height={64}
      unoptimized
      className={cn("brand-mark", className)}
      aria-hidden={title ? undefined : true}
    />
  );
}
