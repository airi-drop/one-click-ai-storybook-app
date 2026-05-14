import Link from "next/link";
import type { ComponentProps } from "react";

type ButtonLinkProps = ComponentProps<typeof Link> & {
  variant?: "primary" | "secondary";
};

export function ButtonLink({ className = "", variant = "primary", ...props }: ButtonLinkProps) {
  const variantClass =
    variant === "primary"
      ? "bg-gradient-to-r from-[#7C5CBF] to-[#A07FD6] text-white shadow-xl shadow-[#7C5CBF]/25 hover:-translate-y-0.5 hover:shadow-2xl"
      : "border-2 border-[#F5EDD8] bg-white/80 text-[#6B5B8A] hover:border-[#FBD4C8] hover:text-[#5A3F9A]";

  return <Link className={`inline-flex items-center justify-center rounded-full px-7 py-4 text-sm font-black transition ${variantClass} ${className}`} {...props} />;
}
