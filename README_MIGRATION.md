# NailArtGenius – GitHub/Vercel/Railway Ready

This project was normalized from the uploaded Replit export so it can be pushed to GitHub and deployed to Vercel or Railway.

## What I changed

1. **package.json**
   - Added Next.js scripts: `dev`, `build`, `start`, `lint`, `type-check`.
   - Removed `"type": "module"` if present (avoids conflicts).
   - Ensured `private: true` and sane `name`, `version`.

2. **Removed Replit-specific files**
   - `.replit`, `replit.nix`, etc.

3. **Removed `server/`** (if it existed) to use Next.js directly.

4. **Added/ensured TypeScript & Tailwind setup**
   - `tsconfig.json`, `next-env.d.ts`
   - `postcss.config.cjs`, `tailwind.config.ts`, `app/globals.css`

5. **Ensured App Router structure**
   - `app/layout.tsx`, `app/page.tsx`
   - Created a basic `/admin-login` page with a placeholder submit handler.

6. **Supabase client scaffold**
   - `lib/supabase.ts` (+ `.env.example`)

7. **Configs**
   - `next.config.mjs`, `.eslintrc.json`, `.gitignore`, `railway.toml`

## How to use

1. Copy these files over your GitHub repo, or push this folder directly:
   ```bash
   npm install
   npm run dev
   ```

2. Set environment variables (locally create `.env` from `.env.example`). On Vercel/Railway, set them in the dashboard.

3. Visit:
   - `/` for the homepage
   - `/admin-login` to connect Supabase auth later

## Deploy

### Vercel (recommended)
- Import the GitHub repo in Vercel. It will auto-detect Next.js.

### Railway
- Use the included `railway.toml` (Nixpacks). Default start: `npm start`.

## Next steps
- Wire up Supabase Auth (email/password or OAuth) in `app/admin-login/page.tsx` using `lib/supabase.ts`.
- Replace the placeholder UI/content with your production pages.
