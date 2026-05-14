import { ButtonLink } from "@/components/button-link";
import { ExportPanel } from "@/components/export-panel";
import { PageHeader } from "@/components/page-header";

export default function ExportDemoPage() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-12 pb-24">
      <PageHeader eyebrow="Ekspor demo" title="Siapkan storybook untuk dibagikan" description="Pilih format mock untuk melihat simulasi ekspor. Tidak ada backend, database, autentikasi, API, atau file sungguhan yang dibuat." />
      <ExportPanel />
      <div className="mt-10 flex justify-center">
        <ButtonLink href="/preview/demo" variant="secondary">← Kembali ke Preview</ButtonLink>
      </div>
    </main>
  );
}
