"use client";

import { useEffect, useState } from "react";
import { ButtonLink } from "@/components/button-link";
import { loadingMessages } from "@/lib/mock-data";

export function LoadingExperience() {
  const [progress, setProgress] = useState(7);
  const [pages, setPages] = useState(1);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setProgress((value) => Math.min(100, value + 7));
      setPages((value) => Math.min(12, value + 1));
    }, 700);

    return () => window.clearInterval(timer);
  }, []);

  const message = loadingMessages[Math.min(loadingMessages.length - 1, Math.floor((progress / 100) * loadingMessages.length))];
  const done = progress >= 100;

  return (
    <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-3xl flex-col items-center justify-center px-6 py-16 text-center">
      <div className="relative mb-10">
        <div className="absolute inset-0 animate-ping rounded-full bg-[#A07FD6]/20" />
        <div className="relative grid h-32 w-32 place-items-center rounded-full bg-gradient-to-br from-[#A07FD6] to-[#7C5CBF] text-5xl shadow-[0_0_0_18px_rgba(237,230,250,1),0_0_0_36px_rgba(124,92,191,0.08)]">
          📖
        </div>
      </div>

      <h1 className="font-serif text-4xl font-black tracking-[-0.04em] text-[#3A2D52]">Sedang Menciptakan Keajaiban...</h1>
      <p className="mt-4 min-h-8 text-base font-black text-[#7C5CBF]">{done ? "Storybook demo siap dipreview! ✨" : message}</p>

      <div className="mt-10 w-full max-w-lg">
        <div className="mb-2 flex justify-between text-sm font-bold text-[#A096B5]">
          <span>Kemajuan</span>
          <span>{progress}%</span>
        </div>
        <div className="h-3 overflow-hidden rounded-full bg-[#F5EDD8]">
          <div className="relative h-full overflow-hidden rounded-full bg-gradient-to-r from-[#7C5CBF] to-[#F28B6E] transition-all duration-500" style={{ width: `${progress}%` }}>
            <div className="absolute inset-0 animate-[shimmer_1.4s_linear_infinite] bg-gradient-to-r from-transparent via-white/30 to-transparent" />
          </div>
        </div>
      </div>

      <div className="mt-10 grid w-full max-w-xl grid-cols-4 gap-3 sm:grid-cols-6">
        {Array.from({ length: 12 }, (_, index) => {
          const ready = index < pages;
          return (
            <div key={index} className={`aspect-[3/4] rounded-xl border-2 p-2 transition ${ready ? "border-white bg-gradient-to-br from-[#E8D5F5] to-[#F28B6E] shadow-lg shadow-[#7C5CBF]/10" : "border-[#F5EDD8] bg-white/60"}`}>
              <div className="flex h-full items-center justify-center rounded-lg bg-white/30 text-sm font-black text-white">{ready ? index + 1 : ""}</div>
            </div>
          );
        })}
      </div>

      <div className="mt-10 flex flex-wrap justify-center gap-3">
        <ButtonLink href="/preview/demo" className={done ? "" : "pointer-events-none opacity-50"}>
          Preview Storybook
        </ButtonLink>
        <ButtonLink href="/generate" variant="secondary">
          Ubah Ide
        </ButtonLink>
      </div>
    </div>
  );
}
