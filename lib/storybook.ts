export type StorybookFormInput = {
  tema: string;
  karakter: string;
  visual: string;
  mood: string;
  pesan: string;
  usia: string;
};

export type GeneratedStoryPage = {
  pageNumber: number;
  narrative: string;
  sceneDescription: string;
};

export type GeneratedStorybook = {
  title: string;
  characterBible: {
    name: string;
    description: string;
    appearance: string;
    personality: string;
  };
  pages: GeneratedStoryPage[];
};

export type GeneratedPageImage = {
  pageNumber: number;
  prompt: string;
  dataUrl: string;
  model: string;
  createdAt: string;
};

export const draftStorageKey = "storybook-draft";
export const generatedStoryStorageKey = "storybook-generated";
export const generatedPageImageStorageKey = "storybook-generated-page-image";

export function isGeneratedStorybook(value: unknown): value is GeneratedStorybook {
  if (!value || typeof value !== "object") return false;

  const story = value as GeneratedStorybook;
  const bible = story.characterBible;

  return (
    typeof story.title === "string" &&
    story.title.trim().length > 0 &&
    !!bible &&
    typeof bible.name === "string" &&
    typeof bible.description === "string" &&
    typeof bible.appearance === "string" &&
    typeof bible.personality === "string" &&
    Array.isArray(story.pages) &&
    story.pages.length === 12 &&
    story.pages.every(
      (page, index) =>
        page &&
        page.pageNumber === index + 1 &&
        typeof page.narrative === "string" &&
        page.narrative.trim().length > 0 &&
        typeof page.sceneDescription === "string" &&
        page.sceneDescription.trim().length > 0,
    )
  );
}

export function isGeneratedPageImage(value: unknown): value is GeneratedPageImage {
  if (!value || typeof value !== "object") return false;

  const image = value as GeneratedPageImage;

  return (
    Number.isInteger(image.pageNumber) &&
    image.pageNumber > 0 &&
    typeof image.prompt === "string" &&
    image.prompt.trim().length > 0 &&
    typeof image.dataUrl === "string" &&
    image.dataUrl.startsWith("data:image/") &&
    typeof image.model === "string" &&
    image.model.trim().length > 0 &&
    typeof image.createdAt === "string" &&
    image.createdAt.trim().length > 0
  );
}
