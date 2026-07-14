-- Migration: create profiles and tasks tables with RLS and policies
-- 1) profiles table (linked to auth.users)
create table if not exists public.profiles (
  id uuid not null primary key references auth.users(id) on delete cascade,
  name text,
  avatar_url text,
  role text default 'user',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Enforce email uniqueness is managed by supabase.auth; profiles don't store password.

-- 2) tasks table
create table if not exists public.tasks (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  status text not null default 'todo' check (status in ('todo','in_progress','completed')),
  priority text not null default 'medium' check (priority in ('low','medium','high')),
  due_date date,
  user_id uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Enable RLS
alter table public.profiles enable row level security;
alter table public.tasks enable row level security;

-- Policies for profiles
-- Owners can select, update their own profile
create policy "profiles_owner_select" on public.profiles for select using (auth.uid() = id);
create policy "profiles_owner_update" on public.profiles for update using (auth.uid() = id) with check (auth.uid() = id);

-- Admin can manage all profiles (admin role stored in JWT claims or profiles.role)
create policy "profiles_admin_manage" on public.profiles for all using (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'));

-- Policies for tasks
-- Users can select their own tasks
create policy "tasks_owner_select" on public.tasks for select using (auth.uid() = user_id);
-- Users can insert tasks where user_id = auth.uid()
create policy "tasks_owner_insert" on public.tasks for insert with check (auth.uid() = user_id);
-- Users can update/delete their own tasks
create policy "tasks_owner_update" on public.tasks for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "tasks_owner_delete" on public.tasks for delete using (auth.uid() = user_id);

-- Admin override: allow users with role 'admin' in profiles table to bypass owner checks
create policy "tasks_admin_manage" on public.tasks for all using (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'));

-- Indexes
create index if not exists tasks_user_id_idx on public.tasks (user_id);
create index if not exists tasks_created_at_idx on public.tasks (created_at);
