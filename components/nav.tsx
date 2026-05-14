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
    <nav className="sticky top-0 z-50 border-b border-[#FBD4C8] bg-[#FDF8F0]/85 px-4 py-3 backdrop-blur-xl sm:px-8">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4">
        <Link href="/" className="font-serif text-xl font-black tracking-[-0.03em] text-[#7C5CBF] sm:text-2xl">
          ✦ StoryMagic
        </Link>
        <div className="flex flex-wrap justify-end gap-2">
          {navItems.map((item) => {
            const active = isActive(pathname, item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-full px-3 py-1.5 text-sm font-extrabold transition sm:px-4 ${
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
