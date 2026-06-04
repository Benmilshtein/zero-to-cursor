-- =============================================================================
-- Zero to Cursor — initial schema
-- =============================================================================
-- Tables:
--   profiles            — user metadata (extends auth.users)
--   levels              — 14 curriculum levels (seeded)
--   lessons             — individual lessons (slug-addressed; MDX lives in repo)
--   progress            — per-user lesson completion
--   achievements        — catalog of unlockable badges
--   user_achievements   — earned badges per user
--   streaks             — daily activity streak per user
--
-- RLS is enabled on every user-owned table. Catalog tables (levels, lessons,
-- achievements) are world-readable.
-- =============================================================================

create extension if not exists "uuid-ossp";

-- -----------------------------------------------------------------------------
-- profiles
-- -----------------------------------------------------------------------------
create table public.profiles (
  id uuid primary key references auth.users on delete cascade,
  display_name text,
  avatar_url text,
  background_summary text,
  ai_provider text check (ai_provider in ('anthropic', 'openai') or ai_provider is null),
  onboarding_complete boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.profiles enable row level security;

create policy "profiles_self_select" on public.profiles
  for select using (auth.uid() = id);
create policy "profiles_self_insert" on public.profiles
  for insert with check (auth.uid() = id);
create policy "profiles_self_update" on public.profiles
  for update using (auth.uid() = id);

-- Auto-create a profile row on signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, display_name)
  values (new.id, coalesce(new.raw_user_meta_data->>'display_name', split_part(new.email, '@', 1)));
  insert into public.streaks (user_id) values (new.id);
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- -----------------------------------------------------------------------------
-- levels (catalog)
-- -----------------------------------------------------------------------------
create table public.levels (
  slug text primary key,
  ordinal int not null unique,
  title text not null,
  description text,
  status text not null default 'planned' check (status in ('published', 'planned', 'draft'))
);

alter table public.levels enable row level security;
create policy "levels_public_read" on public.levels for select using (true);

-- -----------------------------------------------------------------------------
-- lessons (catalog)
-- -----------------------------------------------------------------------------
create table public.lessons (
  slug text primary key,                        -- "level-01-cursor-is-not-magic/01-what-is-an-editor"
  level_slug text not null references public.levels(slug) on delete cascade,
  ordinal int not null,
  title text not null,
  est_minutes int default 3,
  activity_types text[] default '{}',
  status text not null default 'planned' check (status in ('published', 'planned', 'draft')),
  unique (level_slug, ordinal)
);

alter table public.lessons enable row level security;
create policy "lessons_public_read" on public.lessons for select using (true);

create index lessons_level_idx on public.lessons (level_slug, ordinal);

-- -----------------------------------------------------------------------------
-- progress
-- -----------------------------------------------------------------------------
create table public.progress (
  user_id uuid references public.profiles on delete cascade,
  lesson_slug text references public.lessons on delete cascade,
  status text not null check (status in ('started', 'completed')),
  score int check (score between 0 and 100),
  attempts int default 0,
  started_at timestamptz default now(),
  completed_at timestamptz,
  primary key (user_id, lesson_slug)
);

alter table public.progress enable row level security;

create policy "progress_self_all" on public.progress
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create index progress_user_idx on public.progress (user_id);

-- -----------------------------------------------------------------------------
-- achievements (catalog)
-- -----------------------------------------------------------------------------
create table public.achievements (
  slug text primary key,
  title text not null,
  description text,
  icon text,
  criteria_kind text not null check (criteria_kind in ('lessons_completed', 'level_completed', 'streak_days', 'first_lesson'))
);

alter table public.achievements enable row level security;
create policy "achievements_public_read" on public.achievements for select using (true);

-- -----------------------------------------------------------------------------
-- user_achievements
-- -----------------------------------------------------------------------------
create table public.user_achievements (
  user_id uuid references public.profiles on delete cascade,
  achievement_slug text references public.achievements on delete cascade,
  earned_at timestamptz default now(),
  primary key (user_id, achievement_slug)
);

alter table public.user_achievements enable row level security;

create policy "user_achievements_self_select" on public.user_achievements
  for select using (auth.uid() = user_id);
create policy "user_achievements_self_insert" on public.user_achievements
  for insert with check (auth.uid() = user_id);

-- -----------------------------------------------------------------------------
-- streaks
-- -----------------------------------------------------------------------------
create table public.streaks (
  user_id uuid primary key references public.profiles on delete cascade,
  current_streak int default 0,
  longest_streak int default 0,
  last_active_date date,
  updated_at timestamptz default now()
);

alter table public.streaks enable row level security;

create policy "streaks_self_all" on public.streaks
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
