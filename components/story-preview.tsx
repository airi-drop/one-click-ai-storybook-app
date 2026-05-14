"use client";

import { useEffect, useMemo, useState } from "react";
import { ButtonLink } from "@/components/button-link";
import { PageHeader } from "@/components/page-header";
import { StoryPageCard } from "@/components/story-page-card";
import { storyPages } from "@/lib/mock-data";
import { generatedStoryStorageKey, isGeneratedStorybook, type GeneratedStorybook } from "@/lib/storybook";

export function StoryPreview() {
  const [generatedStory, setGeneratedStory] = useState<GeneratedStorybook | null>(null);

  useEffect(() => {
    const storageTimer = window.setTimeout(() => {
      const savedStory = localStorage.getItem(generatedStoryStorageKey);

      if (!savedStory) return;

      try {
        const parsedStory = JSON.parse(savedStory);
        if (isGeneratedStorybook(parsedStory)) setGeneratedStory(parsedStory);
      } catch {
        setGeneratedStory(null);
      }
    }, 0);

    return () => window.clearTimeout(storageTimer);
  }, []);

  const previewPages = useMemo(() => {
    if (!generatedStory) {
      return storyPages.map((page) => ({
        ...page,
        totalPages: storyPages.length,
      }));
    }

    return generatedStory.pages.map((page, index) => {
      const mockVisual = storyPages[index % storyPages.length];

      return {
        page: page.pageNumber,
        title: `Halaman ${page.pageNumber}`,
        text: page.narrative,
        sceneDescription: page.sceneDescription,
        palette: mockVisual.palette,
        emoji: mockVisual.emoji,
        totalPages: generatedStory.pages.length,
      };
    });
  }, [generatedStory]);

  return (
    <main className="mx-auto max-w-6xl px-6 py-12 pb-24 lg:max-w-5xl lg:px-8 xl:max-w-[1080px]">
      <PageHeader
        eyebrow={generatedStory ? "Generated storybook" : "Preview demo"}
        title={generatedStory?.title ?? "Kiko dan Bintang Ajaib"}
        description={
          generatedStory
            ? `Karakter utama: ${generatedStory.characterBible.name}. Cerita ini dibuat dengan Gemini; ilustrasi masih memakai mock visual untuk MVP.`
            : "Empat halaman contoh dari storybook mock. Ilustrasi dibuat dengan gradient dan emoji agar tetap frontend-only tanpa asset eksternal."
        }
      />

      {generatedStory ? (
        <section className="mb-8 rounded-[2rem] bg-white/70 p-6 shadow-xl shadow-[#7C5CBF]/10 backdrop-blur">
          <p className="text-xs font-black uppercase tracking-[0.22em] text-[#F28B6E]">Character Bible</p>
          <div className="mt-4 grid gap-4 md:grid-cols-3">
            <div>
              <h2 className="font-serif text-2xl font-black text-[#3A2D52]">{generatedStory.characterBible.name}</h2>
              <p className="mt-2 text-sm leading-6 text-[#6B5B8A]">{generatedStory.characterBible.description}</p>
            </div>
            <div>
              <h3 className="font-black text-[#3A2D52]">Appearance</h3>
              <p className="mt-2 text-sm leading-6 text-[#6B5B8A]">{generatedStory.characterBible.appearance}</p>
            </div>
            <div>
              <h3 className="font-black text-[#3A2D52]">Personality</h3>
              <p className="mt-2 text-sm leading-6 text-[#6B5B8A]">{generatedStory.characterBible.personality}</p>
            </div>
          </div>
        </section>
      ) : null}

      <div className="space-y-8 lg:space-y-6">
        {previewPages.map((storyPage) => (
          <StoryPageCard key={storyPage.page} storyPage={storyPage} />
        ))}
      </div>
      <div className="mt-10 flex flex-wrap justify-center gap-3">
        <ButtonLink href="/export/demo">Ekspor Demo</ButtonLink>
        <ButtonLink href="/generate" variant="secondary">Edit Ide</ButtonLink>
      </div>
    </main>
  );
}
