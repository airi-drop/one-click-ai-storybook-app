import { isGeneratedStorybook, type StorybookFormInput } from "@/lib/storybook";

export const runtime = "nodejs";

const geminiModel = "gemini-2.5-flash";
const geminiEndpoint = `https://generativelanguage.googleapis.com/v1beta/models/${geminiModel}:generateContent`;
const logPrefix = "[storybooks/generate]";

const storybookSchema = {
  type: "object",
  properties: {
    title: {
      type: "string",
      description: "A warm, memorable Indonesian children's storybook title.",
    },
    characterBible: {
      type: "object",
      properties: {
        name: { type: "string", description: "Main character name." },
        description: { type: "string", description: "Short story-useful character description." },
        appearance: { type: "string", description: "Consistent visual appearance for future illustration prompts." },
        personality: { type: "string", description: "Gentle preschool-friendly personality traits." },
      },
      required: ["name", "description", "appearance", "personality"],
    },
    pages: {
      type: "array",
      minItems: 12,
      maxItems: 12,
      description: "Exactly 12 paced storybook pages.",
      items: {
        type: "object",
        properties: {
          pageNumber: { type: "integer", minimum: 1, maximum: 12 },
          narrative: {
            type: "string",
            description: "Short bedtime-story narration for this page, in Indonesian, preschool friendly.",
          },
          sceneDescription: {
            type: "string",
            description: "Image-generation-ready prompt with character bible details, outfit/colors, setting, action, emotion, composition, style tokens, and negative prompt.",
          },
        },
        required: ["pageNumber", "narrative", "sceneDescription"],
      },
    },
  },
  required: ["title", "characterBible", "pages"],
};

