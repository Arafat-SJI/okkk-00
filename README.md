# TaskFlow - Team Task Management (Seeded from starter)

This repository is a Vite + React frontend for TaskFlow, integrated with Supabase for Auth, Postgres, and Storage.

## Features implemented (per spec)
- Sign up / login / logout via Supabase Auth.
- Dashboard with task overview (total, completed, in-progress) and task creation.
- Create, edit, delete tasks with fields: title, description, due date, priority, status.
- Update task status (todo, in_progress, completed).
- Search, filter (status, priority), and sort tasks (newest, oldest, due date).
- Profile management: update name and upload avatar (Supabase Storage).
- RLS policies and Postgres migrations included for profiles and tasks with appropriate permissions (owner/admin).

## Local setup

1. Install dependencies
   npm install

2. Create a Supabase project and copy the project's URL and anon/public key into a `.env` file based on `.env.example`.

3. Run migrations
   Supabase CLI example:
   supabase db push --project-ref your-project-ref
   or use `psql` to run the SQL files in `supabase/migrations/20260714_create_profiles_and_tasks.sql` against your database.

   Note: The migration file creates `profiles` and `tasks` tables and RLS policies. `profiles` links to `auth.users` (Supabase Auth).

4. Start the dev server
   npm run dev

## Important env vars (.env.example contains names)
- VITE_SUPABASE_URL
- VITE_SUPABASE_PUBLISHABLE_KEY

Do NOT put service role keys into client envs.

## Implementation notes & decisions
- Auth vs. password column: The spec listed a Users table with a password column. This implementation uses Supabase Auth for secure password management (best practice). A `profiles` table holds profile metadata and is linked to Supabase `auth.users` via the user's UUID.
- Notifications are implemented as simple inline alerts (window.alert) for success/error to keep the implementation focused and avoid adding another UI dependency. This can be replaced with a toast system (sonner) later.
- The Task list fetch is paginated at the service level; the dashboard currently loads the first page and performs lightweight client-side filtering/sorting for responsiveness. The service supports proper server-side querying and range requests.
- Avatar uploads are stored in a Supabase Storage bucket named `avatars`. Make sure to create the bucket and set public access (or change to signed URLs and use server-side functions for secure access).
- RLS policies are written to:
  - Allow owners (auth.uid() = user_id) to operate on their profiles/tasks.
  - Allow admins (profiles.role = 'admin') to manage all resources (admin role must be set in the profiles table via the dashboard or directly in DB).
- Password change flows are handled by Supabase Auth (not implemented as a dedicated UI in initial scope). Users can sign in and use Supabase Auth flows (e.g., forgot password) as configured in your Supabase project.
- Accessibility: basic form labels and aria attributes added. Further WCAG AA improvements are recommended before production.

## What's out of scope
- Team workspaces, comments, file attachments on tasks, email notifications, calendar views, and external integrations are not implemented.

If you find any issue or missing wiring for your Supabase project, check the client config in `src/integrations/supabase/client.ts` and ensure your env vars are set.
