import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Button({ className, children, ...props }: ButtonHTMLAttributes<HTMLButtonElement>) {
  return <button className={cn("inline-flex h-11 items-center justify-center rounded-xl bg-white px-5 text-sm font-semibold text-black transition duration-200 hover:-translate-y-0.5 hover:bg-stone-200 active:translate-y-0 active:scale-[.98] disabled:cursor-not-allowed disabled:opacity-50", className)} {...props}>{children}</button>;
}

export function LinkButton({ href, children, className }: { href: string; children: ReactNode; className?: string }) {
  return <Link href={href} className={cn("inline-flex h-11 items-center justify-center rounded-xl bg-white px-5 text-sm font-semibold text-black transition duration-200 hover:-translate-y-0.5 hover:bg-stone-200 active:translate-y-0 active:scale-[.98]", className)}>{children}</Link>;
}

export function Badge({ children, className }: { children: ReactNode; className?: string }) {
  return <span className={cn("inline-flex rounded-full bg-stone-800 px-3 py-1 text-xs font-semibold text-stone-200 ring-1 ring-stone-700", className)}>{children}</span>;
}

export function Field({ label, children, hint }: { label: string; children: ReactNode; hint?: string }) {
  return <label className="grid gap-2 text-sm font-semibold leading-6 text-stone-200">{label}{children}{hint && <span className="text-sm font-normal leading-5 text-stone-500">{hint}</span>}</label>;
}

export const inputClass = "min-h-12 w-full rounded-xl border border-stone-600 bg-stone-900 px-4 text-base text-white outline-none transition placeholder:text-stone-500 focus:border-white focus:ring-4 focus:ring-white/10";
