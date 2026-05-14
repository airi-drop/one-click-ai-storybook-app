import { useState, useEffect, useRef } from "react";

// ─── DESIGN TOKENS ────────────────────────────────────────────────────────────
const C = {
  cream: "#FDF8F0",
  creamDark: "#F5EDD8",
  purple: "#7C5CBF",
  purpleLight: "#A07FD6",
  purplePale: "#EDE6FA",
  purpleDark: "#5A3F9A",
  peach: "#F28B6E",
  peachLight: "#FBD4C8",
  peachPale: "#FEF0EB",
  mint: "#7EC8A0",
  mintPale: "#E8F7EF",
  gold: "#E8B84B",
  goldPale: "#FDF3D9",
  text: "#3A2D52",
  textMid: "#6B5B8A",
  textLight: "#A096B5",
  white: "#FFFFFF",
  shadow: "rgba(124,92,191,0.12)",
  shadowMd: "rgba(124,92,191,0.18)",
};

const style = {
  app: {
    fontFamily: "'Nunito', 'Quicksand', system-ui, sans-serif",
    background: C.cream,
    minHeight: "100vh",
    color: C.text,
  },
};

// ─── GOOGLE FONTS LOADER ──────────────────────────────────────────────────────
function FontLoader() {
  useEffect(() => {
    const link = document.createElement("link");
    link.href = "https://fonts.googleapis.com/css2?family=Nunito:wght@400;500;600;700;800;900&family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,600;0,9..144,700;1,9..144,400&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);
  }, []);
  return null;
}

// ─── NAV ──────────────────────────────────────────────────────────────────────
function Nav({ page, setPage }) {
  return (
    <nav
      style={{
        position: "sticky",
        top: 0,
        zIndex: 100,
        background: "rgba(253,248,240,0.85)",
        backdropFilter: "blur(12px)",
        borderBottom: `1px solid ${C.peachLight}`,
        padding: "0 2rem",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        height: 64,
      }}
    >
      <button
        onClick={() => setPage("landing")}
        style={{
          fontFamily: "'Fraunces', serif",
          fontSize: 22,
          fontWeight: 700,
          color: C.purple,
          background: "none",
          border: "none",
          cursor: "pointer",
          letterSpacing: "-0.3px",
        }}
      >
        ✦ StoryMagic
      </button>
      <div style={{ display: "flex", gap: 8 }}>
        {[
          ["landing", "Beranda"],
          ["generate", "Buat"],
          ["preview", "Preview"],
          ["export", "Ekspor"],
        ].map(([p, label]) => (
          <button
            key={p}
            onClick={() => setPage(p)}
            style={{
              padding: "6px 16px",
              borderRadius: 20,
              background: page === p ? C.purple : "transparent",
              color: page === p ? C.white : C.textMid,
              border: page === p ? "none" : `1.5px solid transparent`,
              fontFamily: "inherit",
              fontSize: 14,
              fontWeight: 600,
              cursor: "pointer",
              transition: "all 0.2s",
            }}
          >
            {label}
          </button>
        ))}
      </div>
    </nav>
  );
}

