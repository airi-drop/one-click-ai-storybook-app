export const runtime = "nodejs";

const imagenModel = "imagen-4.0-fast-generate-001";
const imagenEndpoint = `https://generativelanguage.googleapis.com/v1beta/models/${imagenModel}:predict`;
const logPrefix = "[storybooks/images/test]";

function textValue(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function safePreview(value: string, maxLength = 1200) {
  if (value.length <= maxLength) return value;
  return `${value.slice(0, maxLength)}... [truncated ${value.length - maxLength} chars]`;
}

function buildImagenRequest(prompt: string) {
  return {
    instances: [
      {
        prompt: buildImagePrompt(prompt),
      },
    ],
    parameters: {
      sampleCount: 1,
    },
  };
}

function imagenLogContext(pageNumber: number, prompt: string) {
  return {
    model: imagenModel,
    endpoint: imagenEndpoint,
    pageNumber,
    promptLength: prompt.length,
    promptPreview: safePreview(prompt, 320),
    requestShape: "instances[0].prompt + parameters.sampleCount",
  };
}

async function readImagenError(response: Response) {
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

function buildImagePrompt(scenePrompt: string) {
  return `
Create one finished children's storybook illustration for the page below.

Rules:
- Use a warm, safe, preschool-friendly storybook style.
- Do not include readable text, captions, logos, or watermarks in the image.
- Keep the composition uncluttered and suitable for a single storybook page.
- Return exactly one image.

Page image prompt:
${scenePrompt}
`;
}

function extractImagenImage(payload: unknown) {
  const response = payload as {
    predictions?: Array<{
      bytesBase64Encoded?: string;
      mimeType?: string;
      image?: {
        imageBytes?: string;
        mimeType?: string;
      };
    }>;
    generatedImages?: Array<{
      image?: {
        imageBytes?: string;
        mimeType?: string;
      };
    }>;
  };

  const prediction = response.predictions?.[0];
  const generatedImage = response.generatedImages?.[0]?.image;
  const data = prediction?.bytesBase64Encoded ?? prediction?.image?.imageBytes ?? generatedImage?.imageBytes;
  const mimeType = prediction?.mimeType ?? prediction?.image?.mimeType ?? generatedImage?.mimeType ?? "image/png";

  if (!data) return null;

  return { data, mimeType };
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

  const data = body as { prompt?: unknown; pageNumber?: unknown };
  const prompt = textValue(data.prompt);
  const pageNumber = Number(data.pageNumber);

  if (!prompt) {
    return Response.json({ error: "Please provide an image prompt for the selected page." }, { status: 400 });
  }

  if (!Number.isInteger(pageNumber) || pageNumber < 1) {
    return Response.json({ error: "Please provide a valid selected page number." }, { status: 400 });
  }

  let imagenResponse: Response;
  const imagenRequest = buildImagenRequest(prompt);
  const logContext = imagenLogContext(pageNumber, prompt);

  try {
    imagenResponse = await fetch(imagenEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": apiKey,
      },
      body: JSON.stringify(imagenRequest),
    });
  } catch (error) {
    console.error(`${logPrefix} Network error while calling Imagen 4 Fast`, {
      ...logContext,
      error,
    });

    return Response.json(
      {
        error: "Could not reach Imagen 4 Fast image generation. Check your network connection and GEMINI_API_KEY access.",
      },
      { status: 502 },
    );
  }

  if (!imagenResponse.ok) {
    const imagenError = await readImagenError(imagenResponse);

    console.error(`${logPrefix} Imagen 4 Fast API returned an error`, {
      ...logContext,
      httpStatus: imagenResponse.status,
      httpStatusText: imagenResponse.statusText,
      imagenStatus: imagenError.status,
      imagenCode: imagenError.code,
      imagenMessage: imagenError.message,
      imagenDetails: imagenError.details,
      rawBody: safePreview(imagenError.rawBody),
    });

    return Response.json(
      {
        error: `Imagen 4 Fast image generation failed: ${imagenError.message}`,
        model: imagenModel,
        status: imagenResponse.status,
      },
      { status: 502 },
    );
  }

  let imagenPayload: unknown;

  try {
    imagenPayload = await imagenResponse.json();
  } catch (error) {
    console.error(`${logPrefix} Imagen 4 Fast returned a non-JSON image response`, {
      ...logContext,
      error,
    });

    return Response.json({ error: "Imagen 4 Fast returned a response that could not be parsed." }, { status: 502 });
  }

  const imagePart = extractImagenImage(imagenPayload);

  if (!imagePart) {
    console.error(`${logPrefix} Imagen 4 Fast response did not include image data`, {
      ...logContext,
      payload: imagenPayload,
    });

    return Response.json(
      {
        error: "Imagen 4 Fast returned no image data. The request may have been blocked, quota may be exhausted, or the model may not be enabled for this API key.",
        model: imagenModel,
      },
      { status: 502 },
    );
  }

  return Response.json({
    image: {
      pageNumber,
      prompt,
      dataUrl: `data:${imagePart.mimeType};base64,${imagePart.data}`,
      model: imagenModel,
      createdAt: new Date().toISOString(),
    },
  });
}
