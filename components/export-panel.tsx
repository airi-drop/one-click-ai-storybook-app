"use client";

import { useState } from "react";
import { exportOptions } from "@/lib/mock-data";

export function ExportPanel() {
  const [selected, setSelected] = useState(exportOptions[0].id);
  const [status, setStatus] = useState<"idle" | "downloading" | "success">("idle");

  function handleDownload() {
    setStatus("downloading");
    window.setTimeout(() => setStatus("success"), 1800);
  }

  if (status === "success") {
    return (
      <section className="mx-auto max-w-2xl rounded-[2rem] bg-white p-8 text-center shadow-xl shadow-[#7C5CBF]/10 sm:p-10">
        <div className="mx-auto mb-8 grid h-28 w-28 place-items-center rounded-full bg-gradient-to-br from-[#7EC8A0] to-[#4CA87A] text-5xl shadow-[0_0_0_16px_rgba(232,247,239,1)]">🎉</div>
        <h1 className="font-serif text-3xl font-black text-[#3A2D52]">Unduhan Berhasil!</h1>
        <p className="mx-auto mt-4 max-w-md leading-8 text-[#6B5B8A]">Storybook mock <strong>“Kiko dan Bintang Ajaib”</strong> telah disiapkan. Ini hanya simulasi frontend, jadi tidak ada file nyata yang dibuat.</p>
        <button type="button" onClick={() => setStatus("idle")} className="mt-8 rounded-full bg-gradient-to-r from-[#7C5CBF] to-[#A07FD6] px-7 py-3 text-sm font-black text-white shadow-lg shadow-[#7C5CBF]/25">
          Ekspor Lagi
        </button>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-4xl">
      <div className="grid gap-5 md:grid-cols-2">
        {exportOptions.map((option) => {
          const active = selected === option.id;
          return (
            <button
              key={option.id}
              type="button"
              onClick={() => setSelected(option.id)}
              className={`rounded-[2rem] border-2 bg-white p-6 text-left shadow-xl shadow-[#7C5CBF]/10 transition hover:-translate-y-1 ${active ? "border-[#7C5CBF]" : "border-transparent"}`}
            >
              <div className="mb-4 flex items-start justify-between gap-4">
                <span className="text-5xl">{option.icon}</span>
                <span className={`rounded-full px-3 py-1 text-xs font-black ${active ? "bg-[#EDE6FA] text-[#7C5CBF]" : "bg-[#F5EDD8] text-[#A096B5]"}`}>{option.size}</span>
              </div>
              <h2 className="font-serif text-2xl font-black text-[#3A2D52]">{option.title}</h2>
              <p className="mt-3 text-sm leading-7 text-[#6B5B8A]">{option.description}</p>
              <ul className="mt-5 space-y-2 text-sm font-bold text-[#6B5B8A]">
                {option.features.map((feature) => (
                  <li key={feature}>✓ {feature}</li>
                ))}
              </ul>
            </button>
          );
        })}
      </div>

      <div className="mt-8 rounded-[2rem] bg-white p-6 shadow-xl shadow-[#7C5CBF]/10">
        <button
          type="button"
          onClick={handleDownload}
          disabled={status === "downloading"}
          className="w-full rounded-full bg-gradient-to-r from-[#7C5CBF] to-[#A07FD6] px-7 py-4 text-base font-black text-white shadow-lg shadow-[#7C5CBF]/25 transition disabled:cursor-wait disabled:opacity-70"
        >
          {status === "downloading" ? "⏳ Menyiapkan mock file..." : "📥 Unduh Storybook Demo"}
        </button>
        {status === "downloading" ? (
          <div className="mt-5">
            <div className="h-2 overflow-hidden rounded-full bg-[#F5EDD8]">
              <div className="h-full animate-[downloadProgress_1.8s_ease_forwards] rounded-full bg-gradient-to-r from-[#7C5CBF] to-[#A07FD6]" />
            </div>
            <p className="mt-3 text-center text-sm font-semibold text-[#A096B5]">Mengompresi halaman dan memfinalisasi PDF demo...</p>
          </div>
        ) : null}
      </div>
    </section>
  );
}
