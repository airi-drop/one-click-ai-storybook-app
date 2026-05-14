export type ShowcaseBook = {
  title: string;
  age: string;
  emoji: string;
  description: string;
  gradient: string;
};

export type StoryPage = {
  page: number;
  title: string;
  text: string;
  palette: string;
  emoji: string;
};

export const showcaseBooks: ShowcaseBook[] = [
  {
    title: "Kiko dan Bintang Ajaib",
    age: "3–5 th",
    emoji: "⭐",
    description: "Petualangan kucing kecil mencari bintang jatuh di langit malam.",
    gradient: "from-[#E8D5F5] via-[#C5A4E8] to-[#A07FD6]",
  },
  {
    title: "Dino Sahabat Hutan",
    age: "4–6 th",
    emoji: "🦕",
    description: "Dino belajar berbagi dengan teman-teman di hutan hijau.",
    gradient: "from-[#B8EBD0] via-[#7EC8A0] to-[#4CA87A]",
  },
  {
    title: "Nana Penjelajah Laut",
    age: "5–7 th",
    emoji: "🐠",
    description: "Nana menyelami samudra dan menemukan keajaiban bawah laut.",
    gradient: "from-[#FBD4C8] via-[#F28B6E] to-[#D4614A]",
  },
];

export const creationSteps = [
  {
    number: "01",
    icon: "✏️",
    title: "Ceritakan Idemu",
    description: "Masukkan tema, karakter, usia anak, dan pesan moral dalam beberapa klik.",
  },
  {
    number: "02",
    icon: "✨",
    title: "AI Bekerja",
    description: "Alur cerita, suasana, dan mock ilustrasi dirangkai menjadi buku ajaib.",
  },
  {
    number: "03",
    icon: "📚",
    title: "Buku Siap!",
    description: "Preview halaman demo lalu pilih format ekspor yang cocok untuk keluarga.",
  },
];

export const features = [
  { icon: "🎨", title: "Ilustrasi Cantik", description: "Gaya visual lembut yang ramah untuk anak." },
  { icon: "🌈", title: "12 Halaman Penuh", description: "Struktur cerita awal, tengah, dan akhir." },
  { icon: "💬", title: "Bahasa Indonesia", description: "Teks hangat dengan kosakata yang kaya." },
  { icon: "📥", title: "Export PDF", description: "Mock ekspor untuk digital atau cetak." },
  { icon: "✏️", title: "Edit Bebas", description: "Form dirancang untuk iterasi ide cepat." },
  { icon: "💛", title: "Pesan Moral", description: "Setiap kisah membawa nilai kehidupan." },
];

export const visualStyles = [
  { id: "watercolor", label: "Soft Watercolor", description: "Lembut & artistik", emoji: "🎨", gradient: "from-[#E8D5F5] to-[#F5EBF8]" },
  { id: "pastel", label: "Pastel Cute", description: "Manis & ceria", emoji: "🌸", gradient: "from-[#FBD4C8] to-[#FEF0EB]" },
  { id: "classic", label: "Storybook Classic", description: "Hangat & nostalgia", emoji: "📚", gradient: "from-[#FDF3D9] to-[#FEF8E6]" },
];

export const moodOptions = ["Ceria 🌈", "Menenangkan 🌙", "Petualangan 🚀", "Ajaib ✨", "Hangat 🧡", "Lucu 😄"];
export const ageOptions = ["2–4 tahun", "3–5 tahun", "4–6 tahun", "5–7 tahun", "6–8 tahun", "8–10 tahun"];
export const themeSuggestions = ["Persahabatan yang tulus", "Keberanian si kecil", "Menjaga alam", "Belajar berbagi", "Mengenal perasaan"];
export const characterSuggestions = ["Kelinci kecil bernama Kiko", "Kucing oranye yang pemberani", "Dino biru yang baik hati", "Burung kecil yang suka bernyanyi"];

export const loadingMessages = [
  "Menganalisis idemu yang luar biasa...",
  "Menyusun alur cerita ajaib...",
  "Membuat karakter Kiko yang menggemaskan...",
  "Merancang dunia yang penuh warna...",
  "Menggambar halaman 1 dari 12...",
  "Menambahkan detail ilustrasi...",
  "Mewarnai langit malam berbintang...",
  "Menulis teks dengan penuh kasih...",
  "Menyusun halaman menjadi buku...",
  "Sentuhan akhir penuh cinta... ✨",
];

export const storyPages: StoryPage[] = [
  {
    page: 1,
    title: "Bintang Jatuh di Bukit Karamel",
    text: "Di desa kecil beraroma roti panggang, Kiko si kucing oranye melihat satu bintang turun perlahan seperti kunang-kunang raksasa.",
    palette: "from-[#E8D5F5] via-[#C5A4E8] to-[#7C5CBF]",
    emoji: "🌠",
  },
  {
    page: 2,
    title: "Peta dari Daun Mint",
    text: "Kiko bertemu Rara, rusa kecil yang membawa peta daun mint. Mereka berjanji mencari bintang itu bersama-sama.",
    palette: "from-[#B8EBD0] via-[#7EC8A0] to-[#4CA87A]",
    emoji: "🗺️",
  },
  {
    page: 3,
    title: "Jembatan Pelangi Lembut",
    text: "Saat hujan berhenti, sebuah jembatan pelangi muncul. Kiko takut menyeberang, tetapi Rara menggenggam ekornya dengan lembut.",
    palette: "from-[#FBD4C8] via-[#F28B6E] to-[#D4614A]",
    emoji: "🌈",
  },
  {
    page: 4,
    title: "Hadiah untuk Langit",
    text: "Mereka menemukan bintang mungil yang rindu pulang. Kiko belajar bahwa keberanian terasa lebih ringan saat dibagi dengan sahabat.",
    palette: "from-[#FDF3D9] via-[#E8B84B] to-[#C98F22]",
    emoji: "💛",
  },
];

export const exportOptions = [
  {
    id: "digital",
    title: "Digital PDF",
    description: "Cocok untuk tablet, dibagikan ke keluarga, atau dibaca sebelum tidur.",
    icon: "📱",
    size: "18 MB",
    features: ["Resolusi layar", "Link siap dibagikan", "Mock unduhan instan"],
  },
  {
    id: "print",
    title: "Print Ready",
    description: "Tata letak imajiner untuk cetak rumah dengan margin ramah jilid.",
    icon: "🖨️",
    size: "42 MB",
    features: ["300 DPI mock", "Bleed area", "Sampul depan-belakang"],
  },
];
