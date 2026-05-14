"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ButtonLink } from "@/components/button-link";
import { storyPages } from "@/lib/mock-data";
import { draftStorageKey, generatedStoryStorageKey, isGeneratedStorybook, type StorybookFormInput } from "@/lib/storybook";

type DraftStory = Partial<StorybookFormInput>;
type GenerationStatus = "generating" | "success" | "error";

const stages = [
  "Menyusun cerita...",
  "Membuat karakter...",
  "Menggambar halaman...",
  "Menyusun storybook...",
];

const previewPages = Array.from({ length: 12 }, (_, index) => {
  const source = storyPages[index % storyPages.length];
  return {
    page: index + 1,
    palette: source.palette,
    emoji: source.emoji,
  };
});

export function LoadingExperience() {
  const router = useRouter();
  const [progress, setProgress] = useState(0);
  const [draft, setDraft] = useState<DraftStory | null>(null);
  const [status, setStatus] = useState<GenerationStatus>("generating");
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    const draftTimer = window.setTimeout(() => {
      const savedDraft = localStorage.getItem(draftStorageKey);
      let parsedDraft: DraftStory | null = null;

      if (savedDraft) {
        try {
          parsedDraft = JSON.parse(savedDraft) as DraftStory;
        } catch {
          parsedDraft = null;
        }
      }

      if (!parsedDraft || (!parsedDraft.tema && !parsedDraft.karakter)) {
        if (!cancelled) {
          setStatus("error");
          setError("Isi form cerita terlebih dahulu sebelum membuat storybook.");
        }
        return;
      }

      setDraft(parsedDraft);

      fetch("/api/storybooks/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsedDraft),
      })
        .then(async (response) => {
          const payload = (await response.json()) as { storybook?: unknown; error?: string };

          if (!response.ok) throw new Error(payload.error || "Story generation failed.");
          if (!isGeneratedStorybook(payload.storybook)) throw new Error("Generated storybook response was incomplete.");

          localStorage.setItem(generatedStoryStorageKey, JSON.stringify(payload.storybook));

          if (!cancelled) {
            setProgress(100);
            setStatus("success");
          }
        })
        .catch((generationError: unknown) => {
          if (!cancelled) {
            setStatus("error");
            setError(generationError instanceof Error ? generationError.message : "Gagal membuat storybook.");
          }
        });
    }, 0);

    return () => {
      cancelled = true;
      window.clearTimeout(draftTimer);
    };
  }, []);

  useEffect(() => {
    if (status !== "generating") return;

    const timer = window.setInterval(() => {
      setProgress((value) => Math.min(94, value + 2));
    }, 90);

    return () => window.clearInterval(timer);
  }, [status]);

  useEffect(() => {
    if (status !== "success") return;

    const redirectTimer = window.setTimeout(() => {
      router.replace("/preview/demo");
    }, 850);

    return () => window.clearTimeout(redirectTimer);
  }, [router, status]);

  const stageIndex = Math.min(stages.length - 1, Math.floor(progress / 25));
  const activeStage = status === "error" ? "Storybook belum berhasil dibuat." : progress >= 100 ? "Storybook siap dipreview..." : stages[stageIndex];
  const generatedPages = Math.min(previewPages.length, Math.floor((progress / 100) * previewPages.length));
  const displayTitle = useMemo(() => {
    if (draft?.tema) return draft.tema;
    if (draft?.karakter) return `Cerita untuk ${draft.karakter}`;
    return "Kiko dan Bintang Ajaib";
  }, [draft]);

  return (
    <div className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-6xl items-center gap-10 px-6 py-12 lg:max-w-5xl lg:grid-cols-[0.9fr_1.1fr] lg:px-8 xl:max-w-[1080px]">
      <section className="text-center lg:text-left">
        <div className="relative mx-auto mb-9 grid h-32 w-32 place-items-center lg:mx-0">
          <div className="absolute inset-0 animate-ping rounded-full bg-[#A07FD6]/20" />
          <div className="absolute inset-[-1.15rem] rounded-full border border-[#FBD4C8]/70" />
          <div className="relative grid h-32 w-32 place-items-center rounded-full bg-gradient-to-br from-[#A07FD6] via-[#7C5CBF] to-[#F28B6E] text-5xl shadow-[0_0_0_18px_rgba(237,230,250,0.95),0_24px_60px_rgba(124,92,191,0.22)]">
            📖
          </div>
        </div>

        <p className="mb-3 text-sm font-black uppercase tracking-[0.28em] text-[#F28B6E]">AI generation</p>
        <h1 className="font-serif text-4xl font-black tracking-[-0.04em] text-[#3A2D52] sm:text-5xl">Sedang Menciptakan Keajaiban...</h1>
        <p className="mt-4 min-h-8 text-base font-black text-[#7C5CBF]">{activeStage}</p>
        <p className="mx-auto mt-3 max-w-xl text-sm font-semibold leading-7 text-[#6B5B8A] lg:mx-0">
          {status === "error" ? error : displayTitle}
        </p>

        <div className="mt-9 w-full">
          <div className="mb-2 flex justify-between text-sm font-bold text-[#A096B5]">
            <span>Kemajuan</span>
            <span>{progress}%</span>
          </div>
          <div className="h-3 overflow-hidden rounded-full bg-[#F5EDD8] shadow-inner">
            <div className="relative h-full overflow-hidden rounded-full bg-gradient-to-r from-[#7C5CBF] via-[#A07FD6] to-[#F28B6E] transition-all duration-300 ease-out" style={{ width: `${progress}%` }}>
              <div className="absolute inset-0 animate-[shimmer_1.4s_linear_infinite] bg-gradient-to-r from-transparent via-white/35 to-transparent" />
            </div>
          </div>
        </div>

        <div className="mt-8 grid gap-3">
          {stages.map((stage, index) => {
            const complete = progress >= (index + 1) * 25;
            const active = index === stageIndex && progress < 100;

            return (
              <div key={stage} className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-left transition ${active ? "bg-white shadow-lg shadow-[#7C5CBF]/10" : "bg-white/45"}`}>
                <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-full text-xs font-black transition ${complete ? "bg-[#7EC8A0] text-white" : active ? "bg-[#7C5CBF] text-white" : "bg-[#F5EDD8] text-[#A096B5]"}`}>
                  {complete ? "✓" : index + 1}
                </span>
                <span className={`text-sm font-black ${active || complete ? "text-[#3A2D52]" : "text-[#A096B5]"}`}>{stage}</span>
              </div>
            );
          })}
        </div>

        {status === "error" ? (
          <div className="mt-8 flex flex-wrap justify-center gap-3 lg:justify-start">
            <ButtonLink href="/generate">Edit Form</ButtonLink>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="rounded-full border-2 border-[#F5EDD8] bg-white/80 px-7 py-4 text-sm font-black text-[#6B5B8A] transition hover:border-[#FBD4C8] hover:text-[#5A3F9A]"
            >
              Coba Lagi
            </button>
          </div>
        ) : null}
      </section>

      <section className="rounded-[2rem] bg-white/70 p-4 shadow-2xl shadow-[#7C5CBF]/10 backdrop-blur sm:p-6">
        <div className="mb-5 flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.22em] text-[#F28B6E]">Preview halaman</p>
            <h2 className="mt-1 font-serif text-2xl font-black text-[#3A2D52]">Storyboard sedang tumbuh</h2>
          </div>
          <span className="rounded-full bg-[#EDE6FA] px-3 py-1 text-xs font-black text-[#7C5CBF]">{generatedPages}/12</span>
        </div>

        <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
          {previewPages.map((page, index) => {
            const ready = index < generatedPages;
            const current = index === generatedPages && progress < 100;

            return (
              <div
                key={page.page}
                className={`aspect-[3/4] overflow-hidden rounded-2xl border-2 p-1.5 transition-all duration-500 ${
                  ready
                    ? "scale-100 border-white bg-white shadow-lg shadow-[#7C5CBF]/12"
                    : current
                      ? "scale-[1.02] border-[#FBD4C8] bg-[#FEF0EB] shadow-lg shadow-[#F28B6E]/10"
                      : "border-[#F5EDD8] bg-white/55"
                }`}
              >
                <div className={`grid h-full place-items-center rounded-[1rem] bg-gradient-to-br ${ready ? page.palette : "from-[#FDF8F0] to-[#F5EDD8]"} transition`}>
                  {ready ? (
                    <div className="text-center">
                      <div className="text-2xl drop-shadow-md sm:text-3xl">{page.emoji}</div>
                      <div className="mt-2 rounded-full bg-white/30 px-2 py-0.5 text-[10px] font-black text-white backdrop-blur">Hal {page.page}</div>
                    </div>
                  ) : current ? (
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#FBD4C8] border-t-[#7C5CBF]" />
                  ) : (
                    <span className="text-xs font-black text-[#D8CDBA]">{page.page}</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <p className="mt-5 text-center text-sm font-bold text-[#A096B5]">
          {status === "error" ? "Koneksi AI belum siap. Cek API key atau coba lagi." : progress >= 100 ? "Mengantar kamu ke preview demo..." : "Storybook asli sedang dibuat dengan Gemini. Ilustrasi tetap mock untuk sekarang."}
        </p>
      </section>
    </div>
  );
}
