-- ================================================================
-- SJCET WORLD CUP PREDICTION APP — COMPLETE SUPABASE SETUP
-- Run this entire script in Supabase → SQL Editor → New Query
-- ================================================================


-- ================================================================
-- 1. STUDENTS TABLE
--    Stores college profiles linked to Supabase Auth users
-- ================================================================
create table if not exists public.students (
  id            uuid primary key default gen_random_uuid(),
  auth_id       uuid not null unique references auth.users(id) on delete cascade,
  name          text not null,
  branch        text not null,
  year          integer not null check (year between 1 and 4),
  email         text not null,
  total_points  integer not null default 0,
  created_at    timestamptz default now()
);

alter table public.students enable row level security;

create policy "Users read all students"
  on public.students for select using (true);

create policy "Users manage own student row"
  on public.students for all
  using (auth.uid() = auth_id);


-- ================================================================
-- 2. MATCHES TABLE
--    World Cup matches that users predict on
--    (completely separate from the college fixtures bracket)
-- ================================================================
create table if not exists public.matches (
  id                  uuid primary key default gen_random_uuid(),
  team_a              text not null,
  team_b              text not null,
  stage               text not null default 'group',   -- group / round_of_16 / quarter_final / semi_final / final
  match_date          timestamptz not null,
  prediction_deadline timestamptz not null,            -- lock time, usually 1hr before kick-off
  status              text not null default 'upcoming', -- upcoming / live / finished
  actual_score_a      integer default null,
  actual_score_b      integer default null,
  actual_winner       text default null,
  created_at          timestamptz default now()
);

alter table public.matches enable row level security;

create policy "Public read matches"
  on public.matches for select using (true);

create policy "Auth users manage matches"
  on public.matches for all
  using (auth.role() = 'authenticated');


-- ================================================================
-- 3. PREDICTIONS TABLE
--    One row per student per match
-- ================================================================
create table if not exists public.predictions (
  id                  uuid primary key default gen_random_uuid(),
  student_id          uuid not null references public.students(id) on delete cascade,
  match_id            uuid not null references public.matches(id) on delete cascade,
  predicted_score_a   integer not null,
  predicted_score_b   integer not null,
  predicted_winner    text not null,
  created_at          timestamptz default now(),
  unique (student_id, match_id)           -- one prediction per student per match
);

alter table public.predictions enable row level security;

create policy "Users read all predictions"
  on public.predictions for select using (true);

create policy "Users manage own predictions"
  on public.predictions for all
  using (
    auth.uid() = (
      select auth_id from public.students where id = student_id
    )
  );


-- ================================================================
-- 4. FIXTURES TABLE
--    College interdepartmental knockout bracket — display only
--    NO connection to points / predictions
-- ================================================================
create table if not exists public.fixtures (
  match_number  integer primary key,
  team_a        text not null,
  team_b        text not null,
  team_a_source integer references public.fixtures(match_number),
  team_b_source integer references public.fixtures(match_number),
  score_a       integer default null,
  score_b       integer default null,
  match_date    date not null,
  winner        text default null,
  played        boolean not null default false
);

alter table public.fixtures enable row level security;

create policy "Public read fixtures"
  on public.fixtures for select using (true);

create policy "Auth users manage fixtures"
  on public.fixtures for all
  using (auth.role() = 'authenticated');

-- Enable real-time so the bracket updates live
alter publication supabase_realtime add table public.fixtures;


-- ================================================================
-- 5. RPC: upsert_student
--    Called by ProfileSetup.tsx when a user saves their profile
-- ================================================================
create or replace function public.upsert_student(
  p_name   text,
  p_branch text,
  p_year   integer,
  p_email  text
) returns void language plpgsql security definer as $$
begin
  insert into public.students (auth_id, name, branch, year, email)
  values (auth.uid(), p_name, p_branch, p_year, p_email)
  on conflict (auth_id) do update
    set name   = excluded.name,
        branch = excluded.branch,
        year   = excluded.year,
        email  = excluded.email;
end;
$$;


