"use client";

import { useEffect, useMemo, useState } from "react";
import { ButtonLink } from "@/components/button-link";
import { PageHeader } from "@/components/page-header";
import { StoryPageCard } from "@/components/story-page-card";
import { storyPages } from "@/lib/mock-data";
import {
  generatedPageImageStorageKey,
  generatedStoryStorageKey,
  isGeneratedPageImage,
  isGeneratedStorybook,
  type GeneratedPageImage,
  type GeneratedStorybook,
} from "@/lib/storybook";

type PreviewStoryPage = {
  page: number;
  title: string;
  text: string;
  palette: string;
  emoji: string;
  sceneDescription?: string;
  totalPages: number;
};

function getPageImagePrompt(storyPage: PreviewStoryPage) {
  return (
    storyPage.sceneDescription ??
    `Character consistency: orange kitten named Kiko with bright curious eyes. Scene: ${storyPage.title}. ${storyPage.text} Soft watercolor children's book illustration, cozy bedtime palette, rounded shapes, gentle texture. Negative prompt: scary, dark horror, violence, sharp teeth, angry expression, realistic photo, text, watermark, cluttered background.`
  );
}

export function StoryPreview() {
  const [generatedStory, setGeneratedStory] = useState<GeneratedStorybook | null>(null);
  const [selectedPage, setSelectedPage] = useState(1);
  const [generatedImage, setGeneratedImage] = useState<GeneratedPageImage | null>(null);
  const [imageError, setImageError] = useState("");
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);

  useEffect(() => {
    const storageTimer = window.setTimeout(() => {
      const savedStory = localStorage.getItem(generatedStoryStorageKey);
      const savedImage = localStorage.getItem(generatedPageImageStorageKey);

      if (savedImage) {
        try {
          const parsedImage = JSON.parse(savedImage);
          if (isGeneratedPageImage(parsedImage)) setGeneratedImage(parsedImage);
        } catch {
          setGeneratedImage(null);
        }
      }

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

  const previewPages = useMemo<PreviewStoryPage[]>(() => {
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

  const activeSelectedPage = previewPages.some((page) => page.page === selectedPage)
    ? selectedPage
    : previewPages[0]?.page ?? 1;
  const selectedStoryPage = previewPages.find((page) => page.page === activeSelectedPage) ?? previewPages[0];
  const selectedImagePrompt = selectedStoryPage ? getPageImagePrompt(selectedStoryPage) : "";
  const selectedGeneratedImage =
    generatedImage?.pageNumber === selectedStoryPage?.page && generatedImage.prompt === selectedImagePrompt
      ? generatedImage
      : null;

  async function handleGenerateTestImage() {
    if (!selectedStoryPage || !selectedImagePrompt) return;

    setImageError("");
    setIsGeneratingImage(true);

    try {
      const response = await fetch("/api/storybooks/images/test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pageNumber: selectedStoryPage.page,
          prompt: selectedImagePrompt,
        }),
      });

      const payload = (await response.json()) as { image?: unknown; error?: string };

      if (!response.ok) {
        throw new Error(payload.error ?? "Image generation failed.");
      }

      if (!isGeneratedPageImage(payload.image)) {
        throw new Error("Image generation returned an unexpected response.");
      }

      setGeneratedImage(payload.image);

      try {
        localStorage.setItem(generatedPageImageStorageKey, JSON.stringify(payload.image));
      } catch {
        setImageError("Image generated, but it could not be saved in localStorage. The image may be too large.");
      }
    } catch (error) {
      setImageError(error instanceof Error ? error.message : "Image generation failed.");
    } finally {
      setIsGeneratingImage(false);
    }
  }

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

      <section className="mb-8 rounded-[2rem] bg-white/70 p-6 shadow-xl shadow-[#7C5CBF]/10 backdrop-blur">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.22em] text-[#F28B6E]">Image MVP</p>
            <h2 className="mt-2 font-serif text-2xl font-black text-[#3A2D52]">Generate one test image</h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-[#6B5B8A]">
              Uses the selected page prompt only. Mock illustrations stay visible until an image is generated.
            </p>
          </div>
          <button
            type="button"
            onClick={handleGenerateTestImage}
            disabled={isGeneratingImage}
            className="rounded-full bg-[#7C5CBF] px-6 py-3 text-sm font-black text-white shadow-lg shadow-[#7C5CBF]/20 transition hover:-translate-y-0.5 hover:bg-[#6B4FA8] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
          >
            {isGeneratingImage ? "Generating..." : "Generate Test Image"}
          </button>
        </div>
        <div className="mt-5 flex flex-wrap gap-2">
          {previewPages.map((page) => (
            <button
              key={page.page}
              type="button"
              onClick={() => {
                setSelectedPage(page.page);
                setImageError("");
              }}
              className={`h-10 rounded-full px-4 text-sm font-black transition ${
                page.page === activeSelectedPage
                  ? "bg-[#F28B6E] text-white shadow-md shadow-[#F28B6E]/20"
                  : "bg-[#F5EEF8] text-[#6B5B8A] hover:bg-[#EDE6FA]"
              }`}
            >
              Page {page.page}
            </button>
          ))}
        </div>
        {selectedGeneratedImage ? (
          <p className="mt-4 text-sm font-bold text-[#4CA87A]">
            Generated image loaded for page {selectedGeneratedImage.pageNumber} using {selectedGeneratedImage.model}.
          </p>
        ) : null}
        {imageError ? (
          <p className="mt-4 rounded-2xl bg-[#FEF0EB] p-4 text-sm font-bold leading-6 text-[#B94E38]">{imageError}</p>
        ) : null}
      </section>

      <div className="space-y-8 lg:space-y-6">
        {previewPages.map((storyPage) => {
          const imageUrl =
            generatedImage?.pageNumber === storyPage.page &&
            generatedImage.prompt === getPageImagePrompt(storyPage)
              ? generatedImage.dataUrl
              : undefined;

          return (
            <StoryPageCard
              key={storyPage.page}
              storyPage={storyPage}
              generatedImageUrl={imageUrl}
              isSelected={storyPage.page === activeSelectedPage}
              onSelect={() => {
                setSelectedPage(storyPage.page);
                setImageError("");
              }}
            />
          );
        })}
      </div>
      <div className="mt-10 flex flex-wrap justify-center gap-3">
        <ButtonLink href="/export/demo">Ekspor Demo</ButtonLink>
        <ButtonLink href="/generate" variant="secondary">Edit Ide</ButtonLink>
      </div>
    </main>
  );
}
