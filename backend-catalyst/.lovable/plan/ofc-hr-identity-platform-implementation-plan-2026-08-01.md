# OFC HR Identity Platform — Implementation Plan

## Goal
Wire the uploaded OFC HR Identity frontend to Lovable Cloud auth and database, then restructure the flow to match: Welcome → Register (Name/Email/Phone/Password) → Email Verification (optional) → Login → Company Onboarding Wizard → Dashboard.

## Current state
- Uploaded project is a complete mock-only TanStack Start app with auth UI, an enterprise registration wizard, and no backend.
- Lovable Cloud is enabled and the project has generated Supabase integration files.

## Plan

### 1. Merge frontend safely
- Copy uploaded `src/`, `public/`, and config files into the current project.
- Preserve Lovable Cloud files: `src/integrations/supabase/*`, `.env`, `src/start.ts` (append `attachSupabaseAuth` to existing `functionMiddleware`), `package.json` (keep `@supabase/supabase-js`), `supabase/config.toml`.
- Adopt the uploaded `src/styles.css` OFC HR design system.

### 2. Database schema (migration)
Create three user-facing tables with GRANTs, RLS, and policies:

- `public.profiles`
  - `id uuid primary key default gen_random_uuid()`
  - `user_id uuid references auth.users(id) on delete cascade not null`
  - `full_name text`, `phone text`, `avatar_url text`, `role text default 'admin'`
  - `created_at timestamptz default now()`, `updated_at timestamptz default now()`
  - RLS: users read/update own row; service_role all.

- `public.companies`
  - `id uuid primary key default gen_random_uuid()`
  - `name text not null`, `logo text`, `industry text`, `size text`, `website text`, `country text`, `timezone text`
  - `address text`, `city text`, `state text`, `zip_code text`, `gst_number text`
  - `owner_id uuid references auth.users(id) on delete set null`
  - `created_at timestamptz default now()`, `updated_at timestamptz default now()`
  - RLS: authenticated users read companies they own; service_role all.

- `public.user_roles` (separate roles table per security rules)
  - `id uuid primary key default gen_random_uuid()`
  - `user_id uuid references auth.users(id) on delete cascade not null`
  - `role text not null`
  - unique `(user_id, role)`
  - RLS: authenticated select own; service_role all.

Also create:
- `public.handle_new_user()` trigger to auto-create a profile on `auth.users` insert.
- Optional `public.has_role(_user_id uuid, _role text)` security definer helper.

### 3. Restructure routes
- `/` — Welcome landing page (replace the redirect; use the uploaded index/brand content).
- `/auth/register` — Simple user signup: Name, Email, Phone, Password. Calls `supabase.auth.signUp()`, then redirects to `/auth/verify-email`.
- `/auth/verify-email` — Email verification prompt; optional resend.
- `/auth/login` — Email/password sign in. On success, navigate to `/auth/onboarding` if no company exists, otherwise `/dashboard`.
- `/auth/onboarding` — Company onboarding wizard (reuse existing register wizard components: Organization → Address → Admin → Review → Done). Protected by auth. Creates the company and updates the profile.
- `/auth/forgot-password`, `/auth/reset-password` — Keep existing pages, wire to Supabase.
- `/dashboard` — Protected dashboard under `src/routes/_authenticated/dashboard.tsx`. Shows company/user summary.
- `src/routes/_authenticated/route.tsx` — Integration-managed protected layout (`ssr: false`, redirect to `/auth/login`).

### 4. Server functions
- `createProfile` — authenticated, inserts/updates `profiles` and `user_roles`.
- `createCompany` — authenticated, inserts `companies` and sets `owner_id`.
- `getOnboardingStatus` — authenticated, returns whether the user has a company.
- `getDashboardSummary` — authenticated, returns profile + company for the dashboard.

### 5. Auth wiring
- In `src/routes/__root.tsx`: subscribe to `supabase.auth.onAuthStateChange`, invalidate router/query cache on sign-in/sign-out.
- Replace the Zustand mock `signIn`/`signUp` calls with Supabase client calls in the UI.
- Add Google sign-in via `lovable.auth.signInWithOAuth` and configure the provider the same turn.

### 6. Polish
- Update root metadata to OFC HR branding.
- Ensure all routes have `head()` with unique titles/descriptions.
- Add dashboard with minimal stats cards and navigation.

### 7. Verification
- Run `bun run build:dev` to confirm no import-graph or route errors.
- Use Playwright to verify: register → verify prompt → login → onboarding → dashboard.
