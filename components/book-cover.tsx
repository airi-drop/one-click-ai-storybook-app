import type { ShowcaseBook } from "@/lib/mock-data";

type BookCoverProps = {
  book: ShowcaseBook;
};

export function BookCover({ book }: BookCoverProps) {
  return (
    <article className="group rounded-[2rem] bg-white p-4 shadow-xl shadow-[#7C5CBF]/10 transition hover:-translate-y-2 hover:shadow-2xl hover:shadow-[#7C5CBF]/15">
      <div className={`relative min-h-72 overflow-hidden rounded-[1.5rem] bg-gradient-to-br ${book.gradient} p-6 text-white`}>
        <div className="absolute -left-12 -top-12 h-36 w-36 rounded-full bg-white/20 blur-sm" />
        <div className="absolute -bottom-10 -right-10 h-32 w-32 rounded-full bg-white/20 blur-sm" />
        <div className="relative flex h-full min-h-60 flex-col justify-between">
          <span className="w-fit rounded-full bg-white/25 px-3 py-1 text-xs font-black backdrop-blur">{book.age}</span>
          <div className="text-center text-7xl drop-shadow-lg transition group-hover:scale-110">{book.emoji}</div>
          <h3 className="font-serif text-2xl font-black leading-tight drop-shadow-sm">{book.title}</h3>
        </div>
      </div>
      <p className="px-2 pt-4 text-sm leading-7 text-[#6B5B8A]">{book.description}</p>
    </article>
  );
}
