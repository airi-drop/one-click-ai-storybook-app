import { GenerateForm } from "@/components/generate-form";
import { PageHeader } from "@/components/page-header";

export default function GeneratePage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-12 pb-24">
      <PageHeader eyebrow="Buat cerita" title="Rancang Storybook-mu ✨" description="Isi dengan hati: tema, karakter, gaya visual, dan pesan moral. Tombol akhir akan membawa kamu ke layar loading mock." />
      <GenerateForm />
    </main>
  );
}
