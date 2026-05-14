"use client";

import { useEffect, useMemo, useState } from "react";
import { storyPages } from "@/lib/mock-data";
import { generatedStoryStorageKey, isGeneratedStorybook, type GeneratedStorybook } from "@/lib/storybook";

type ExportPage = {
  pageNumber: number;
  title?: string;
  narrative: string;
  sceneDescription: string;
};

type ExportStory = {
  title: string;
  pages: ExportPage[];
};

const digitalExportOption = {
  id: "digital",
  title: "Square Digital Storybook",
  description: "Unduh storybook format persegi yang enak dibaca di ponsel, tablet, dan dibagikan sebagai cerita digital.",
  icon: "SQ",
  size: "1:1",
  features: ["Square PDF", "Cover + 12 halaman", "PNG ZIP opsional"],
};

const pageSize = 720;
const pageMargin = 56;

function normalizePdfText(value: string) {
  return value
    .replace(/[“”]/g, '"')
    .replace(/[‘’]/g, "'")
    .replace(/[–—]/g, "-")
    .replace(/…/g, "...")
    .replace(/[^\x20-\x7E]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function pdfLiteralText(value: string) {
  return `(${normalizePdfText(value).replace(/\\/g, "\\\\").replace(/\(/g, "\\(").replace(/\)/g, "\\)")})`;
}

function wrapText(text: string, maxCharacters: number) {
  const words = normalizePdfText(text).split(" ").filter(Boolean);
  const lines: string[] = [];
  let currentLine = "";

  words.forEach((word) => {
    const nextLine = currentLine ? `${currentLine} ${word}` : word;

    if (nextLine.length > maxCharacters && currentLine) {
      lines.push(currentLine);
      currentLine = word;
    } else {
      currentLine = nextLine;
    }
  });

  if (currentLine) lines.push(currentLine);
  return lines;
}

function textBlock(lines: string[], x: number, y: number, size: number, lineHeight: number) {
  return lines.map((line, index) => `BT /F1 ${size} Tf ${x} ${y - index * lineHeight} Td ${pdfLiteralText(line)} Tj ET`).join("\n");
}

function createPdfPageContent(page: ExportPage, storyTitle: string) {
  const narrativeLines = wrapText(page.narrative, 48).slice(0, 5);

  return [
    "q 0.99 0.97 0.94 rg 0 0 720 720 re f Q",
    "q 1 1 1 rg 42 42 636 636 re f Q",
    "q 0.93 0.89 0.98 rg 72 250 576 380 re f Q",
    "q 0.98 0.83 0.78 rg 94 278 532 326 re f Q",
    "q 0.49 0.36 0.75 rg 132 350 456 120 re f Q",
    "q 1 1 1 rg 96 86 528 118 re f Q",
    textBlock([storyTitle], 72, 656, 10, 13),
    textBlock([String(page.pageNumber).padStart(2, "0")], 620, 656, 10, 13),
    textBlock(["Mock illustration"], 280, 406, 18, 24),
    textBlock(narrativeLines, 112, 164, 16, 23),
  ].join("\n");
}

function createCoverContent(story: ExportStory) {
  return [
    "q 0.99 0.97 0.94 rg 0 0 720 720 re f Q",
    "q 0.93 0.89 0.98 rg 44 44 632 632 re f Q",
    "q 0.49 0.36 0.75 rg 84 128 552 464 re f Q",
    "q 0.95 0.55 0.43 rg 124 168 472 384 re f Q",
    textBlock(["StoryMagic"], 88, 632, 16, 20),
    textBlock(wrapText(story.title, 24).slice(0, 3), 104, 528, 40, 48),
    textBlock(["Mock illustration cover"], 232, 288, 18, 24),
  ].join("\n");
}

function buildSimplePdf(story: ExportStory) {
  const pageContents = [createCoverContent(story), ...story.pages.map((page) => createPdfPageContent(page, story.title))];
  const objects: string[] = [];
  const pageObjectNumbers: number[] = [];

  objects.push("<< /Type /Catalog /Pages 2 0 R >>");
  objects.push("");
  objects.push("<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>");

  pageContents.forEach((content) => {
    const contentObjectNumber = objects.length + 1;
    objects.push(`<< /Length ${content.length} >>\nstream\n${content}\nendstream`);

    const pageObjectNumber = objects.length + 1;
    pageObjectNumbers.push(pageObjectNumber);
    objects.push(`<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${pageSize} ${pageSize}] /Resources << /Font << /F1 3 0 R >> >> /Contents ${contentObjectNumber} 0 R >>`);
  });

  objects[1] = `<< /Type /Pages /Kids [${pageObjectNumbers.map((objectNumber) => `${objectNumber} 0 R`).join(" ")}] /Count ${pageObjectNumbers.length} >>`;

  let pdf = "%PDF-1.4\n";
  const offsets = [0];

  objects.forEach((object, index) => {
    offsets.push(pdf.length);
    pdf += `${index + 1} 0 obj\n${object}\nendobj\n`;
  });

  const xrefOffset = pdf.length;
  pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
  offsets.slice(1).forEach((offset) => {
    pdf += `${String(offset).padStart(10, "0")} 00000 n \n`;
  });
  pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`;

  return new Blob([pdf], { type: "application/pdf" });
}

function drawWrappedText(context: CanvasRenderingContext2D, text: string, x: number, y: number, maxWidth: number, lineHeight: number, maxLines: number) {
  const words = normalizePdfText(text).split(" ").filter(Boolean);
  let line = "";
  let drawnLines = 0;

  for (const word of words) {
    const testLine = line ? `${line} ${word}` : word;

    if (context.measureText(testLine).width > maxWidth && line) {
      context.fillText(line, x, y + drawnLines * lineHeight);
      drawnLines += 1;
      line = word;
      if (drawnLines >= maxLines) return;
    } else {
      line = testLine;
    }
  }

  if (line && drawnLines < maxLines) {
    context.fillText(line, x, y + drawnLines * lineHeight);
  }
}

function drawStoryPageCanvas(context: CanvasRenderingContext2D, story: ExportStory, page?: ExportPage, includeText = true) {
  const gradient = context.createLinearGradient(0, 0, pageSize, pageSize);
  gradient.addColorStop(0, "#FDF8F0");
  gradient.addColorStop(0.5, "#FEF0EB");
  gradient.addColorStop(1, "#EDE6FA");
  context.fillStyle = gradient;
  context.fillRect(0, 0, pageSize, pageSize);

  context.fillStyle = "rgba(255,255,255,0.74)";
  context.beginPath();
  context.roundRect(pageMargin, pageMargin, pageSize - pageMargin * 2, pageSize - pageMargin * 2, 42);
  context.fill();

  const artGradient = context.createLinearGradient(92, 148, 628, 454);
  artGradient.addColorStop(0, "#C5A4E8");
  artGradient.addColorStop(0.55, "#F28B6E");
  artGradient.addColorStop(1, "#E8B84B");
  context.fillStyle = artGradient;
  context.beginPath();
  context.roundRect(92, 148, 536, 306, 34);
  context.fill();

  context.fillStyle = "rgba(255,255,255,0.25)";
  context.beginPath();
  context.arc(178, 222, 64, 0, Math.PI * 2);
  context.fill();
  context.beginPath();
  context.arc(570, 392, 82, 0, Math.PI * 2);
  context.fill();

  context.fillStyle = "rgba(255,255,255,0.42)";
  context.beginPath();
  context.arc(238, 284, 44, 0, Math.PI * 2);
  context.fill();
  context.beginPath();
  context.arc(364, 284, 68, 0, Math.PI * 2);
  context.fill();
  context.beginPath();
  context.arc(486, 284, 44, 0, Math.PI * 2);
  context.fill();

  if (!includeText) return;

  context.textAlign = "left";
  context.fillStyle = "#F28B6E";
  context.font = "700 18px Arial";
  context.fillText(page ? `HALAMAN ${page.pageNumber}` : "STORYMAGIC", 92, 112);

  context.fillStyle = "#3A2D52";
  context.font = page ? "700 34px Georgia" : "700 44px Georgia";
  drawWrappedText(context, page?.title || story.title, 92, 500, 536, page ? 40 : 52, page ? 2 : 3);

  context.fillStyle = "#6B5B8A";
  context.font = "600 22px Arial";
  drawWrappedText(context, page?.narrative || "Square digital storybook with mock illustration placeholders.", 92, page ? 586 : 610, 536, 30, page ? 3 : 2);
}

function canvasToPngBlob(canvas: HTMLCanvasElement) {
  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) resolve(blob);
      else reject(new Error("Canvas PNG export failed."));
    }, "image/png");
  });
}

async function createPngFiles(story: ExportStory) {
  const canvas = document.createElement("canvas");
  canvas.width = pageSize;
  canvas.height = pageSize;
  const context = canvas.getContext("2d");

  if (!context) throw new Error("Canvas is not available.");

  drawStoryPageCanvas(context, story, undefined, true);
  const files = [{ name: "cover.png", data: await canvasToPngBlob(canvas) }];

  for (const page of story.pages) {
    context.clearRect(0, 0, pageSize, pageSize);
    drawStoryPageCanvas(context, story, page, false);
    files.push({ name: `page-${String(page.pageNumber).padStart(2, "0")}.png`, data: await canvasToPngBlob(canvas) });
  }

  return files;
}

function makeCrcTable() {
  return Array.from({ length: 256 }, (_, index) => {
    let value = index;
    for (let bit = 0; bit < 8; bit += 1) {
      value = value & 1 ? 0xedb88320 ^ (value >>> 1) : value >>> 1;
    }
    return value >>> 0;
  });
}

const crcTable = makeCrcTable();

function crc32(bytes: Uint8Array) {
  let crc = 0xffffffff;
  bytes.forEach((byte) => {
    crc = crcTable[(crc ^ byte) & 0xff] ^ (crc >>> 8);
  });
  return (crc ^ 0xffffffff) >>> 0;
}

function writeUint16(bytes: number[], value: number) {
  bytes.push(value & 0xff, (value >>> 8) & 0xff);
}

function writeUint32(bytes: number[], value: number) {
  bytes.push(value & 0xff, (value >>> 8) & 0xff, (value >>> 16) & 0xff, (value >>> 24) & 0xff);
}

function appendBytes(target: number[], bytes: Uint8Array) {
  for (let index = 0; index < bytes.length; index += 1) {
    target.push(bytes[index]);
  }
}

async function buildZip(files: Array<{ name: string; data: Blob }>) {
  const encoder = new TextEncoder();
  const output: number[] = [];
  const centralDirectory: number[] = [];

  for (const file of files) {
    const nameBytes = encoder.encode(file.name);
    const dataBytes = new Uint8Array(await file.data.arrayBuffer());
    const checksum = crc32(dataBytes);
    const localHeaderOffset = output.length;

    writeUint32(output, 0x04034b50);
    writeUint16(output, 20);
    writeUint16(output, 0);
    writeUint16(output, 0);
    writeUint16(output, 0);
    writeUint16(output, 0);
    writeUint32(output, checksum);
    writeUint32(output, dataBytes.length);
    writeUint32(output, dataBytes.length);
    writeUint16(output, nameBytes.length);
    writeUint16(output, 0);
    appendBytes(output, nameBytes);
    appendBytes(output, dataBytes);

    writeUint32(centralDirectory, 0x02014b50);
    writeUint16(centralDirectory, 20);
    writeUint16(centralDirectory, 20);
    writeUint16(centralDirectory, 0);
    writeUint16(centralDirectory, 0);
    writeUint16(centralDirectory, 0);
    writeUint16(centralDirectory, 0);
    writeUint32(centralDirectory, checksum);
    writeUint32(centralDirectory, dataBytes.length);
    writeUint32(centralDirectory, dataBytes.length);
    writeUint16(centralDirectory, nameBytes.length);
    writeUint16(centralDirectory, 0);
    writeUint16(centralDirectory, 0);
    writeUint16(centralDirectory, 0);
    writeUint16(centralDirectory, 0);
    writeUint32(centralDirectory, 0);
    writeUint32(centralDirectory, localHeaderOffset);
    appendBytes(centralDirectory, nameBytes);
  }

  const centralDirectoryOffset = output.length;
  output.push(...centralDirectory);
  writeUint32(output, 0x06054b50);
  writeUint16(output, 0);
  writeUint16(output, 0);
  writeUint16(output, files.length);
  writeUint16(output, files.length);
  writeUint32(output, centralDirectory.length);
  writeUint32(output, centralDirectoryOffset);
  writeUint16(output, 0);

  return new Blob([new Uint8Array(output)], { type: "application/zip" });
}

function createFallbackStory(): ExportStory {
  const pages = Array.from({ length: 12 }, (_, index) => {
    const mockPage = storyPages[index % storyPages.length];

    return {
      pageNumber: index + 1,
      title: index < storyPages.length ? mockPage.title : `Halaman ${index + 1}`,
      narrative: mockPage.text,
      sceneDescription: `Mock illustration placeholder based on ${mockPage.title}. Warm storybook scene, cozy palette, gentle composition.`,
    };
  });

  return {
    title: "Kiko dan Bintang Ajaib",
    pages,
  };
}

function mapGeneratedStory(story: GeneratedStorybook): ExportStory {
  return {
    title: story.title,
    pages: story.pages.map((page) => ({
      pageNumber: page.pageNumber,
      title: `Halaman ${page.pageNumber}`,
      narrative: page.narrative,
      sceneDescription: page.sceneDescription,
    })),
  };
}

function getStoredExportStory() {
  const savedStory = localStorage.getItem(generatedStoryStorageKey);

  if (!savedStory) return createFallbackStory();

  try {
    const parsedStory = JSON.parse(savedStory);
    if (isGeneratedStorybook(parsedStory)) return mapGeneratedStory(parsedStory);
  } catch {
    return createFallbackStory();
  }

  return createFallbackStory();
}

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function fileSafeName(value: string) {
  return normalizePdfText(value).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "storybook";
}

export function ExportPanel() {
  const [status, setStatus] = useState<"idle" | "downloading-pdf" | "downloading-png" | "success" | "error">("idle");
  const [story, setStory] = useState<ExportStory>(() => createFallbackStory());
  const [lastExport, setLastExport] = useState<"PDF" | "PNG ZIP">("PDF");

  useEffect(() => {
    const storageTimer = window.setTimeout(() => setStory(getStoredExportStory()), 0);
    return () => window.clearTimeout(storageTimer);
  }, []);

  const pageCount = useMemo(() => story.pages.length, [story.pages.length]);

  function handleDownload() {
    setStatus("downloading-pdf");

    window.setTimeout(() => {
      try {
        const pdf = buildSimplePdf(story);
        downloadBlob(pdf, `${fileSafeName(story.title)}.pdf`);
        setLastExport("PDF");
        setStatus("success");
      } catch (error) {
        console.error("Failed to generate PDF", error);
        setStatus("error");
      }
    }, 350);
  }

  async function handlePngZipDownload() {
    setStatus("downloading-png");

    try {
      const pngFiles = await createPngFiles(story);
      const zip = await buildZip(pngFiles);
      downloadBlob(zip, `${fileSafeName(story.title)}-pages.zip`);
      setLastExport("PNG ZIP");
      setStatus("success");
    } catch (error) {
      console.error("Failed to generate PNG ZIP", error);
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <section className="mx-auto max-w-2xl rounded-[2rem] bg-white p-8 text-center shadow-xl shadow-[#7C5CBF]/10 sm:p-10">
        <div className="mx-auto mb-8 grid h-28 w-28 place-items-center rounded-full bg-gradient-to-br from-[#7EC8A0] to-[#4CA87A] text-5xl shadow-[0_0_0_16px_rgba(232,247,239,1)]">PDF</div>
        <h1 className="font-serif text-3xl font-black text-[#3A2D52]">Unduhan Berhasil!</h1>
        <p className="mx-auto mt-4 max-w-md leading-8 text-[#6B5B8A]">{lastExport} untuk <strong>{story.title}</strong> telah dibuat dari data storybook saat ini.</p>
        <button type="button" onClick={() => setStatus("idle")} className="mt-8 rounded-full bg-gradient-to-r from-[#7C5CBF] to-[#A07FD6] px-7 py-3 text-sm font-black text-white shadow-lg shadow-[#7C5CBF]/25">
          Ekspor Lagi
        </button>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-4xl">
      <div className="grid gap-5">
        <button type="button" className="rounded-[2rem] border-2 border-[#7C5CBF] bg-white p-6 text-left shadow-xl shadow-[#7C5CBF]/10 transition hover:-translate-y-1">
          <div className="mb-4 flex items-start justify-between gap-4">
            <span className="grid h-14 w-14 place-items-center rounded-2xl bg-[#EDE6FA] text-sm font-black text-[#7C5CBF]">{digitalExportOption.icon}</span>
            <span className="rounded-full bg-[#EDE6FA] px-3 py-1 text-xs font-black text-[#7C5CBF]">{digitalExportOption.size}</span>
          </div>
          <h2 className="font-serif text-2xl font-black text-[#3A2D52]">{digitalExportOption.title}</h2>
          <p className="mt-3 text-sm leading-7 text-[#6B5B8A]">{digitalExportOption.description}</p>
          <p className="mt-4 text-sm font-black text-[#3A2D52]">{story.title}</p>
          <ul className="mt-5 space-y-2 text-sm font-bold text-[#6B5B8A]">
            {digitalExportOption.features.map((feature) => (
              <li key={feature}>✓ {feature}</li>
            ))}
            <li>{pageCount} square story pages + cover</li>
          </ul>
        </button>
      </div>

      <div className="mt-8 rounded-[2rem] bg-white p-6 shadow-xl shadow-[#7C5CBF]/10">
        <div className="grid gap-3 sm:grid-cols-2">
          <button
            type="button"
            onClick={handleDownload}
            disabled={status === "downloading-pdf" || status === "downloading-png"}
            className="rounded-full bg-gradient-to-r from-[#7C5CBF] to-[#A07FD6] px-7 py-4 text-base font-black text-white shadow-lg shadow-[#7C5CBF]/25 transition disabled:cursor-wait disabled:opacity-70"
          >
            {status === "downloading-pdf" ? "Menyiapkan square PDF..." : "Unduh Square PDF"}
          </button>
          <button
            type="button"
            onClick={handlePngZipDownload}
            disabled={status === "downloading-pdf" || status === "downloading-png"}
            className="rounded-full border-2 border-[#F5EDD8] bg-white/80 px-7 py-4 text-base font-black text-[#6B5B8A] transition hover:border-[#FBD4C8] hover:text-[#5A3F9A] disabled:cursor-wait disabled:opacity-70"
          >
            {status === "downloading-png" ? "Menyiapkan PNG ZIP..." : "Unduh PNG ZIP"}
          </button>
        </div>
        {status === "downloading-pdf" || status === "downloading-png" ? (
          <div className="mt-5">
            <div className="h-2 overflow-hidden rounded-full bg-[#F5EDD8]">
              <div className="h-full animate-[downloadProgress_1.8s_ease_forwards] rounded-full bg-gradient-to-r from-[#7C5CBF] to-[#A07FD6]" />
            </div>
            <p className="mt-3 text-center text-sm font-semibold text-[#A096B5]">
              {status === "downloading-png" ? "Membuat cover dan semua halaman sebagai PNG..." : "Menyusun square storybook PDF digital..."}
            </p>
          </div>
        ) : null}
        {status === "error" ? <p className="mt-3 text-center text-sm font-black text-[#D4614A]">PDF belum berhasil dibuat. Coba lagi sebentar.</p> : null}
      </div>
    </section>
  );
}