// ─── LANDING PAGE ─────────────────────────────────────────────────────────────
function LandingPage({ setPage }) {
  const books = [
    { title: "Kiko dan Bintang Ajaib", age: "3–5 th", color: "#C5A4E8", cover: ["#E8D5F5", "#C5A4E8", "#A07FD6"], emoji: "⭐", desc: "Petualangan kucing kecil mencari bintang jatuh di langit malam." },
    { title: "Dino Sahabat Hutan", age: "4–6 th", color: "#7EC8A0", cover: ["#B8EBD0", "#7EC8A0", "#4CA87A"], emoji: "🦕", desc: "Dino belajar berbagi dengan teman-teman di hutan hijau." },
    { title: "Nana Penjelajah Laut", age: "5–7 th", color: "#F28B6E", cover: ["#FBD4C8", "#F28B6E", "#D4614A"], emoji: "🐠", desc: "Nana menyelami samudra dan menemukan keajaiban bawah laut." },
  ];

  const steps = [
    { n: "01", icon: "✏️", title: "Ceritakan Idemu", desc: "Masukkan tema, karakter, dan pesan yang ingin kamu sampaikan dalam beberapa klik." },
    { n: "02", icon: "✨", title: "AI Bekerja", desc: "AI kami menciptakan cerita indah dan ilustrasi memukau khusus untukmu." },
    { n: "03", icon: "📚", title: "Buku Siap!", desc: "Preview, edit, dan unduh storybook dalam format PDF siap cetak atau digital." },
  ];

  const features = [
    { icon: "🎨", title: "Ilustrasi Cantik", desc: "Dipilihkan gaya visual terbaik sesuai usia anak" },
    { icon: "🌈", title: "12 Halaman Penuh", desc: "Cerita lengkap dengan alur awal, tengah, dan akhir" },
    { icon: "💬", title: "Bahasa Indonesia", desc: "Ditulis indah dalam Bahasa Indonesia yang kaya" },
    { icon: "📥", title: "Export PDF", desc: "Unduh resolusi tinggi siap cetak di rumah" },
    { icon: "✏️", title: "Edit Bebas", desc: "Ubah teks dan minta regenerasi ilustrasi" },
    { icon: "💛", title: "Pesan Moral", desc: "Setiap cerita membawa nilai kehidupan bermakna" },
  ];

  return (
    <div>
      {/* HERO */}
      <section
        style={{
          padding: "80px 2rem 100px",
          textAlign: "center",
          background: `radial-gradient(ellipse 80% 60% at 50% 0%, ${C.purplePale} 0%, transparent 70%)`,
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Floating orbs */}
        {[
          { w: 300, h: 300, top: -80, left: -60, bg: `radial-gradient(circle, ${C.purpleLight}30, transparent 70%)` },
          { w: 200, h: 200, top: 20, right: -40, bg: `radial-gradient(circle, ${C.peach}25, transparent 70%)` },
          { w: 150, h: 150, bottom: 0, left: "30%", bg: `radial-gradient(circle, ${C.gold}20, transparent 70%)` },
        ].map((orb, i) => (
          <div key={i} style={{ position: "absolute", borderRadius: "50%", pointerEvents: "none", ...orb }} />
        ))}

        <div style={{ position: "relative", maxWidth: 700, margin: "0 auto" }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              background: C.goldPale,
              border: `1.5px solid ${C.gold}60`,
              borderRadius: 20,
              padding: "6px 16px",
              marginBottom: 28,
              fontSize: 13,
              fontWeight: 700,
              color: "#9A6B10",
            }}
          >
            ✦ Powered by AI · Buat dalam 30 detik
          </div>

          <h1
            style={{
              fontFamily: "'Fraunces', serif",
              fontSize: "clamp(2.4rem, 6vw, 4rem)",
              fontWeight: 700,
              lineHeight: 1.15,
              color: C.text,
              marginBottom: 20,
              letterSpacing: "-0.5px",
            }}
          >
            Buat Storybook Anak
            <br />
            <span style={{ color: C.purple }}>dalam Satu Klik</span> ✨
          </h1>

          <p
            style={{
              fontSize: "clamp(1rem, 2.5vw, 1.2rem)",
              color: C.textMid,
              maxWidth: 520,
              margin: "0 auto 40px",
              lineHeight: 1.7,
            }}
          >
            Dari satu ide sederhana, AI kami merangkai cerita penuh makna dengan ilustrasi cantik — siap dibaca, disimpan, dan dicetak bersama buah hati.
          </p>

          <button
            onClick={() => setPage("generate")}
            style={{
              background: `linear-gradient(135deg, ${C.purple}, ${C.purpleLight})`,
              color: C.white,
              border: "none",
              borderRadius: 28,
              padding: "18px 48px",
              fontSize: 18,
              fontWeight: 800,
              cursor: "pointer",
              boxShadow: `0 8px 32px ${C.purple}50`,
              letterSpacing: "-0.2px",
              transition: "transform 0.15s, box-shadow 0.15s",
              fontFamily: "inherit",
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = "translateY(-2px)";
              e.target.style.boxShadow = `0 12px 40px ${C.purple}60`;
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = "";
              e.target.style.boxShadow = `0 8px 32px ${C.purple}50`;
            }}
          >
            🪄 Buat Storybook Sekarang
          </button>

          <p style={{ marginTop: 16, fontSize: 13, color: C.textLight }}>Gratis · Tanpa daftar · Siap dalam hitungan detik</p>
        </div>
      </section>

      {/* SHOWCASE CARDS */}
      <section style={{ padding: "60px 2rem", maxWidth: 1100, margin: "0 auto" }}>
        <h2
          style={{
            fontFamily: "'Fraunces', serif",
            fontSize: "clamp(1.6rem, 4vw, 2.4rem)",
            textAlign: "center",
            marginBottom: 48,
            color: C.text,
          }}
        >
          Karya dari Pengguna Kami 💫
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 24 }}>
          {books.map((book, i) => (
            <div
              key={i}
              style={{
                background: C.white,
                borderRadius: 24,
                boxShadow: `0 4px 24px ${C.shadow}`,
                overflow: "hidden",
                cursor: "pointer",
                transition: "transform 0.2s, box-shadow 0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-6px)";
                e.currentTarget.style.boxShadow = `0 16px 40px ${C.shadowMd}`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "";
                e.currentTarget.style.boxShadow = `0 4px 24px ${C.shadow}`;
              }}
            >
              {/* Cover */}
              <div
                style={{
                  height: 220,
                  position: "relative",
                  background: `linear-gradient(160deg, ${book.cover[0]}, ${book.cover[1]}, ${book.cover[2]})`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexDirection: "column",
                }}
              >
                <div style={{ fontSize: 64, marginBottom: 12, filter: "drop-shadow(0 4px 12px rgba(0,0,0,0.15))" }}>{book.emoji}</div>
                <div style={{ fontFamily: "'Fraunces', serif", fontSize: 18, fontWeight: 600, color: C.white, textAlign: "center", padding: "0 20px", textShadow: "0 2px 8px rgba(0,0,0,0.2)" }}>{book.title}</div>
                <div style={{ marginTop: 8, background: "rgba(255,255,255,0.3)", borderRadius: 12, padding: "3px 12px", fontSize: 12, color: C.white, fontWeight: 700 }}>Usia {book.age}</div>
              </div>
              <div style={{ padding: "20px 24px 24px" }}>
                <p style={{ fontSize: 14, color: C.textMid, lineHeight: 1.6, margin: 0 }}>{book.desc}</p>
                <div style={{ marginTop: 16, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <span style={{ fontSize: 13, color: C.textLight }}>12 halaman · PDF</span>
                  <span style={{ fontSize: 13, fontWeight: 700, color: C.purple }}>Lihat Preview →</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section style={{ padding: "60px 2rem 80px", background: `linear-gradient(180deg, ${C.purplePale}40, ${C.peachPale}40)` }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: "clamp(1.6rem, 4vw, 2.4rem)", textAlign: "center", marginBottom: 56, color: C.text }}>Semudah 3 Langkah 🪄</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 32, position: "relative" }}>
            {steps.map((step, i) => (
              <div
                key={i}
                style={{
                  background: C.white,
                  borderRadius: 24,
                  padding: "36px 28px",
                  boxShadow: `0 4px 20px ${C.shadow}`,
                  textAlign: "center",
                  position: "relative",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    top: -18,
                    left: "50%",
                    transform: "translateX(-50%)",
                    background: `linear-gradient(135deg, ${C.purple}, ${C.purpleLight})`,
                    color: C.white,
                    borderRadius: 12,
                    padding: "4px 14px",
                    fontSize: 12,
                    fontWeight: 800,
                    letterSpacing: 1,
                  }}
                >
                  {step.n}
                </div>
                <div style={{ fontSize: 44, marginBottom: 16 }}>{step.icon}</div>
                <h3 style={{ fontFamily: "'Fraunces', serif", fontSize: 20, fontWeight: 600, marginBottom: 10, color: C.text }}>{step.title}</h3>
                <p style={{ fontSize: 14, color: C.textMid, lineHeight: 1.7, margin: 0 }}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section style={{ padding: "60px 2rem 80px", maxWidth: 1000, margin: "0 auto" }}>
        <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: "clamp(1.6rem, 4vw, 2.4rem)", textAlign: "center", marginBottom: 48, color: C.text }}>Semua yang Kamu Butuhkan ✦</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 20 }}>
          {features.map((f, i) => (
            <div
              key={i}
              style={{
                background: C.white,
                borderRadius: 20,
                padding: "24px 22px",
                border: `1.5px solid ${C.peachLight}`,
                boxShadow: `0 2px 12px ${C.shadow}`,
              }}
            >
              <div style={{ fontSize: 32, marginBottom: 12 }}>{f.icon}</div>
              <h4 style={{ fontWeight: 700, marginBottom: 6, color: C.text, fontSize: 15 }}>{f.title}</h4>
              <p style={{ fontSize: 13, color: C.textMid, lineHeight: 1.6, margin: 0 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA BANNER */}
      <section
        style={{
          margin: "0 2rem 80px",
          background: `linear-gradient(135deg, ${C.purple}, ${C.purpleLight})`,
          borderRadius: 32,
          padding: "60px 40px",
          textAlign: "center",
          boxShadow: `0 16px 48px ${C.purple}40`,
          maxWidth: 900,
          marginLeft: "auto",
          marginRight: "auto",
        }}
      >
        <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: "clamp(1.8rem, 4vw, 2.6rem)", color: C.white, marginBottom: 16 }}>Mulai Cerita Pertamamu 📖</h2>
        <p style={{ color: "rgba(255,255,255,0.85)", fontSize: 16, marginBottom: 36, maxWidth: 460, margin: "0 auto 36px" }}>Ribuan orang tua dan guru sudah menciptakan storybook ajaib bersama anak mereka.</p>
        <button
          onClick={() => setPage("generate")}
          style={{
            background: C.white,
            color: C.purple,
            border: "none",
            borderRadius: 28,
            padding: "16px 44px",
            fontSize: 17,
            fontWeight: 800,
            cursor: "pointer",
            boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
            fontFamily: "inherit",
            transition: "transform 0.15s",
          }}
          onMouseEnter={(e) => (e.target.style.transform = "translateY(-2px)")}
          onMouseLeave={(e) => (e.target.style.transform = "")}
        >
          🌟 Coba Gratis Sekarang
        </button>
      </section>

      {/* FOOTER */}
      <footer style={{ borderTop: `1px solid ${C.creamDark}`, padding: "32px 2rem", textAlign: "center" }}>
        <p style={{ fontFamily: "'Fraunces', serif", fontSize: 20, color: C.purple, fontWeight: 600, marginBottom: 8 }}>✦ StoryMagic</p>
        <p style={{ fontSize: 13, color: C.textLight }}>Dibuat dengan ❤️ untuk anak-anak Indonesia · 2026</p>
      </footer>
    </div>
  );
}

// ─── GENERATE PAGE ────────────────────────────────────────────────────────────
function GeneratePage({ setPage }) {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    tema: "",
    karakter: "",
    visual: "",
    mood: "",
    pesan: "",
    usia: "",
  });

  const visualStyles = [
    { id: "watercolor", label: "Soft Watercolor", desc: "Lembut & artistik", emoji: "🎨", bg: ["#E8D5F5", "#F5EBF8"] },
    { id: "pastel", label: "Pastel Cute", desc: "Manis & ceria", emoji: "🌸", bg: ["#FBD4C8", "#FEF0EB"] },
    { id: "classic", label: "Storybook Classic", desc: "Hangat & nostalgia", emoji: "📚", bg: ["#FDF3D9", "#FEF8E6"] },
  ];

  const moods = ["Ceria 🌈", "Menenangkan 🌙", "Petualangan 🚀", "Ajaib ✨", "Hangat 🧡", "Lucu 😄"];
  const usiaOptions = ["2–4 tahun", "3–5 tahun", "4–6 tahun", "5–7 tahun", "6–8 tahun", "8–10 tahun"];
  const temaContoh = ["Persahabatan yang tulus", "Keberanian si kecil", "Menjaga alam", "Belajar berbagi", "Mengenal perasaan"];
  const karakterContoh = ["Kelinci kecil bernama Kiko", "Kucing oranye yang pemberani", "Dino biru yang baik hati", "Burung kecil yang suka bernyanyi"];

  const totalSteps = 3;

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  function handleGenerate() {
    setPage("loading");
  }

  const inputStyle = {
    width: "100%",
    boxSizing: "border-box",
    padding: "14px 18px",
    borderRadius: 16,
    border: `2px solid ${C.creamDark}`,
    fontSize: 15,
    fontFamily: "inherit",
    color: C.text,
    background: C.white,
    outline: "none",
    transition: "border 0.2s",
    resize: "none",
  };

  return (
    <div style={{ maxWidth: 720, margin: "0 auto", padding: "40px 1.5rem 80px" }}>
      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: 48 }}>
        <h1 style={{ fontFamily: "'Fraunces', serif", fontSize: "clamp(1.8rem, 5vw, 2.6rem)", color: C.text, marginBottom: 10 }}>Rancang Storybook-mu ✨</h1>
        <p style={{ color: C.textMid, fontSize: 15 }}>Isi dengan hati, AI akan merangkai keajaiban</p>
      </div>

      {/* Progress Bar */}
      <div style={{ marginBottom: 48 }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
          {["Cerita & Karakter", "Gaya Visual", "Detail Akhir"].map((label, i) => (
            <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", flex: 1 }}>
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: "50%",
                  background: step > i + 1 ? C.mint : step === i + 1 ? C.purple : C.creamDark,
                  color: step >= i + 1 ? C.white : C.textLight,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 15,
                  fontWeight: 700,
                  transition: "all 0.3s",
                  boxShadow: step === i + 1 ? `0 4px 16px ${C.purple}50` : "none",
                }}
              >
                {step > i + 1 ? "✓" : i + 1}
              </div>
              <span style={{ fontSize: 11, marginTop: 6, color: step === i + 1 ? C.purple : C.textLight, fontWeight: step === i + 1 ? 700 : 400, textAlign: "center" }}>{label}</span>
            </div>
          ))}
        </div>
        <div style={{ height: 6, background: C.creamDark, borderRadius: 6, overflow: "hidden" }}>
          <div style={{ height: "100%", background: `linear-gradient(90deg, ${C.purple}, ${C.purpleLight})`, borderRadius: 6, width: `${(step / totalSteps) * 100}%`, transition: "width 0.4s ease" }} />
        </div>
      </div>

      {/* STEP 1 */}
      {step === 1 && (
        <div style={{ animation: "fadeIn 0.3s ease" }}>
          <FieldCard label="Tema Cerita 🌟" hint="Apa inti dari kisah ini?">
            <textarea
              value={form.tema}
              rows={3}
              onChange={(e) => set("tema", e.target.value)}
              placeholder="Cerita tentang persahabatan seekor kucing dan rusa..."
              style={inputStyle}
              onFocus={(e) => (e.target.style.border = `2px solid ${C.purple}`)}
              onBlur={(e) => (e.target.style.border = `2px solid ${C.creamDark}`)}
            />
            <SuggestChips items={temaContoh} onSelect={(v) => set("tema", v)} />
          </FieldCard>

          <FieldCard label="Karakter Utama 🦊" hint="Siapa bintang cerita ini?">
            <input
              value={form.karakter}
              onChange={(e) => set("karakter", e.target.value)}
              placeholder="Contoh: Kelinci kecil bernama Bintang..."
              style={{ ...inputStyle }}
              onFocus={(e) => (e.target.style.border = `2px solid ${C.purple}`)}
              onBlur={(e) => (e.target.style.border = `2px solid ${C.creamDark}`)}
            />
            <SuggestChips items={karakterContoh} onSelect={(v) => set("karakter", v)} />
          </FieldCard>
        </div>
      )}

      {/* STEP 2 */}
      {step === 2 && (
        <div style={{ animation: "fadeIn 0.3s ease" }}>
          <FieldCard label="Gaya Visual 🎨" hint="Pilih satu gaya ilustrasi">
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 14 }}>
              {visualStyles.map((vs) => (
                <button
                  key={vs.id}
                  onClick={() => set("visual", vs.id)}
                  style={{
                    background: form.visual === vs.id ? `linear-gradient(135deg, ${vs.bg[0]}, ${vs.bg[1]})` : C.white,
                    border: `2.5px solid ${form.visual === vs.id ? C.purple : C.creamDark}`,
                    borderRadius: 20,
                    padding: "20px 12px",
                    cursor: "pointer",
                    textAlign: "center",
                    transition: "all 0.2s",
                    boxShadow: form.visual === vs.id ? `0 6px 20px ${C.purple}30` : "none",
                    fontFamily: "inherit",
                  }}
                >
                  <div style={{ fontSize: 32, marginBottom: 8 }}>{vs.emoji}</div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: C.text, marginBottom: 4 }}>{vs.label}</div>
                  <div style={{ fontSize: 11, color: C.textMid }}>{vs.desc}</div>
                  {form.visual === vs.id && <div style={{ marginTop: 8, fontSize: 16 }}>✓</div>}
                </button>
              ))}
            </div>
          </FieldCard>

          <FieldCard label="Mood Cerita 🌈" hint="Bagaimana nuansa yang dirasakan?">
            <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
              {moods.map((m) => (
                <button
                  key={m}
                  onClick={() => set("mood", m)}
                  style={{
                    padding: "10px 20px",
                    borderRadius: 20,
                    fontFamily: "inherit",
                    background: form.mood === m ? C.purple : C.white,
                    color: form.mood === m ? C.white : C.textMid,
                    border: `2px solid ${form.mood === m ? C.purple : C.creamDark}`,
                    fontSize: 14,
                    fontWeight: 600,
                    cursor: "pointer",
                    transition: "all 0.2s",
                  }}
                >
                  {m}
                </button>
              ))}
            </div>
          </FieldCard>
        </div>
      )}

      {/* STEP 3 */}
      {step === 3 && (
        <div style={{ animation: "fadeIn 0.3s ease" }}>
          <FieldCard label="Pesan Moral 💛" hint="Pelajaran apa yang ingin disampaikan?">
            <input
              value={form.pesan}
              onChange={(e) => set("pesan", e.target.value)}
              placeholder="Contoh: Bersahabat tanpa memandang perbedaan..."
              style={inputStyle}
              onFocus={(e) => (e.target.style.border = `2px solid ${C.purple}`)}
              onBlur={(e) => (e.target.style.border = `2px solid ${C.creamDark}`)}
            />
          </FieldCard>

          <FieldCard label="Target Usia 👶" hint="Siapa pembaca kecil kita?">
            <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
              {usiaOptions.map((u) => (
                <button
                  key={u}
                  onClick={() => set("usia", u)}
                  style={{
                    padding: "10px 20px",
                    borderRadius: 20,
                    fontFamily: "inherit",
                    background: form.usia === u ? C.peach : C.white,
                    color: form.usia === u ? C.white : C.textMid,
                    border: `2px solid ${form.usia === u ? C.peach : C.creamDark}`,
                    fontSize: 14,
                    fontWeight: 600,
                    cursor: "pointer",
                    transition: "all 0.2s",
                  }}
                >
                  {u}
                </button>
              ))}
            </div>
          </FieldCard>

          {/* Summary */}
          <div
            style={{
              background: C.purplePale,
              borderRadius: 20,
              padding: "24px",
              border: `1.5px solid ${C.purple}30`,
              marginBottom: 24,
            }}
          >
            <h4 style={{ fontWeight: 700, marginBottom: 14, color: C.purple, fontSize: 14 }}>✦ Ringkasan Storybook-mu</h4>
            {[
              ["Tema", form.tema],
              ["Karakter", form.karakter],
              ["Visual", form.visual],
              ["Mood", form.mood],
              ["Pesan", form.pesan],
              ["Usia", form.usia],
            ].map(
              ([k, v]) =>
                v && (
                  <div key={k} style={{ display: "flex", gap: 10, marginBottom: 8, fontSize: 14 }}>
                    <span style={{ color: C.textLight, minWidth: 70 }}>{k}</span>
                    <span style={{ color: C.text, fontWeight: 600 }}>{v}</span>
                  </div>
                ),
            )}
          </div>
        </div>
      )}

      {/* Navigation Buttons */}
      <div style={{ display: "flex", gap: 12, justifyContent: "space-between", marginTop: 8 }}>
        {step > 1 && (
          <button
            onClick={() => setStep((s) => s - 1)}
            style={{
              padding: "14px 28px",
              borderRadius: 20,
              border: `2px solid ${C.creamDark}`,
              background: C.white,
              color: C.textMid,
              fontSize: 15,
              fontWeight: 700,
              cursor: "pointer",
              fontFamily: "inherit",
            }}
          >
            ← Kembali
          </button>
        )}
        {step < totalSteps ? (
          <button
            onClick={() => setStep((s) => s + 1)}
            style={{
              marginLeft: "auto",
              padding: "14px 36px",
              borderRadius: 20,
              background: `linear-gradient(135deg, ${C.purple}, ${C.purpleLight})`,
              color: C.white,
              border: "none",
              fontSize: 15,
              fontWeight: 800,
              cursor: "pointer",
              fontFamily: "inherit",
              boxShadow: `0 6px 20px ${C.purple}40`,
            }}
          >
            Lanjut →
          </button>
        ) : (
          <button
            onClick={handleGenerate}
            style={{
              marginLeft: "auto",
              flex: 1,
              padding: "18px 36px",
              borderRadius: 24,
              background: `linear-gradient(135deg, ${C.peach}, #E86B4A)`,
              color: C.white,
              border: "none",
              fontSize: 18,
              fontWeight: 800,
              cursor: "pointer",
              fontFamily: "inherit",
              boxShadow: `0 8px 28px ${C.peach}60`,
              letterSpacing: "-0.2px",
            }}
          >
            🪄 Generate Storybook-ku!
          </button>
        )}
      </div>

      <style>{`@keyframes fadeIn { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:translateY(0); } }`}</style>
    </div>
  );
}

