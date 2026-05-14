import type { StoryPage } from "@/lib/mock-data";

export function StoryPageCard({ storyPage }: { storyPage: StoryPage }) {
  return (
    <article className="grid overflow-hidden rounded-[2rem] bg-white shadow-xl shadow-[#7C5CBF]/10 md:grid-cols-[1.05fr_0.95fr]">
      <div className={`relative min-h-80 bg-gradient-to-br ${storyPage.palette} p-8`}>
        <div className="absolute left-8 top-8 rounded-full bg-white/25 px-3 py-1 text-xs font-black text-white backdrop-blur">Halaman {storyPage.page}</div>
        <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-white/20" />
        <div className="absolute -bottom-14 -left-12 h-44 w-44 rounded-full bg-white/20" />
        <div className="grid h-full min-h-72 place-items-center text-8xl drop-shadow-lg">{storyPage.emoji}</div>
      </div>
      <div className="flex flex-col justify-center p-8 sm:p-10">
        <p className="mb-3 text-sm font-black uppercase tracking-[0.24em] text-[#F28B6E]">Demo Storybook</p>
        <h2 className="font-serif text-3xl font-black leading-tight tracking-[-0.03em] text-[#3A2D52]">{storyPage.title}</h2>
        <p className="mt-5 text-lg leading-9 text-[#6B5B8A]">{storyPage.text}</p>
        <div className="mt-8 flex gap-2">
          {Array.from({ length: 5 }, (_, index) => (
            <span key={index} className={`h-2.5 rounded-full ${index + 1 === storyPage.page ? "w-8 bg-[#7C5CBF]" : "w-2.5 bg-[#EDE6FA]"}`} />
          ))}
        </div>
      </div>
    </article>
  );
}