function textValue(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function parseInput(value: unknown): StorybookFormInput | null {
  if (!value || typeof value !== "object") return null;

  const data = value as Partial<StorybookFormInput>;
  const input = {
    tema: textValue(data.tema),
    karakter: textValue(data.karakter),
    visual: textValue(data.visual),
    mood: textValue(data.mood),
    pesan: textValue(data.pesan),
    usia: textValue(data.usia),
  };

  if (!input.tema && !input.karakter) return null;
  return input;
}

function buildPrompt(input: StorybookFormInput) {
  return `
You are StoryMagic, a senior Indonesian children's storybook author and visual development art director.
Your specialty is preschool bedtime books with gentle emotional arcs, memorable tiny details, and image-generation-ready page prompts.

Create one complete children's storybook from the user's form input. The final response must be valid JSON only.

Core story rules:
- Write in Bahasa Indonesia.
- Generate exactly 12 pages, no more and no fewer.
- Page numbers must be 1 through 12 in order.
- Each page is one clear moment only. Do not cram multiple events into one page.
- Use a bedtime-story rhythm: calm opening, gentle curiosity, small emotional problem, kind connection, cozy resolution.
- Make the story specific and memorable with concrete sensory details, recurring objects, and small rituals.
- Avoid generic phrases like "petualangan yang seru", "dunia ajaib", or "belajar hal penting" unless made concrete.
- The story must feel warm, emotional, cozy, tender, and hopeful.
- Use preschool-friendly language: short sentences, familiar feelings, soft repetition, and easy read-aloud cadence.
- Avoid scary, violent, dangerous, cruel, sarcastic, or intense conflict.
- Conflict should be tiny and safe: shyness, missing comfort object, uncertainty, waiting, sharing, saying sorry, or asking for help.
- Include the moral naturally through character choices and feelings. Do not state it like a lesson or lecture.
- Give the main character a stronger personality with one charming habit, one gentle flaw, and one emotional wish.
- Keep the main character visually consistent on every page using the Character Bible.
- Do not include image URLs, markdown, or commentary.

Character Bible rules:
- characterBible.name must be specific and child-friendly.
- characterBible.description must identify the character role and emotional wish.
- characterBible.appearance must include species/person type if relevant, body size, colors, face/eyes, and one memorable visual marker.
- characterBible.personality must include 3-5 specific traits, including a charming habit and a gentle flaw.
- Treat characterBible as the source of truth for every page's sceneDescription.

Page pacing guide:
- Page 1: cozy introduction and character habit.
- Page 2: specific wish or question.
- Page 3: first gentle step into the setting.
- Page 4: discover a concrete memorable object/place.
- Page 5: meet or notice another feeling/need.
- Page 6: careful approach or listening moment.
- Page 7: tiny problem becomes clear.
- Page 8: character decides on a kind action.
- Page 9: warm exchange or attempt.
- Page 10: shared relief or small surprise.
- Page 11: quiet togetherness and emotional settling.
- Page 12: cozy ending that shows the moral naturally.

Narrative rules:
- Each page narrative should be 1-3 short sentences.
- Use concrete nouns, sensory details, and gentle action verbs.
- Avoid explaining the moral directly.
- Avoid naming emotions only; show them with simple actions, faces, or body language.

Image prompt rules for sceneDescription:
- Each sceneDescription will later be used for image generation, so write it like a polished illustration prompt.
- Start every sceneDescription with a compact "Character consistency:" phrase that repeats the characterBible visual facts.
- Include consistent outfit/colors/accessory from the Character Bible on every page.
- Include clear setting, clear action, emotion/expression, environment details, lighting, and visual composition.
- Include style tokens matching the requested visual style, e.g. "soft watercolor children's book illustration, cozy bedtime palette, rounded shapes, gentle texture".
- Include a negative prompt at the end in this exact format: "Negative prompt: scary, dark horror, violence, sharp teeth, angry expression, realistic photo, text, watermark, cluttered background."
- Keep image prompts warm, safe, uncluttered, and preschool appropriate.
- Do not ask to generate images yet.

User form input:
- Tema Cerita: ${input.tema || "Petualangan hangat sebelum tidur"}
- Karakter Utama: ${input.karakter || "Tokoh kecil yang lembut dan penasaran"}
- Style Visual: ${input.visual || "storybook watercolor"}
- Mood Cerita: ${input.mood || "Ajaib dan hangat"}
- Pesan Moral: ${input.pesan || "Kebaikan kecil dapat membuat hati menjadi berani"}
- Target Usia: ${input.usia || "3-5 tahun"}

Return only JSON matching the provided schema.
`;
}

function extractGeminiText(payload: unknown) {
  const response = payload as {
    candidates?: Array<{ content?: { parts?: Array<{ text?: string }> }; finishReason?: string }>;
  };

  return response.candidates?.[0]?.content?.parts?.map((part) => part.text ?? "").join("").trim() ?? "";
}

function getGeminiFinishReason(payload: unknown) {
  const response = payload as { candidates?: Array<{ finishReason?: string }> };
  return response.candidates?.[0]?.finishReason;
}

function stripMarkdownJsonFence(value: string) {
  return value
    .trim()
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();
}

function extractJsonObjectText(value: string) {
  const unfenced = stripMarkdownJsonFence(value);

  if (unfenced.startsWith("{") && unfenced.endsWith("}")) {
    return unfenced;
  }

  const firstBrace = unfenced.indexOf("{");
  const lastBrace = unfenced.lastIndexOf("}");

  if (firstBrace === -1 || lastBrace === -1 || lastBrace <= firstBrace) {
    return unfenced;
  }

  return unfenced.slice(firstBrace, lastBrace + 1);
}

function safePreview(value: string, maxLength = 1800) {
  if (value.length <= maxLength) return value;
  return `${value.slice(0, maxLength)}... [truncated ${value.length - maxLength} chars]`;
}

async function readGeminiError(response: Response) {
  const rawBody = await response.text();

  try {
    const parsed = JSON.parse(rawBody) as {
      error?: { message?: string; status?: string; code?: number; details?: unknown };
    };

    return {
      rawBody,
      message: parsed.error?.message ?? rawBody,
      status: parsed.error?.status,
      code: parsed.error?.code,
      details: parsed.error?.details,
    };
  } catch {
    return {
      rawBody,
      message: rawBody || response.statusText,
      status: undefined,
      code: undefined,
      details: undefined,
    };
  }
}

export async function POST(request: Request) {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return Response.json({ error: "GEMINI_API_KEY is not configured." }, { status: 500 });
  }

  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON request body." }, { status: 400 });
  }

  const input = parseInput(body);

  if (!input) {
    return Response.json({ error: "Please provide at least Tema Cerita or Karakter Utama." }, { status: 400 });
  }

  let geminiResponse: Response;

  try {
    geminiResponse = await fetch(geminiEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": apiKey,
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: buildPrompt(input) }],
          },
        ],
        generationConfig: {
          temperature: 0.85,
          topP: 0.9,
          maxOutputTokens: 12000,
          responseMimeType: "application/json",
          responseSchema: storybookSchema,
        },
      }),
    });
  } catch (error) {
    console.error(`${logPrefix} Network error while calling Gemini`, {
      model: geminiModel,
      endpoint: geminiEndpoint,
      error,
    });

    return Response.json(
      {
        error: "Could not reach Gemini API. Check your network connection and GEMINI_API_KEY access.",
      },
      { status: 502 },
    );
  }

  if (!geminiResponse.ok) {
    const geminiError = await readGeminiError(geminiResponse);

    console.error(`${logPrefix} Gemini API returned an error`, {
      model: geminiModel,
      endpoint: geminiEndpoint,
      httpStatus: geminiResponse.status,
      httpStatusText: geminiResponse.statusText,
      geminiStatus: geminiError.status,
      geminiCode: geminiError.code,
      geminiMessage: geminiError.message,
      geminiDetails: geminiError.details,
      rawBody: safePreview(geminiError.rawBody),
    });

    return Response.json(
      {
        error: `Gemini API error: ${geminiError.message}`,
        model: geminiModel,
        status: geminiResponse.status,
      },
      { status: 502 },
    );
  }

  let geminiPayload: unknown;

  try {
    geminiPayload = await geminiResponse.json();
  } catch (error) {
    console.error(`${logPrefix} Gemini returned a non-JSON HTTP response`, {
      model: geminiModel,
      endpoint: geminiEndpoint,
      error,
    });

    return Response.json({ error: "Gemini returned a response that could not be parsed." }, { status: 502 });
  }

  const storyText = extractGeminiText(geminiPayload);
  const finishReason = getGeminiFinishReason(geminiPayload);

  if (!storyText) {
    console.error(`${logPrefix} Gemini response did not include text content`, {
      model: geminiModel,
      endpoint: geminiEndpoint,
      finishReason,
      payload: geminiPayload,
    });

    return Response.json(
      {
        error: finishReason ? `Gemini returned no story text. Finish reason: ${finishReason}.` : "Gemini returned no story text.",
      },
      { status: 502 },
    );
  }

  try {
    const storybook = JSON.parse(extractJsonObjectText(storyText));

    if (!isGeneratedStorybook(storybook)) {
      console.error(`${logPrefix} Gemini returned an invalid storybook shape`, {
        model: geminiModel,
        endpoint: geminiEndpoint,
        finishReason,
        storyText: safePreview(storyText),
        parsedStorybook: storybook,
      });

      return Response.json(
        {
          error: "Gemini returned a story, but it did not match the required 12-page storybook format.",
        },
        { status: 502 },
      );
    }

    return Response.json({ storybook });
  } catch (error) {
    console.error(`${logPrefix} Gemini returned invalid JSON story text`, {
      model: geminiModel,
      endpoint: geminiEndpoint,
      finishReason,
      parseError: error,
      storyText: safePreview(storyText),
    });

    return Response.json(
      {
        error: "Gemini returned text that could not be parsed as storybook JSON.",
      },
      { status: 502 },
    );
  }
}
