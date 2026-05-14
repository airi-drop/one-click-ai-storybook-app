"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ageOptions, characterSuggestions, moodOptions, themeSuggestions, visualStyles } from "@/lib/mock-data";
import { draftStorageKey, generatedStoryStorageKey } from "@/lib/storybook";

type FormState = {
  tema: string;
  karakter: string;
  visual: string;
  mood: string;
  pesan: string;
  usia: string;
};

const initialForm: FormState = {
  tema: "",
  karakter: "",
  visual: "watercolor",
  mood: "Ajaib ✨",
  pesan: "",
  usia: "3–5 tahun",
};

function FieldCard({ label, hint, children }: { label: string; hint: string; children: React.ReactNode }) {
  return (
    <section className="mb-5 rounded-[1.75rem] bg-white p-5 shadow-xl shadow-[#7C5CBF]/10 sm:p-6">
      <div className="mb-4">
        <h2 className="text-lg font-black text-[#3A2D52]">{label}</h2>
        <p className="mt-1 text-sm font-semibold text-[#A096B5]">{hint}</p>
      </div>
      {children}
    </section>
  );
}

function SuggestChips({ items, onSelect }: { items: string[]; onSelect: (value: string) => void }) {
  return (
    <div className="mt-3 flex flex-wrap gap-2">
      {items.map((item) => (
        <button
          key={item}
          type="button"
          onClick={() => onSelect(item)}
          className="rounded-full bg-[#FEF0EB] px-3 py-1.5 text-xs font-extrabold text-[#6B5B8A] transition hover:bg-[#FBD4C8] hover:text-[#3A2D52]"
        >
          {item}
        </button>
      ))}
    </div>
  );
}

const inputClass =
  "w-full rounded-2xl border-2 border-[#F5EDD8] bg-white px-4 py-3 text-[15px] font-semibold text-[#3A2D52] outline-none transition placeholder:text-[#A096B5] focus:border-[#7C5CBF]";

