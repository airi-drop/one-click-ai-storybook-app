import { BookCover } from "@/components/book-cover";
import { ButtonLink } from "@/components/button-link";
import { creationSteps, features, showcaseBooks } from "@/lib/mock-data";

export default function Home() {
  return (
    <main>
      <section className="relative overflow-hidden px-6 py-20 text-center sm:py-28 lg:px-8 lg:py-24">
        <div className="absolute left-[-5rem] top-[-5rem] h-80 w-80 rounded-full bg-[#A07FD6]/20 blur-2xl" />
        <div className="absolute right-[-4rem] top-10 h-56 w-56 rounded-full bg-[#F28B6E]/20 blur-2xl" />
        <div className="relative mx-auto max-w-4xl lg:max-w-[820px]">
          <p className="mb-5 text-sm font-black uppercase tracking-[0.3em] text-[#F28B6E]">Mock storybook generator</p>
          <h1 className="font-serif text-5xl font-black leading-[1.04] tracking-[-0.055em] text-[#3A2D52] sm:text-7xl">
            Buat storybook ajaib dalam satu klik.
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-9 text-[#6B5B8A]">
            StoryMagic mengubah ide sederhana menjadi pengalaman buku anak yang hangat, penuh warna, dan siap dipreview—semua dengan data mock di frontend.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <ButtonLink href="/generate">🪄 Buat Storybook Sekarang</ButtonLink>
            <ButtonLink href="/preview/demo" variant="secondary">Lihat Demo</ButtonLink>
          </div>
          <p className="mt-4 text-sm font-bold text-[#A096B5]">Gratis · Tanpa daftar · Simulasi frontend</p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-14 lg:max-w-5xl lg:px-8 lg:py-12 xl:max-w-[1080px]">
        <h2 className="mb-10 text-center font-serif text-4xl font-black tracking-[-0.04em] text-[#3A2D52]">Contoh dunia cerita</h2>
        <div className="grid gap-6 md:grid-cols-3 lg:gap-5">
          {showcaseBooks.map((book) => (
            <BookCover key={book.title} book={book} />
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-14 lg:max-w-5xl lg:px-8 lg:py-12 xl:max-w-[1080px]">
        <div className="rounded-[2.5rem] bg-white/70 p-6 shadow-xl shadow-[#7C5CBF]/10 backdrop-blur sm:p-10 lg:p-8">
          <div className="grid gap-5 md:grid-cols-3 lg:gap-4">
            {creationSteps.map((step) => (
              <article key={step.number} className="rounded-[2rem] bg-[#FDF8F0] p-6 lg:p-5">
                <div className="mb-5 flex items-center justify-between">
                  <span className="text-4xl">{step.icon}</span>
                  <span className="font-serif text-3xl font-black text-[#EDE6FA]">{step.number}</span>
                </div>
                <h3 className="text-xl font-black text-[#3A2D52]">{step.title}</h3>
                <p className="mt-3 leading-7 text-[#6B5B8A]">{step.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-14 pb-24 lg:max-w-5xl lg:px-8 lg:py-12 lg:pb-24 xl:max-w-[1080px]">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5">
          {features.map((feature) => (
            <article key={feature.title} className="rounded-[1.5rem] bg-white p-5 shadow-lg shadow-[#7C5CBF]/10">
              <div className="mb-3 text-3xl">{feature.icon}</div>
              <h3 className="font-black text-[#3A2D52]">{feature.title}</h3>
              <p className="mt-2 text-sm leading-6 text-[#6B5B8A]">{feature.description}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
