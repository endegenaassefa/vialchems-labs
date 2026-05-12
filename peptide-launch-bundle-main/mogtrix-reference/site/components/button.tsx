import type { ButtonHTMLAttributes, AnchorHTMLAttributes } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

const variants = {
  primary: "bg-[var(--accent)] text-black hover:bg-[var(--accent-soft)]",
  outline: "border border-[var(--border)] text-white hover:border-[var(--accent)]",
  ghost: "text-[var(--text-muted)] hover:text-white"
};

export function Button({ className, variant = "primary", ...props }: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: keyof typeof variants }) {
  return (
    <button
      className={cn("inline-flex min-h-11 items-center justify-center rounded-2xl px-5 py-3 text-sm font-semibold transition", variants[variant], className)}
      {...props}
    />
  );
}

export function ButtonLink({
  className,
  variant = "primary",
  href,
  ...props
}: AnchorHTMLAttributes<HTMLAnchorElement> & { href: string; variant?: keyof typeof variants }) {
  return (
    <Link href={href} className={cn("inline-flex min-h-11 items-center justify-center rounded-2xl px-5 py-3 text-sm font-semibold transition", variants[variant], className)} {...props} />
  );
}
