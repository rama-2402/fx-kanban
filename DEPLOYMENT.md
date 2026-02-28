# Deploying FX Design Tracker to Vercel

## 1. Initialize Git and first commit

From the project root (`fx-kanban/`):

```bash
cd "/Users/v.ramasubramanian.ramakrishnan/Documents/projects/BA Dashboard Docs/G3/fx-kanban"
git init
git add .
git commit -m "Initial commit: FX Design Tracker"
```

## 2. Push to a new GitHub repository

1. On GitHub: **New repository** (github.com/new).
2. Name it (e.g. `fx-kanban`), leave it empty (no README), create.
3. In your project folder, add the remote and push:

```bash
git remote add origin https://github.com/YOUR_USERNAME/fx-kanban.git
git branch -M main
git push -u origin main
```

Replace `YOUR_USERNAME` with your GitHub username (or org).

## 3. Connect to Vercel

1. Go to [vercel.com](https://vercel.com) and sign in (GitHub).
2. **Add New…** → **Project**.
3. **Import** the `fx-kanban` (or your repo name) repository.
4. Leave **Framework Preset** as Vite and **Build Command** / **Output Directory** as default.
5. Do **not** deploy yet; add env vars first (step 4).

## 4. Environment variables

1. In the Vercel project: **Settings** → **Environment Variables**.
2. Add:
   - **Name:** `VITE_SUPABASE_URL`  
     **Value:** your Supabase project URL (from Supabase Dashboard → Settings → API).
   - **Name:** `VITE_SUPABASE_ANON_KEY`  
     **Value:** your Supabase anon/public key (same place).
3. Select **Production**, **Preview**, and **Development** for both.
4. Save.

## 5. First deployment

1. **Deployments** tab → **Redeploy** the latest (or run the first deploy from the import flow).
2. Wait for the build to finish; open the generated URL.

## 6. Inviting team (Magic Link)

1. In **Supabase Dashboard** → **Authentication** → **Providers**: ensure **Email** is enabled (Magic Link is the default for “Confirm email” off or “Secure email change”).
2. **Authentication** → **Users**: you can add users by email; they will get an invite or can sign in with “Sign in with email” and receive a magic link.
3. Share the Vercel app URL with the team. Each person goes to the app → **Login** → enters their **work email** → receives the magic link → signs in. No passwords; only emails you allow in Supabase (or your policy) can sign in.

## SPA routing (vercel.json)

`vercel.json` is set so all routes (e.g. `/dashboard`, `/submit`) rewrite to `index.html`. Refreshing or opening those URLs directly will work and not return 404.
