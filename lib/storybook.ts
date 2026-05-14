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

export const draftStorageKey = "storybook-draft";
export const generatedStoryStorageKey = "storybook-generated";

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
