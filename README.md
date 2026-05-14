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

## External Image Tool mode

The preview page at `/preview/demo` includes an **Image Studio** for every story page. Each studio shows the generated image prompt and supports a cost-free external workflow:

- Copy Prompt
- Open Google Flow
- Upload Image
- Approve Image

The app does not call a backend image-generation API. Uploaded images are stored locally in browser `localStorage` under `storybook-uploaded-page-images` for now. Mock illustrations remain as the fallback until a page image is uploaded and approved. PDF and PNG exports use approved uploaded images when available.

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
