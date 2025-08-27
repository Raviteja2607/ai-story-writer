# Deploying AI Story Writer (Vercel)

## 1) Commit your code
```bash
git init
git add .
git commit -m "deploy: initial"
git branch -M main
git remote add origin https://github.com/<you>/ai-story-writer.git
git push -u origin main
```

## 2) Add these files (merge this pack into your repo root)
- `vercel.json`
- `src/middleware.ts`
- `src/app/health/route.ts`
- `public/robots.txt`

## 3) Vercel
- Import the GitHub repo on vercel.com
- Project Settings → Environment Variables:
  - `OPENAI_API_KEY` = your key (add to Production & Preview)
- Deploy

## 4) Verify
- Open `/create` and generate a story
- `/health` should return `{ ok: true }`
- Rate limit on `/api/*`: 20 req/min/IP (adjust in `src/middleware.ts`)

## Notes
- The in-memory limiter is best-effort on serverless; for production scale, use Redis (Upstash) or Vercel KV.
- Keep your API key server-side only.