export function GenerateForm() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<FormState>(initialForm);
  const [isGenerating, setIsGenerating] = useState(false);
  const totalSteps = 3;

  const update = (key: keyof FormState, value: string) => setForm((current) => ({ ...current, [key]: value }));

  function handleGenerate() {
    setIsGenerating(true);
    localStorage.removeItem(generatedStoryStorageKey);
    localStorage.setItem(
      draftStorageKey,
      JSON.stringify({
        ...form,
        createdAt: new Date().toISOString(),
      }),
    );
    router.push("/loading");
  }

  return (
    <div>
      <div className="mb-10">
        <div className="mb-3 grid grid-cols-3 gap-2">
          {["Cerita & Karakter", "Gaya Visual", "Detail Akhir"].map((label, index) => {
            const number = index + 1;
            const complete = step > number;
            const active = step === number;
            return (
              <button key={label} type="button" onClick={() => setStep(number)} className="flex flex-col items-center gap-2 text-center">
                <span
                  className={`grid h-9 w-9 place-items-center rounded-full text-sm font-black transition ${
                    complete
                      ? "bg-[#7EC8A0] text-white shadow-lg shadow-[#7EC8A0]/30"
                      : active
                        ? "bg-[#7C5CBF] text-white shadow-lg shadow-[#7C5CBF]/30"
                        : "bg-[#F5EDD8] text-[#A096B5]"
                  }`}
                >
                  {complete ? "✓" : number}
                </span>
                <span className={`text-xs font-black ${active ? "text-[#7C5CBF]" : "text-[#A096B5]"}`}>{label}</span>
              </button>
            );
          })}
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-[#F5EDD8]">
          <div className="h-full rounded-full bg-gradient-to-r from-[#7C5CBF] to-[#A07FD6] transition-all" style={{ width: `${(step / totalSteps) * 100}%` }} />
        </div>
      </div>

      {step === 1 ? (
        <div className="animate-[fadeIn_0.3s_ease]">
          <FieldCard label="Tema Cerita 🌟" hint="Apa inti dari kisah ini?">
            <textarea
              value={form.tema}
              rows={4}
              onChange={(event) => update("tema", event.target.value)}
              placeholder="Cerita tentang persahabatan seekor kucing dan rusa..."
              className={`${inputClass} resize-none`}
            />
            <SuggestChips items={themeSuggestions} onSelect={(value) => update("tema", value)} />
          </FieldCard>
          <FieldCard label="Karakter Utama 🦊" hint="Siapa bintang cerita ini?">
            <input
              value={form.karakter}
              onChange={(event) => update("karakter", event.target.value)}
              placeholder="Contoh: Kelinci kecil bernama Bintang..."
              className={inputClass}
            />
            <SuggestChips items={characterSuggestions} onSelect={(value) => update("karakter", value)} />
          </FieldCard>
        </div>
      ) : null}

      {step === 2 ? (
        <div className="animate-[fadeIn_0.3s_ease]">
          <FieldCard label="Gaya Visual 🎨" hint="Pilih satu gaya ilustrasi">
            <div className="grid gap-3 sm:grid-cols-3">
              {visualStyles.map((style) => (
                <button
                  key={style.id}
                  type="button"
                  onClick={() => update("visual", style.id)}
                  className={`rounded-[1.35rem] border-2 p-4 text-center transition ${
                    form.visual === style.id ? `border-[#7C5CBF] bg-gradient-to-br ${style.gradient} shadow-lg shadow-[#7C5CBF]/15` : "border-[#F5EDD8] bg-white hover:border-[#FBD4C8]"
                  }`}
                >
                  <span className="text-4xl">{style.emoji}</span>
                  <strong className="mt-3 block text-sm text-[#3A2D52]">{style.label}</strong>
                  <span className="mt-1 block text-xs font-semibold text-[#6B5B8A]">{style.description}</span>
                </button>
              ))}
            </div>
          </FieldCard>
          <FieldCard label="Suasana Cerita 🌙" hint="Pilih rasa dominan untuk pembaca kecil">
            <div className="flex flex-wrap gap-2">
              {moodOptions.map((mood) => (
                <button
                  key={mood}
                  type="button"
                  onClick={() => update("mood", mood)}
                  className={`rounded-full px-4 py-2 text-sm font-black transition ${form.mood === mood ? "bg-[#7C5CBF] text-white" : "bg-[#EDE6FA] text-[#6B5B8A] hover:bg-[#d9c9f4]"}`}
                >
                  {mood}
                </button>
              ))}
            </div>
          </FieldCard>
        </div>
      ) : null}

      {step === 3 ? (
        <div className="animate-[fadeIn_0.3s_ease]">
          <FieldCard label="Usia Pembaca 👧" hint="Agar bahasa dan konflik sesuai tahap anak">
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {ageOptions.map((age) => (
                <button
                  key={age}
                  type="button"
                  onClick={() => update("usia", age)}
                  className={`rounded-2xl px-3 py-3 text-sm font-black transition ${form.usia === age ? "bg-[#F28B6E] text-white shadow-lg shadow-[#F28B6E]/25" : "bg-white text-[#6B5B8A] ring-2 ring-[#F5EDD8] hover:ring-[#FBD4C8]"}`}
                >
                  {age}
                </button>
              ))}
            </div>
          </FieldCard>
          <FieldCard label="Pesan Moral 💛" hint="Nilai apa yang ingin tinggal di hati anak?">
            <textarea
              value={form.pesan}
              rows={4}
              onChange={(event) => update("pesan", event.target.value)}
              placeholder="Contoh: Sahabat saling menguatkan saat takut mencoba hal baru."
              className={`${inputClass} resize-none`}
            />
          </FieldCard>
        </div>
      ) : null}

      <div className="mt-8 flex justify-between gap-3">
        <button
          type="button"
          disabled={step === 1}
          onClick={() => setStep((value) => Math.max(1, value - 1))}
          className="rounded-full border-2 border-[#F5EDD8] bg-white px-6 py-3 text-sm font-black text-[#6B5B8A] transition disabled:cursor-not-allowed disabled:opacity-40"
        >
          ← Kembali
        </button>
        {step < totalSteps ? (
          <button type="button" onClick={() => setStep((value) => Math.min(totalSteps, value + 1))} className="rounded-full bg-[#7C5CBF] px-7 py-3 text-sm font-black text-white shadow-lg shadow-[#7C5CBF]/25 transition hover:-translate-y-0.5">
            Lanjut →
          </button>
        ) : (
          <button
            type="button"
            disabled={isGenerating}
            onClick={handleGenerate}
            className="rounded-full bg-gradient-to-r from-[#7C5CBF] to-[#A07FD6] px-7 py-3 text-sm font-black text-white shadow-lg shadow-[#7C5CBF]/25 transition hover:-translate-y-0.5 disabled:cursor-wait disabled:opacity-70"
          >
            {isGenerating ? "Menyiapkan..." : "🪄 Buat Storybook"}
          </button>
        )}
      </div>
    </div>
  );
}