-- ================================================================
-- 6. RPC: get_leaderboard
--    Called by Leaderboard.tsx
--    Points system:
--      • Exact scoreline correct  → 5 pts
--      • Correct winner only      → 3 pts
--      • Wrong                    → 0 pts
-- ================================================================
create or replace function public.get_leaderboard()
returns table (
  id            uuid,
  name          text,
  branch        text,
  year          integer,
  total_points  bigint,
  rank          bigint
) language sql stable as $$
  select
    s.id,
    s.name,
    s.branch,
    s.year,
    coalesce(sum(
      case
        when m.actual_score_a is null then 0          -- match not played yet
        when p.predicted_score_a = m.actual_score_a
         and p.predicted_score_b = m.actual_score_b then 5   -- exact score
        when p.predicted_winner  = m.actual_winner   then 3  -- correct winner only
        else 0
      end
    ), 0) as total_points,
    row_number() over (
      order by coalesce(sum(
        case
          when m.actual_score_a is null then 0
          when p.predicted_score_a = m.actual_score_a
           and p.predicted_score_b = m.actual_score_b then 5
          when p.predicted_winner  = m.actual_winner   then 3
          else 0
        end
      ), 0) desc,
      coalesce(sum(
        case 
          when m.actual_score_a is not null 
           and p.predicted_score_a = m.actual_score_a
           and p.predicted_score_b = m.actual_score_b then 1
          else 0 
        end
      ), 0) desc
    )::bigint as rank
    
  from public.students s
  left join public.predictions p on p.student_id = s.id
  left join public.matches     m on m.id = p.match_id
  group by s.id, s.name, s.branch, s.year
  order by 
    total_points desc,
    coalesce(sum(
      case 
        when m.actual_score_a is not null 
         and p.predicted_score_a = m.actual_score_a
         and p.predicted_score_b = m.actual_score_b then 1
        else 0 
      end
    ), 0) desc;
$$;


-- ================================================================
-- 7. SEED — College bracket fixtures
--    Replace match_date values with your actual schedule
-- ================================================================
insert into public.fixtures
  (match_number, team_a, team_b, team_a_source, team_b_source, match_date)
values
  (1,  'CY',        'ECS',       null, null, '2026-07-10'),
  (2,  'CE & EEE',  'CS-C',      null, null, '2026-07-10'),
  (6,  'MCA',       'AD',        null, null, '2026-07-11'),
  (7,  'CS-B',      'AI',        null, null, '2026-07-11'),
  (3,  'W-Match 1', 'ME',        1,    null, '2026-07-12'),
  (4,  'W-Match 2', 'EC',        2,    null, '2026-07-12'),
  (8,  'W-Match 7', 'CS-A',      7,    null, '2026-07-13'),
  (5,  'W-Match 3', 'W-Match 4', 3,    4,    '2026-07-14'),
  (9,  'W-Match 6', 'W-Match 8', 6,    8,    '2026-07-14'),
  (10, 'W-Match 5', 'W-Match 9', 5,    9,    '2026-07-15')
on conflict (match_number) do nothing;


-- ================================================================
-- 8. SAMPLE — Add a World Cup match for predictions
--    Run one insert per match you want users to predict on.
--    prediction_deadline = when the form locks (before kick-off)
-- ================================================================
/*
insert into public.matches
  (team_a, team_b, stage, match_date, prediction_deadline)
values
  ('Brazil', 'Argentina', 'group',
   '2026-07-15 18:00:00+05:30',
   '2026-07-15 17:00:00+05:30');
*/


-- ================================================================
-- 9. HOW TO UPDATE A WORLD CUP MATCH RESULT
--    Run after the real match ends — points auto-update via RPC
-- ================================================================
/*
update public.matches set
  actual_score_a = 2,
  actual_score_b = 1,
  actual_winner  = 'Brazil',
  status         = 'finished'
where team_a = 'Brazil' and team_b = 'Argentina';
*/


-- ================================================================
-- 10. HOW TO UPDATE A COLLEGE FIXTURE RESULT
--     (bracket only — no points affected)
-- ================================================================
/*
update public.fixtures set
  score_a = 0,
  score_b = 1,
  winner  = 'ECS',
  played  = true
where match_number = 1;
*/
