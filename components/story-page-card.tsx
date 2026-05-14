import Image from "next/image";
import type { ReactNode } from "react";

type DisplayStoryPage = {
  page: number;
  title: string;
  text: string;
  palette: string;
  emoji: string;
  sceneDescription?: string;
  totalPages?: number;
};

type StoryPageCardProps = {
  storyPage: DisplayStoryPage;
  generatedImageUrl?: string;
  isSelected?: boolean;
  onSelect?: () => void;
  children?: ReactNode;
};

export function StoryPageCard({ storyPage, generatedImageUrl, isSelected = false, onSelect, children }: StoryPageCardProps) {
  const totalPages = storyPage.totalPages ?? 5;

  return (
    <article
      className={`grid overflow-hidden rounded-[2rem] bg-white shadow-xl shadow-[#7C5CBF]/10 transition md:grid-cols-[1.05fr_0.95fr] lg:grid-cols-[0.95fr_1.05fr] ${
        isSelected ? "ring-4 ring-[#F28B6E]/45" : "ring-1 ring-transparent"
      } ${onSelect ? "cursor-pointer" : ""}`}
      onClick={onSelect}
      onKeyDown={(event) => {
        if (!onSelect) return;
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onSelect();
        }
      }}
      role={onSelect ? "button" : undefined}
      tabIndex={onSelect ? 0 : undefined}
    >
      <div className={`relative min-h-80 bg-gradient-to-br ${storyPage.palette} p-8 lg:min-h-[21rem]`}>
        {generatedImageUrl ? (
          <Image
            src={generatedImageUrl}
            alt={`Generated illustration for page ${storyPage.page}`}
            fill
            unoptimized
            className="absolute inset-0 h-full w-full object-cover"
          />
        ) : (
          <>
            <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-white/20" />
            <div className="absolute -bottom-14 -left-12 h-44 w-44 rounded-full bg-white/20" />
            <div className="grid h-full min-h-72 place-items-center text-8xl drop-shadow-lg">{storyPage.emoji}</div>
          </>
        )}
        <div className="absolute left-8 top-8 rounded-full bg-white/25 px-3 py-1 text-xs font-black text-white backdrop-blur">Halaman {storyPage.page}</div>
        {isSelected ? (
          <div className="absolute right-8 top-8 rounded-full bg-white/85 px-3 py-1 text-xs font-black uppercase tracking-[0.16em] text-[#F28B6E] shadow-sm">
            Dipilih
          </div>
        ) : null}
      </div>
      <div className="flex flex-col justify-center p-8 sm:p-10 lg:p-9">
        <p className="mb-3 text-sm font-black uppercase tracking-[0.24em] text-[#F28B6E]">Demo Storybook</p>
        <h2 className="font-serif text-3xl font-black leading-tight tracking-[-0.03em] text-[#3A2D52]">{storyPage.title}</h2>
        <p className="mt-5 text-lg leading-9 text-[#6B5B8A]">{storyPage.text}</p>
        {storyPage.sceneDescription ? (
          <div className="mt-6 rounded-2xl bg-[#FDF8F0] p-4">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-[#F28B6E]">Scene description</p>
            <p className="mt-2 text-sm leading-6 text-[#6B5B8A]">{storyPage.sceneDescription}</p>
          </div>
        ) : null}
        <div className="mt-8 flex gap-2">
          {Array.from({ length: totalPages }, (_, index) => (
            <span key={index} className={`h-2.5 rounded-full ${index + 1 === storyPage.page ? "w-8 bg-[#7C5CBF]" : "w-2.5 bg-[#EDE6FA]"}`} />
          ))}
        </div>
        {children}
      </div>
    </article>
  );
}
