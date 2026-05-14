"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/", label: "Beranda" },
  { href: "/generate", label: "Buat" },
  { href: "/preview/demo", label: "Preview" },
  { href: "/export/demo", label: "Ekspor" },
];

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function Nav() {
  const pathname = usePathname();

  return (
    <nav className="sticky top-0 z-50 border-b border-[#FBD4C8] bg-[#FDF8F0]/85 px-4 py-3 backdrop-blur-xl sm:px-8 lg:bg-[#FDF8F0]/88 lg:px-10">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 max-[520px]:flex-wrap max-[520px]:justify-center max-[520px]:gap-y-3 lg:max-w-5xl xl:max-w-[1080px]">
        <Link href="/" className="group inline-flex items-center gap-1.5 font-serif text-xl font-black tracking-[-0.03em] text-[#7C5CBF] transition sm:text-2xl lg:gap-3 lg:rounded-full lg:bg-white/55 lg:py-1.5 lg:pl-1.5 lg:pr-5 lg:shadow-sm lg:shadow-[#7C5CBF]/10 lg:ring-1 lg:ring-[#F5EDD8]/80 lg:hover:bg-white/75">
          <span className="grid h-5 w-5 place-items-center rounded-full bg-gradient-to-br from-[#7C5CBF] to-[#F28B6E] font-serif text-xs font-black text-white shadow-sm shadow-[#7C5CBF]/20 transition group-hover:scale-105 sm:h-6 sm:w-6 sm:text-sm lg:h-10 lg:w-10 lg:text-xl lg:shadow-md">
            *
          </span>
          <span>StoryMagic</span>
        </Link>
        <div className="flex flex-wrap justify-end gap-2 max-[520px]:w-full max-[520px]:justify-center max-[520px]:gap-1.5 lg:gap-2.5">
          {navItems.map((item) => {
            const active = isActive(pathname, item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-full px-3 py-1.5 text-sm font-extrabold transition max-[520px]:px-2.5 sm:px-4 lg:px-4 lg:py-2 ${
                  active ? "bg-[#7C5CBF] text-white shadow-lg shadow-[#7C5CBF]/20" : "text-[#6B5B8A] hover:bg-white/70 hover:text-[#5A3F9A]"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
