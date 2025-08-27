# AI Story Writer — Full Starter (Frontend + API)

This is a complete, runnable Next.js project for the AI Story Writer:
- Playful kid-friendly UI (light/dark theme, confetti, cover preview)
- Typed contracts (zod)
- Real AI story generation using OpenAI (JSON output)
- Basic input/output moderation
- Ready to extend with illustrations, TTS, and PDF export

## Requirements
- Node.js 20 LTS (recommended)
- An OpenAI API key

## Setup
1. Install dependencies
   ```bash
   npm install
   ```

2. Create `.env.local` in the project root:
   ```env
   OPENAI_API_KEY=sk-xxxxxxxxxxxxxxxxxxxxxxxx
   ```

3. Start the dev server
   ```bash
   npm run dev
   ```
   Open http://localhost:3000 and go to `/create`

## Notes
- PostCSS config uses `.cjs` because the project is ESM (`type: module`).
- If you see style issues, restart the dev server after first install.
- This starter does NOT include database/auth yet. Next steps:
  - Add Supabase for auth + story storage
  - Add PDF export route (Puppeteer)
  - Add illustration generation + TTS workers

## Scripts
- `npm run dev` — start local dev
- `npm run build` — production build
- `npm start` — run production server

Happy building! ✨