function FieldCard({ label, hint, children }) {
  return (
    <div style={{ background: C.white, borderRadius: 24, padding: "28px", boxShadow: `0 4px 20px ${C.shadow}`, marginBottom: 24 }}>
      <label style={{ display: "block", fontWeight: 800, fontSize: 16, color: C.text, marginBottom: 4 }}>{label}</label>
      <p style={{ fontSize: 13, color: C.textLight, marginBottom: 16 }}>{hint}</p>
      {children}
    </div>
  );
}

function SuggestChips({ items, onSelect }) {
  return (
    <div style={{ marginTop: 12, display: "flex", flexWrap: "wrap", gap: 8 }}>
      <span style={{ fontSize: 12, color: C.textLight, alignSelf: "center" }}>💡 Pilihkan aku:</span>
      {items.map((item) => (
        <button
          key={item}
          onClick={() => onSelect(item)}
          style={{
            padding: "6px 14px",
            borderRadius: 14,
            border: `1.5px dashed ${C.purple}50`,
            background: C.purplePale,
            color: C.purple,
            fontSize: 12,
            fontWeight: 600,
            cursor: "pointer",
            fontFamily: "inherit",
          }}
        >
          {item}
        </button>
      ))}
    </div>
  );
}

// ─── LOADING PAGE ─────────────────────────────────────────────────────────────
function LoadingPage({ setPage }) {
  const [progress, setProgress] = useState(0);
  const [msgIdx, setMsgIdx] = useState(0);
  const [pages, setPages] = useState([]);
  const [done, setDone] = useState(false);

  const messages = [
    "Menganalisis idemu yang luar biasa...",
    "Menyusun alur cerita ajaib...",
    "Membuat karakter Kiko yang menggemaskan...",
    "Merancang dunia yang penuh warna...",
    "Menggambar halaman 1 dari 12...",
    "Menggambar halaman 3 dari 12...",
    "Menambahkan detail ilustrasi...",
    "Menggambar halaman 6 dari 12...",
    "Mewarnai langit malam berbintang...",
    "Menggambar halaman 9 dari 12...",
    "Menulis teks dengan penuh kasih...",
    "Menggambar halaman 12 dari 12...",
    "Menyusun halaman menjadi buku...",
    "Sentuhan akhir penuh cinta... ✨",
  ];

  const pageColors = [
    ["#E8D5F5", "#C5A4E8"],
    ["#FBD4C8", "#F28B6E"],
    ["#B8EBD0", "#7EC8A0"],
    ["#FDF3D9", "#E8B84B"],
    ["#E6F0FB", "#7BA9E8"],
    ["#F5E6FB", "#C87ADC"],
    ["#D5EBF5", "#6EB5D4"],
    ["#FBE8D0", "#E8A06A"],
    ["#E0F5D5", "#8ECB6A"],
    ["#F0E6FA", "#A87ACC"],
    ["#FDE8E8", "#E87A7A"],
    ["#E8F5E8", "#7ACC7A"],
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((p) => {
        const next = p + 100 / (messages.length * 2);
        if (next >= 100) {
          clearInterval(interval);
          setDone(true);
          return 100;
        }
        return next;
      });
      setMsgIdx((m) => Math.min(m + 1, messages.length - 1));
    }, 700);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const t = setInterval(() => {
      setPages((p) => (p.length < 12 ? [...p, p.length] : p));
    }, 1100);
    return () => clearInterval(t);
  }, []);

  return (
    <div style={{ minHeight: "80vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "60px 2rem", textAlign: "center" }}>
      {/* Magical orb */}
      <div style={{ position: "relative", marginBottom: 40 }}>
        <div
          style={{
            width: 120,
            height: 120,
            borderRadius: "50%",
            background: `radial-gradient(circle at 35% 35%, ${C.purpleLight}, ${C.purple})`,
            boxShadow: `0 0 0 16px ${C.purplePale}, 0 0 0 32px ${C.purple}15`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 48,
            animation: "pulse 2s ease-in-out infinite",
          }}
        >
          📖
        </div>
      </div>

      <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: "clamp(1.6rem, 4vw, 2.2rem)", color: C.text, marginBottom: 12 }}>Sedang Menciptakan Keajaiban...</h2>
      <p
        style={{
          fontSize: 16,
          color: C.purple,
          fontWeight: 600,
          marginBottom: 40,
          minHeight: 28,
          transition: "opacity 0.3s",
        }}
      >
        {messages[msgIdx]}
      </p>

      {/* Progress Bar */}
      <div style={{ width: "100%", maxWidth: 480, marginBottom: 48 }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8, fontSize: 13, color: C.textLight }}>
          <span>Kemajuan</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div style={{ height: 12, background: C.creamDark, borderRadius: 6, overflow: "hidden" }}>
          <div
            style={{
              height: "100%",
              background: `linear-gradient(90deg, ${C.purple}, ${C.peach})`,
              borderRadius: 6,
              width: `${progress}%`,
              transition: "width 0.6s ease",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                position: "absolute",
                inset: 0,
                background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)",
                animation: "shimmer 1.5s linear infinite",
              }}
            />
          </div>
        </div>
      </div>

      {/* Steps indicator */}
      <div style={{ display: "flex", gap: 20, marginBottom: 48 }}>
        {["Cerita", "Karakter", "Ilustrasi", "Perakitan"].map((s, i) => {
          const pct = (i + 1) / 4;
          const done2 = progress / 100 >= pct;
          return (
            <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: "50%",
                  background: done2 ? C.mint : C.creamDark,
                  color: done2 ? C.white : C.textLight,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 14,
                  fontWeight: 700,
                  transition: "all 0.4s",
                  boxShadow: done2 ? `0 4px 12px ${C.mint}60` : "none",
                }}
              >
                {done2 ? "✓" : i + 1}
              </div>
              <span style={{ fontSize: 11, color: done2 ? C.text : C.textLight, fontWeight: done2 ? 700 : 400 }}>{s}</span>
            </div>
          );
        })}
      </div>

      {/* Pages loading */}
      <div style={{ maxWidth: 600, width: "100%" }}>
        <p style={{ fontSize: 13, color: C.textLight, marginBottom: 16 }}>Halaman terbentuk satu per satu...</p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 10, justifyContent: "center" }}>
          {Array.from({ length: 12 }).map((_, i) => {
            const isReady = i < pages.length;
            return (
              <div
                key={i}
                style={{
                  width: 52,
                  height: 68,
                  borderRadius: 10,
                  background: isReady ? `linear-gradient(160deg, ${pageColors[i][0]}, ${pageColors[i][1]})` : C.creamDark,
                  boxShadow: isReady ? `0 4px 12px ${C.shadow}` : "none",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: isReady ? 20 : 13,
                  color: isReady ? C.white : C.textLight,
                  fontWeight: isReady ? 700 : 400,
                  transition: "all 0.4s ease",
                  transform: isReady ? "scale(1)" : "scale(0.9)",
                  opacity: isReady ? 1 : 0.4,
                }}
              >
                {isReady ? ["⭐", "🌙", "🦊", "🌸", "🏡", "🌊", "🎈", "🍀", "🦋", "🌈", "🎵", "✨"][i] : i + 1}
              </div>
            );
          })}
        </div>
      </div>

      {done && (
        <div style={{ marginTop: 48, animation: "fadeIn 0.5s ease" }}>
          <div
            style={{
              background: `linear-gradient(135deg, ${C.mint}30, ${C.mintPale})`,
              border: `2px solid ${C.mint}`,
              borderRadius: 24,
              padding: "24px 40px",
              marginBottom: 24,
            }}
          >
            <p style={{ fontSize: 18, fontWeight: 700, color: "#2A7A50", marginBottom: 4 }}>🎉 Storybook-mu Siap!</p>
            <p style={{ fontSize: 14, color: "#4A9A70" }}>12 halaman penuh warna telah tercipta untukmu</p>
          </div>
          <button
            onClick={() => setPage("preview")}
            style={{
              background: `linear-gradient(135deg, ${C.purple}, ${C.purpleLight})`,
              color: C.white,
              border: "none",
              borderRadius: 24,
              padding: "18px 52px",
              fontSize: 17,
              fontWeight: 800,
              cursor: "pointer",
              boxShadow: `0 8px 28px ${C.purple}50`,
              fontFamily: "inherit",
            }}
          >
            📖 Lihat Storybook-ku →
          </button>
        </div>
      )}

      <style>{`
        @keyframes pulse { 0%,100%{transform:scale(1);} 50%{transform:scale(1.06);} }
        @keyframes shimmer { 0%{transform:translateX(-100%);} 100%{transform:translateX(300%);} }
        @keyframes fadeIn { from{opacity:0;transform:translateY(12px);} to{opacity:1;transform:translateY(0);} }
      `}</style>
    </div>
  );
}

