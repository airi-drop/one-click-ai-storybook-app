import type { Metadata } from "next";
import { Nav } from "@/components/nav";
import "./globals.css";

export const metadata: Metadata = {
  title: "StoryMagic — One-click AI Storybook",
  description: "A warm magical mock frontend for generating children's storybooks.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="id" className="antialiased">
      <body className="font-sans">
        <Nav />
        {children}
      </body>
    </html>
  );
}
