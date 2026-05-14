import { ButtonLink } from "@/components/button-link";
import { PageHeader } from "@/components/page-header";
import { StoryPageCard } from "@/components/story-page-card";
import { storyPages } from "@/lib/mock-data";

export default function PreviewDemoPage() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-12 pb-24">
      <PageHeader eyebrow="Preview demo" title="Kiko dan Bintang Ajaib" description="Empat halaman contoh dari storybook mock. Ilustrasi dibuat dengan gradient dan emoji agar tetap frontend-only tanpa asset eksternal." />
      <div className="space-y-8">
        {storyPages.map((storyPage) => (
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