// ─── PREVIEW PAGE ─────────────────────────────────────────────────────────────
function PreviewPage({ setPage }) {
  const [current, setCurrent] = useState(0);
  const [editText, setEditText] = useState(null);

  const storyPages = [
    {
      type: "cover",
      bg: ["#C5A4E8", "#7C5CBF", "#5A3F9A"],
      emoji: "⭐",
      title: "Kiko dan Bintang Ajaib",
      subtitle: "Sebuah cerita tentang keberanian dan persahabatan",
      text: null,
    },
    {
      type: "page",
      bg: ["#E8D5F5", "#D4B8F0"],
      emoji: "🌙",
      pageNum: 1,
      title: "Malam yang Tenang",
      text: "Di sebuah desa kecil di tepi hutan, tinggallah seekor kucing oranye bernama Kiko. Setiap malam, Kiko duduk di atas genteng dan memandang langit berbintang dengan penuh harap.",
    },
    {
      type: "page",
      bg: ["#FBD4C8", "#F0A898"],
      emoji: "✨",
      pageNum: 4,
      title: "Bintang Jatuh",
      text: "Tiba-tiba, sebuah bintang kecil jatuh dari langit dan mendarat di ladang bunga matahari milik Nenek Rosy. Kiko berlari sekencang mungkin menuju cahaya yang berkelap-kelip itu.",
    },
    {
      type: "page",
      bg: ["#B8EBD0", "#7EC8A0"],
      emoji: "🦊",
      pageNum: 8,
      title: "Sahabat Baru",
      text: 'Di sana, Kiko menemukan seekor rubah kecil yang terluka. Tanpa ragu, Kiko merawat luka itu dengan daun lembut dari hutan. "Namaku Bintang," bisik si rubah dengan suara lemah.',
    },
    {
      type: "page",
      bg: ["#FDF3D9", "#F5E098"],
      emoji: "🌈",
      pageNum: 12,
      title: "Persahabatan Sejati",
      text: "Sejak hari itu, Kiko dan Bintang menjadi sahabat tak terpisahkan. Kiko belajar bahwa keberanian sejati bukan tentang tidak takut, melainkan tentang terus melangkah meski hati gemetar.",
    },
  ];

  const current_page = storyPages[current];

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "40px 1.5rem 80px" }}>
      <div style={{ textAlign: "center", marginBottom: 36 }}>
        <h1 style={{ fontFamily: "'Fraunces', serif", fontSize: "clamp(1.6rem, 4vw, 2.2rem)", color: C.text, marginBottom: 8 }}>Preview Storybook 📖</h1>
        <p style={{ color: C.textMid, fontSize: 14 }}>
          Halaman {current + 1} dari {storyPages.length} · <span style={{ color: C.purple, fontWeight: 700 }}>Kiko dan Bintang Ajaib</span>
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "200px 1fr", gap: 28, alignItems: "start" }}>
        {/* Thumbnail Sidebar */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <p style={{ fontSize: 12, fontWeight: 700, color: C.textLight, marginBottom: 4, textTransform: "uppercase", letterSpacing: 1 }}>Halaman</p>
          {storyPages.map((p, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              style={{
                background: i === current ? C.purplePale : C.white,
                border: `2.5px solid ${i === current ? C.purple : C.creamDark}`,
                borderRadius: 16,
                padding: "10px 12px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 10,
                transition: "all 0.2s",
                textAlign: "left",
                fontFamily: "inherit",
                boxShadow: i === current ? `0 4px 14px ${C.purple}30` : "none",
              }}
            >
              <div
                style={{
                  width: 40,
                  height: 52,
                  borderRadius: 8,
                  flexShrink: 0,
                  background: `linear-gradient(160deg, ${p.bg[0]}, ${p.bg[1] || p.bg[0]})`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 18,
                }}
              >
                {p.emoji}
              </div>
              <div>
                <div style={{ fontSize: 12, fontWeight: 700, color: i === current ? C.purple : C.text }}>{p.type === "cover" ? "Cover" : `Hal. ${p.pageNum}`}</div>
                <div style={{ fontSize: 11, color: C.textLight, marginTop: 2 }}>{p.title}</div>
              </div>
            </button>
          ))}
        </div>

        {/* Main Page View */}
        <div>
          <div
            style={{
              background: `linear-gradient(160deg, ${current_page.bg[0]}, ${current_page.bg[1] || current_page.bg[0]}, ${current_page.bg[2] || current_page.bg[1] || current_page.bg[0]})`,
              borderRadius: 32,
              padding: "60px 48px",
              boxShadow: `0 16px 56px ${C.shadowMd}`,
              minHeight: 440,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center",
              position: "relative",
              overflow: "hidden",
            }}
          >
            {/* Decorative circles */}
            <div style={{ position: "absolute", top: -40, right: -40, width: 200, height: 200, borderRadius: "50%", background: "rgba(255,255,255,0.12)" }} />
            <div style={{ position: "absolute", bottom: -60, left: -30, width: 240, height: 240, borderRadius: "50%", background: "rgba(255,255,255,0.08)" }} />

            <div style={{ position: "relative", zIndex: 1, maxWidth: 520 }}>
              <div style={{ fontSize: 80, marginBottom: 24, filter: "drop-shadow(0 8px 20px rgba(0,0,0,0.15))" }}>{current_page.emoji}</div>

              {current_page.type === "cover" ? (
                <>
                  <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: 32, fontWeight: 700, color: C.white, marginBottom: 16, textShadow: "0 2px 12px rgba(0,0,0,0.2)", lineHeight: 1.2 }}>{current_page.title}</h2>
                  <p style={{ fontSize: 15, color: "rgba(255,255,255,0.85)", fontStyle: "italic", marginBottom: 24 }}>{current_page.subtitle}</p>
                  <div style={{ background: "rgba(255,255,255,0.25)", borderRadius: 16, padding: "8px 20px", display: "inline-block" }}>
                    <span style={{ fontSize: 13, color: C.white, fontWeight: 700 }}>✦ StoryMagic · 2026</span>
                  </div>
                </>
              ) : (
                <>
                  <div style={{ background: "rgba(255,255,255,0.3)", borderRadius: 10, padding: "4px 16px", marginBottom: 20, display: "inline-block" }}>
                    <span style={{ fontSize: 12, color: C.white, fontWeight: 700 }}>Halaman {current_page.pageNum}</span>
                  </div>
                  <h3 style={{ fontFamily: "'Fraunces', serif", fontSize: 24, fontWeight: 600, color: C.white, marginBottom: 20, textShadow: "0 2px 10px rgba(0,0,0,0.15)" }}>{current_page.title}</h3>
                  {editText === current ? (
                    <textarea
                      value={current_page.text}
                      style={{
                        width: "100%",
                        background: "rgba(255,255,255,0.9)",
                        borderRadius: 16,
                        border: "none",
                        padding: "16px",
                        fontSize: 16,
                        lineHeight: 1.8,
                        color: C.text,
                        fontFamily: "'Nunito', sans-serif",
                        resize: "none",
                        boxSizing: "border-box",
                      }}
                      rows={5}
                      onBlur={() => setEditText(null)}
                      autoFocus
                    />
                  ) : (
                    <p
                      style={{
                        fontSize: 17,
                        lineHeight: 1.85,
                        color: C.white,
                        background: "rgba(0,0,0,0.1)",
                        borderRadius: 16,
                        padding: "20px 24px",
                        textShadow: "0 1px 4px rgba(0,0,0,0.15)",
                        cursor: "text",
                      }}
                      onClick={() => setEditText(current)}
                    >
                      {current_page.text}
                    </p>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{ display: "flex", gap: 12, marginTop: 20, flexWrap: "wrap" }}>
            <button
              onClick={() => setEditText(current)}
              style={{
                padding: "12px 22px",
                borderRadius: 16,
                border: `2px solid ${C.creamDark}`,
                background: C.white,
                color: C.textMid,
                fontSize: 14,
                fontWeight: 700,
                cursor: "pointer",
                fontFamily: "inherit",
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              ✏️ Edit Teks
            </button>

            <button
              style={{
                padding: "12px 22px",
                borderRadius: 16,
                border: `2px solid ${C.peachLight}`,
                background: C.peachPale,
                color: C.peach,
                fontSize: 14,
                fontWeight: 700,
                cursor: "pointer",
                fontFamily: "inherit",
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              🎨 Regenerasi Ilustrasi
            </button>

            <div style={{ marginLeft: "auto", display: "flex", gap: 12 }}>
              <button
                onClick={() => setCurrent((c) => Math.max(0, c - 1))}
                disabled={current === 0}
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: "50%",
                  border: `2px solid ${C.creamDark}`,
                  background: C.white,
                  fontSize: 18,
                  cursor: current === 0 ? "default" : "pointer",
                  opacity: current === 0 ? 0.4 : 1,
                  fontFamily: "inherit",
                }}
              >
                ←
              </button>
              <button
                onClick={() => setCurrent((c) => Math.min(storyPages.length - 1, c + 1))}
                disabled={current === storyPages.length - 1}
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: "50%",
                  border: "none",
                  background: current === storyPages.length - 1 ? C.creamDark : C.purple,
                  color: C.white,
                  fontSize: 18,
                  cursor: current === storyPages.length - 1 ? "default" : "pointer",
                  opacity: current === storyPages.length - 1 ? 0.4 : 1,
                  fontFamily: "inherit",
                }}
              >
                →
              </button>
            </div>
          </div>

          {/* Export CTA */}
          <div
            style={{
              marginTop: 28,
              background: `linear-gradient(135deg, ${C.purplePale}, ${C.peachPale})`,
              borderRadius: 20,
              padding: "24px 28px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 16,
              flexWrap: "wrap",
            }}
          >
            <div>
              <p style={{ fontWeight: 700, color: C.text, marginBottom: 4 }}>Storybook-mu siap untuk diekspor! 🎉</p>
              <p style={{ fontSize: 13, color: C.textMid }}>12 halaman penuh · Kualitas cetak tinggi</p>
            </div>
            <button
              onClick={() => setPage("export")}
              style={{
                background: `linear-gradient(135deg, ${C.purple}, ${C.purpleLight})`,
                color: C.white,
                border: "none",
                borderRadius: 20,
                padding: "14px 28px",
                fontSize: 15,
                fontWeight: 800,
                cursor: "pointer",
                fontFamily: "inherit",
                boxShadow: `0 6px 20px ${C.purple}40`,
              }}
            >
              📥 Ekspor Storybook →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── EXPORT PAGE ──────────────────────────────────────────────────────────────
function ExportPage() {
  const [chosen, setChosen] = useState(null);
  const [downloading, setDownloading] = useState(false);
  const [done, setDone] = useState(false);

  function handleDownload() {
    if (!chosen || chosen === "print") return;
    setDownloading(true);
    setTimeout(() => {
      setDownloading(false);
      setDone(true);
    }, 2800);
  }

  const options = [
    {
      id: "digital",
      icon: "📱",
      label: "Digital PDF",
      sub: "Optimal untuk layar & share",
      size: "~8 MB",
      features: ["Resolusi 150 DPI", "Teks anti-aliased", "Link aktif", "Ukuran kecil"],
      color: C.purple,
      available: true,
    },
    {
      id: "print",
      icon: "🖨️",
      label: "Print-ready PDF",
      sub: "Kualitas cetak profesional",
      size: "~45 MB",
      features: ["Resolusi 300 DPI", "Warna CMYK", "Bleed area", "Siap percetakan"],
      color: C.peach,
      available: false,
    },
  ];

  return (
    <div style={{ maxWidth: 680, margin: "0 auto", padding: "40px 1.5rem 80px" }}>
      <div style={{ textAlign: "center", marginBottom: 48 }}>
        <h1 style={{ fontFamily: "'Fraunces', serif", fontSize: "clamp(1.6rem, 4vw, 2.2rem)", color: C.text, marginBottom: 10 }}>Ekspor Storybook 📥</h1>
        <p style={{ color: C.textMid, fontSize: 15 }}>Pilih format yang paling sesuai untukmu</p>
      </div>

      {!done ? (
        <>
          {/* Book summary */}
          <div
            style={{
              background: C.white,
              borderRadius: 24,
              padding: "24px 28px",
              boxShadow: `0 4px 20px ${C.shadow}`,
              marginBottom: 28,
              display: "flex",
              alignItems: "center",
              gap: 20,
            }}
          >
            <div
              style={{
                width: 72,
                height: 90,
                borderRadius: 14,
                flexShrink: 0,
                background: `linear-gradient(160deg, ${C.purpleLight}, ${C.purpleDark})`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 32,
              }}
            >
              ⭐
            </div>
            <div>
              <h3 style={{ fontWeight: 800, color: C.text, marginBottom: 6, fontSize: 17 }}>Kiko dan Bintang Ajaib</h3>
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                {["12 halaman", "Soft Watercolor", "Usia 4–6 th"].map((t) => (
                  <span
                    key={t}
                    style={{
                      background: C.purplePale,
                      color: C.purple,
                      borderRadius: 10,
                      padding: "4px 12px",
                      fontSize: 12,
                      fontWeight: 700,
                    }}
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Export Options */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 28 }}>
            {options.map((opt) => (
              <button
                key={opt.id}
                onClick={() => opt.available && setChosen(opt.id)}
                style={{
                  background: chosen === opt.id ? (opt.id === "digital" ? C.purplePale : C.peachPale) : C.white,
                  border: `2.5px solid ${chosen === opt.id ? opt.color : C.creamDark}`,
                  borderRadius: 24,
                  padding: "24px 20px",
                  cursor: opt.available ? "pointer" : "default",
                  textAlign: "left",
                  position: "relative",
                  opacity: opt.available ? 1 : 0.6,
                  boxShadow: chosen === opt.id ? `0 6px 24px ${opt.color}30` : "none",
                  transition: "all 0.2s",
                  fontFamily: "inherit",
                }}
              >
                {!opt.available && (
                  <div
                    style={{
                      position: "absolute",
                      top: 12,
                      right: 12,
                      background: C.goldPale,
                      color: "#9A6B10",
                      borderRadius: 8,
                      padding: "3px 10px",
                      fontSize: 10,
                      fontWeight: 700,
                    }}
                  >
                    Segera Hadir
                  </div>
                )}
                {chosen === opt.id && (
                  <div
                    style={{
                      position: "absolute",
                      top: 12,
                      right: 12,
                      width: 24,
                      height: 24,
                      borderRadius: "50%",
                      background: opt.color,
                      color: C.white,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 12,
                      fontWeight: 700,
                    }}
                  >
                    ✓
                  </div>
                )}
                <div style={{ fontSize: 36, marginBottom: 12 }}>{opt.icon}</div>
                <h4 style={{ fontWeight: 800, color: C.text, marginBottom: 4, fontSize: 16 }}>{opt.label}</h4>
                <p style={{ fontSize: 12, color: C.textMid, marginBottom: 14 }}>{opt.sub}</p>
                <div style={{ borderTop: `1px solid ${C.creamDark}`, paddingTop: 12 }}>
                  {opt.features.map((f) => (
                    <div key={f} style={{ fontSize: 12, color: C.textMid, marginBottom: 5, display: "flex", gap: 6 }}>
                      <span style={{ color: opt.color }}>✓</span> {f}
                    </div>
                  ))}
                  <div style={{ marginTop: 10, fontSize: 12, fontWeight: 700, color: C.textLight }}>Ukuran file: {opt.size}</div>
                </div>
              </button>
            ))}
          </div>

          {/* Download Button */}
          <button
            onClick={handleDownload}
            disabled={!chosen || chosen === "print" || downloading}
            style={{
              width: "100%",
              padding: "18px",
              borderRadius: 24,
              background: chosen && chosen !== "print" && !downloading ? `linear-gradient(135deg, ${C.purple}, ${C.purpleLight})` : C.creamDark,
              color: chosen && chosen !== "print" && !downloading ? C.white : C.textLight,
              border: "none",
              fontSize: 17,
              fontWeight: 800,
              cursor: chosen && chosen !== "print" ? "pointer" : "default",
              fontFamily: "inherit",
              transition: "all 0.3s",
              boxShadow: chosen && chosen !== "print" ? `0 8px 28px ${C.purple}40` : "none",
            }}
          >
            {downloading ? <span>⏳ Menyiapkan file... harap tunggu</span> : <span>📥 Unduh {chosen === "digital" ? "Digital PDF" : "Storybook"}</span>}
          </button>

          {downloading && (
            <div style={{ marginTop: 20 }}>
              <div style={{ height: 6, background: C.creamDark, borderRadius: 6, overflow: "hidden" }}>
                <div
                  style={{
                    height: "100%",
                    background: `linear-gradient(90deg, ${C.purple}, ${C.purpleLight})`,
                    borderRadius: 6,
                    animation: "downloadProgress 2.8s ease forwards",
                  }}
                />
              </div>
              <p style={{ textAlign: "center", fontSize: 13, color: C.textLight, marginTop: 10 }}>Mengompresi halaman dan memfinalisasi PDF...</p>
            </div>
          )}
        </>
      ) : (
        // SUCCESS STATE
        <div style={{ textAlign: "center", padding: "20px 0", animation: "fadeIn 0.5s ease" }}>
          <div
            style={{
              width: 120,
              height: 120,
              borderRadius: "50%",
              margin: "0 auto 32px",
              background: `linear-gradient(135deg, ${C.mint}, #4CA87A)`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 52,
              boxShadow: `0 0 0 16px ${C.mintPale}, 0 16px 40px ${C.mint}40`,
            }}
          >
            🎉
          </div>

          <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: 28, color: C.text, marginBottom: 12 }}>Unduhan Berhasil!</h2>
          <p style={{ color: C.textMid, fontSize: 16, maxWidth: 380, margin: "0 auto 36px", lineHeight: 1.7 }}>
            Storybook <strong>"Kiko dan Bintang Ajaib"</strong> telah tersimpan di perangkatmu. Selamat membaca bersama si kecil! 💛
          </p>

          <div
            style={{
              background: C.white,
              borderRadius: 20,
              padding: "20px 24px",
              boxShadow: `0 4px 20px ${C.shadow}`,
              marginBottom: 36,
              display: "flex",
              justifyContent: "space-around",
            }}
          >
            {[
              ["📄", "Digital PDF"],
              ["12", "Halaman"],
              ["⭐", "Ilustrasi AI"],
            ].map(([icon, label]) => (
              <div key={label} style={{ textAlign: "center" }}>
                <div style={{ fontSize: 28, marginBottom: 6 }}>{icon}</div>
                <div style={{ fontSize: 12, color: C.textMid, fontWeight: 700 }}>{label}</div>
              </div>
            ))}
          </div>

          <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
            <button
              style={{
                padding: "14px 28px",
                borderRadius: 20,
                border: `2px solid ${C.creamDark}`,
                background: C.white,
                color: C.textMid,
                fontSize: 14,
                fontWeight: 700,
                cursor: "pointer",
                fontFamily: "inherit",
              }}
            >
              🔗 Bagikan
            </button>
            <button
              style={{
                padding: "14px 28px",
                borderRadius: 20,
                background: `linear-gradient(135deg, ${C.purple}, ${C.purpleLight})`,
                color: C.white,
                border: "none",
                fontSize: 14,
                fontWeight: 700,
                cursor: "pointer",
                fontFamily: "inherit",
                boxShadow: `0 4px 16px ${C.purple}40`,
              }}
            >
              ✨ Buat Storybook Baru
            </button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes downloadProgress { from{width:0} to{width:100%} }
        @keyframes fadeIn { from{opacity:0;transform:translateY(16px);} to{opacity:1;transform:translateY(0);} }
      `}</style>
    </div>
  );
}

// ─── APP ROOT ─────────────────────────────────────────────────────────────────
export default function App() {
  const [page, setPage] = useState("landing");

  return (
    <div style={style.app}>
      <FontLoader />
      <Nav page={page} setPage={setPage} />
      {page === "landing" && <LandingPage setPage={setPage} />}
      {page === "generate" && <GeneratePage setPage={setPage} />}
      {page === "loading" && <LoadingPage setPage={setPage} />}
      {page === "preview" && <PreviewPage setPage={setPage} />}
      {page === "export" && <ExportPage />}
    </div>
  );
}
