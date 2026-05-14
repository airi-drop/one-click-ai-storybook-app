"use client";

import { type ChangeEvent, useEffect, useMemo, useRef, useState } from "react";
import { ButtonLink } from "@/components/button-link";
import { PageHeader } from "@/components/page-header";
import { StoryPageCard } from "@/components/story-page-card";
import { storyPages } from "@/lib/mock-data";
import {
  generatedStoryStorageKey,
  isGeneratedStorybook,
  isUploadedPageImages,
  type GeneratedStorybook,
  type UploadedPageImage,
  uploadedPageImagesStorageKey,
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

const googleFlowUrl = "https://labs.google/flow";

function getPageImagePrompt(storyPage: PreviewStoryPage) {
  return (
    storyPage.sceneDescription ??
    `Character consistency: orange kitten named Kiko with bright curious eyes. Scene: ${storyPage.title}. ${storyPage.text} Soft watercolor children's book illustration, cozy bedtime palette, rounded shapes, gentle texture. Negative prompt: scary, dark horror, violence, sharp teeth, angry expression, realistic photo, text, watermark, cluttered background.`
  );
}

function replacePageImage(images: UploadedPageImage[], nextImage: UploadedPageImage) {
  return [...images.filter((image) => image.pageNumber !== nextImage.pageNumber), nextImage].sort((left, right) => left.pageNumber - right.pageNumber);
}

function saveUploadedPageImages(images: UploadedPageImage[]) {
  localStorage.setItem(uploadedPageImagesStorageKey, JSON.stringify(images));
}

export function StoryPreview() {
  const [generatedStory, setGeneratedStory] = useState<GeneratedStorybook | null>(null);
  const [selectedPage, setSelectedPage] = useState(1);
  const [uploadedImages, setUploadedImages] = useState<UploadedPageImage[]>([]);
  const [imageError, setImageError] = useState("");
  const [imageMessage, setImageMessage] = useState("");
  const uploadInputs = useRef<Record<number, HTMLInputElement | null>>({});

  useEffect(() => {
    const storageTimer = window.setTimeout(() => {
      const savedStory = localStorage.getItem(generatedStoryStorageKey);
      const savedImages = localStorage.getItem(uploadedPageImagesStorageKey);

      if (savedImages) {
        try {
          const parsedImages = JSON.parse(savedImages);
          if (isUploadedPageImages(parsedImages)) setUploadedImages(parsedImages);
        } catch {
          setUploadedImages([]);
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
  const selectedUploadedImage = uploadedImages.find((image) => image.pageNumber === selectedStoryPage?.page && image.prompt === selectedImagePrompt);

  async function copyPromptToClipboard(prompt: string) {
    try {
      await navigator.clipboard.writeText(prompt);
      return true;
    } catch {
      const textArea = document.createElement("textarea");
      textArea.value = prompt;
      textArea.setAttribute("readonly", "");
      textArea.style.position = "fixed";
      textArea.style.left = "-9999px";
      document.body.appendChild(textArea);
      textArea.select();
      const copied = document.execCommand("copy");
      textArea.remove();
      return copied;
    }
  }

  async function handleCopyPrompt(storyPage: PreviewStoryPage) {
    setImageError("");
    const copied = await copyPromptToClipboard(getPageImagePrompt(storyPage));
    setImageMessage(copied ? `Prompt copied for page ${storyPage.page}.` : "Prompt could not be copied automatically. Select the prompt text and copy it manually.");
  }

  function handleOpenGoogleFlow(storyPage: PreviewStoryPage) {
    setImageError("");
    void copyPromptToClipboard(getPageImagePrompt(storyPage)).then((copied) => {
      setImageMessage(copied ? `Prompt copied for page ${storyPage.page}. Google Flow opened in a new tab.` : "Google Flow opened. Copy the prompt manually if the browser blocked clipboard access.");
    });
    window.open(googleFlowUrl, "_blank", "noopener,noreferrer");
  }

  function handleUploadClick(pageNumber: number) {
    uploadInputs.current[pageNumber]?.click();
  }

  function handleUploadImage(storyPage: PreviewStoryPage, event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setImageError("Upload an image file for the selected page.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result !== "string" || !reader.result.startsWith("data:image/")) {
        setImageError("The uploaded image could not be read.");
        return;
      }

      const nextImage: UploadedPageImage = {
        pageNumber: storyPage.page,
        prompt: getPageImagePrompt(storyPage),
        dataUrl: reader.result,
        fileName: file.name,
        mimeType: file.type,
        status: "pending",
        createdAt: new Date().toISOString(),
      };
      const nextImages = replacePageImage(uploadedImages, nextImage);

      try {
        saveUploadedPageImages(nextImages);
        setUploadedImages(nextImages);
        setImageError("");
        setImageMessage(`Uploaded ${file.name} for page ${storyPage.page}. Approve it when it is ready for export.`);
      } catch {
        setImageError("The image was uploaded, but it is too large to store in localStorage. Try a smaller PNG or JPG.");
      }
    };
    reader.onerror = () => setImageError("The uploaded image could not be read.");
    reader.readAsDataURL(file);
  }

  function handleApproveImage(storyPage: PreviewStoryPage) {
    const currentImage = uploadedImages.find((image) => image.pageNumber === storyPage.page && image.prompt === getPageImagePrompt(storyPage));

    if (!currentImage) {
      setImageError(`Upload an image for page ${storyPage.page} before approving it.`);
      return;
    }

    const nextImage: UploadedPageImage = {
      ...currentImage,
      status: "approved",
      approvedAt: new Date().toISOString(),
    };
    const nextImages = replacePageImage(uploadedImages, nextImage);

    try {
      saveUploadedPageImages(nextImages);
      setUploadedImages(nextImages);
      setImageError("");
      setImageMessage(`Page ${storyPage.page} image approved for preview and export.`);
    } catch {
      setImageError("The approved image could not be saved locally.");
    }
  }

  return (
    <main className="mx-auto max-w-6xl px-6 py-12 pb-24 lg:max-w-5xl lg:px-8 xl:max-w-[1080px]">
      <PageHeader
        eyebrow={generatedStory ? "Generated storybook" : "Preview demo"}
        title={generatedStory?.title ?? "Kiko dan Bintang Ajaib"}
        description={
          generatedStory
            ? `Karakter utama: ${generatedStory.characterBible.name}. Cerita ini dibuat dengan Gemini; ilustrasi memakai mock visual sampai gambar eksternal diunggah dan disetujui.`
            : "Empat halaman contoh dari storybook mock. Ilustrasi mock tetap tersedia, dan gambar eksternal bisa diunggah per halaman."
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
            <p className="text-xs font-black uppercase tracking-[0.22em] text-[#F28B6E]">External Image Tool</p>
            <h2 className="mt-2 font-serif text-2xl font-black text-[#3A2D52]">Image Studio per page</h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-[#6B5B8A]">
              Copy a page prompt, create the image in Google Flow, upload the finished image here, then approve it for preview and export. The app does not call a backend image API.
            </p>
          </div>
          <span className="rounded-full bg-[#E8F7EF] px-4 py-2 text-sm font-black text-[#4CA87A]">Cost-free image mode</span>
        </div>
        <div className="mt-5 flex flex-wrap gap-2">
          {previewPages.map((page) => (
            <button
              key={page.page}
              type="button"
              onClick={() => {
                setSelectedPage(page.page);
                setImageError("");
                setImageMessage("");
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
        {selectedUploadedImage?.status === "approved" ? (
          <p className="mt-4 text-sm font-bold text-[#4CA87A]">
            Approved uploaded image loaded for page {selectedUploadedImage.pageNumber}: {selectedUploadedImage.fileName}.
          </p>
        ) : null}
        {imageMessage ? <p className="mt-4 text-sm font-bold text-[#4CA87A]">{imageMessage}</p> : null}
        {imageError ? (
          <p className="mt-4 rounded-2xl bg-[#FEF0EB] p-4 text-sm font-bold leading-6 text-[#B94E38]">{imageError}</p>
        ) : null}
      </section>

      <div className="space-y-8 lg:space-y-6">
        {previewPages.map((storyPage) => {
          const imagePrompt = getPageImagePrompt(storyPage);
          const uploadedImage = uploadedImages.find((image) => image.pageNumber === storyPage.page && image.prompt === imagePrompt);
          const imageUrl = uploadedImage?.status === "approved" ? uploadedImage.dataUrl : undefined;

          return (
            <StoryPageCard
              key={storyPage.page}
              storyPage={storyPage}
              generatedImageUrl={imageUrl}
              isSelected={storyPage.page === activeSelectedPage}
              onSelect={() => {
                setSelectedPage(storyPage.page);
                setImageError("");
                setImageMessage("");
              }}
            >
              <div className="mt-7 rounded-2xl bg-[#F8F4FB] p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.2em] text-[#F28B6E]">Image Studio</p>
                    <p className="mt-1 text-sm font-bold text-[#6B5B8A]">
                      {uploadedImage ? `${uploadedImage.fileName} - ${uploadedImage.status === "approved" ? "approved" : "waiting approval"}` : "Mock fallback active"}
                    </p>
                  </div>
                  <span className={`rounded-full px-3 py-1 text-xs font-black ${uploadedImage?.status === "approved" ? "bg-[#E8F7EF] text-[#4CA87A]" : "bg-white text-[#A096B5]"}`}>
                    {uploadedImage?.status === "approved" ? "Approved" : "Needs upload"}
                  </span>
                </div>
                <div className="mt-4 rounded-xl bg-white/85 p-3">
                  <p className="text-xs font-black uppercase tracking-[0.18em] text-[#7C5CBF]">Generated image prompt</p>
                  <p className="mt-2 max-h-32 overflow-auto text-sm leading-6 text-[#6B5B8A]">{imagePrompt}</p>
                </div>
                <div className="mt-4 grid gap-2 sm:grid-cols-2">
                  <button type="button" onClick={() => handleCopyPrompt(storyPage)} className="rounded-full bg-white px-4 py-3 text-sm font-black text-[#7C5CBF] shadow-sm transition hover:-translate-y-0.5">
                    Copy Prompt
                  </button>
                  <button type="button" onClick={() => handleOpenGoogleFlow(storyPage)} className="rounded-full bg-[#7C5CBF] px-4 py-3 text-sm font-black text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-[#6B4FA8]">
                    Open Google Flow
                  </button>
                  <button type="button" onClick={() => handleUploadClick(storyPage.page)} className="rounded-full bg-white px-4 py-3 text-sm font-black text-[#7C5CBF] shadow-sm transition hover:-translate-y-0.5">
                    Upload Image
                  </button>
                  <button
                    type="button"
                    onClick={() => handleApproveImage(storyPage)}
                    disabled={!uploadedImage || uploadedImage.status === "approved"}
                    className="rounded-full bg-[#F28B6E] px-4 py-3 text-sm font-black text-white shadow-sm transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-55 disabled:hover:translate-y-0"
                  >
                    Approve Image
                  </button>
                </div>
                <input
                  ref={(element) => {
                    uploadInputs.current[storyPage.page] = element;
                  }}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(event) => handleUploadImage(storyPage, event)}
                />
              </div>
            </StoryPageCard>
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
