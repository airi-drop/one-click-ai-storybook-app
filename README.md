This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

Create a local environment file:

```bash
cp .env.example .env.local
```

Then add your Gemini API key:

```bash
GEMINI_API_KEY=your_gemini_api_key_here
```

The key is used only by server-side routes and is never exposed to the browser.

## Imagen image generation MVP

The preview page at `/preview/demo` includes a **Generate Test Image** button. It sends only the currently selected page prompt to `/api/storybooks/images/test`, generates one image, and stores that image temporarily in `localStorage` under `storybook-generated-page-image`.

This MVP uses the Gemini API REST Imagen `predict` endpoint directly instead of adding a Gemini SDK dependency:

- model: `imagen-4.0-fast-generate-001`
- endpoint: `https://generativelanguage.googleapis.com/v1beta/models/imagen-4.0-fast-generate-001:predict`
- output: one base64 image converted to a browser `data:image/...` URL

If Imagen 4 Fast is not enabled for your API key, quota is exhausted, or the prompt is blocked, the UI keeps the mock illustration fallback and shows the Imagen error. The image route is separate from `/api/storybooks/generate`, so story text generation still uses the existing Gemini story model.

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
