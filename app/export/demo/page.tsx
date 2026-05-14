import { ButtonLink } from "@/components/button-link";
import { ExportPanel } from "@/components/export-panel";
import { PageHeader } from "@/components/page-header";

export default function ExportDemoPage() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-12 pb-24 lg:max-w-5xl lg:px-8 xl:max-w-[1080px]">
      <PageHeader eyebrow="Ekspor demo" title="Siapkan storybook untuk dibagikan" description="Unduh storybook digital format persegi untuk mobile, social sharing, dan preview modern. Ilustrasi masih memakai placeholder mock untuk MVP." />
      <ExportPanel />
      <div className="mt-10 flex justify-center">
        <ButtonLink href="/preview/demo" variant="secondary">← Kembali ke Preview</ButtonLink>
      </div>
    </main>
  );
}
