-- The campaign platform's database (docs/ownership-2026-11/HANDOFF.md, "Setting up").
--
-- Three tables. `records` holds the team's working records (briefs, calendar, dispatch log, KPI
-- actuals, implementation status...). `audit_log` holds every change, to records and to the data
-- pack, with before and after, so any change can be reverted exactly. `team_members` is the list
-- of accounts allowed to edit, which Firefly manages from /team/admin.
--
-- Two locks on every edit. The site's server checks the session and an active team_members row
-- before it writes; and the database itself refuses a write from anyone who is not an active
-- member (row-level security below), so a bug in the site cannot open editing to the public.
-- Nothing is ever deleted: deletes are refused by trigger, and the audit log is append-only.
-- Viewing never touches these policies: public pages are read by the site's server.

create extension if not exists pgcrypto;

create table if not exists public.team_members (
  email     text primary key check (email = lower(email)),
  name      text not null,
  role      text not null check (role in ('team', 'firefly')),
  active    boolean not null default true,
  added_at  timestamptz not null default now(),
  added_by  text not null
);

create table if not exists public.records (
  id          uuid primary key default gen_random_uuid(),
  collection  text not null,
  data        jsonb not null,
  archived    boolean not null default false,
  created_at  timestamptz not null default now(),
  created_by  text not null,
  updated_at  timestamptz not null default now(),
  updated_by  text not null
);
create index if not exists records_collection_updated on public.records (collection, updated_at desc);

create table if not exists public.audit_log (
  id          uuid primary key default gen_random_uuid(),
  at          timestamptz not null default now(),
  actor       text not null,
  actor_email text,
  layer       text not null check (layer in ('ops', 'pack')),
  action      text not null check (action in ('create', 'update', 'revert', 'pack-edit', 'pack-revert')),
  collection  text not null,
  record_id   text not null,
  title       text not null,
  before      jsonb,
  after       jsonb,
  ref         jsonb,
  revert_of   uuid references public.audit_log (id)
);
create index if not exists audit_log_at on public.audit_log (at desc);

alter table public.team_members enable row level security;
alter table public.records      enable row level security;
alter table public.audit_log    enable row level security;

-- True for a signed-in user whose email is an active team member.
create or replace function public.is_active_member() returns boolean
language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.team_members
    where email = lower(coalesce(auth.jwt() ->> 'email', '')) and active
  );
$$;

drop policy if exists records_select_members on public.records;
drop policy if exists records_insert_members on public.records;
drop policy if exists records_update_members on public.records;
create policy records_select_members on public.records for select to authenticated using (public.is_active_member());
create policy records_insert_members on public.records for insert to authenticated with check (public.is_active_member());
create policy records_update_members on public.records for update to authenticated
  using (public.is_active_member()) with check (public.is_active_member());
-- No delete policy, and no policy at all on team_members or audit_log: only the site's server
-- (service role) reads and writes those.
revoke delete on public.records from anon, authenticated;

create or replace function public.refuse_delete() returns trigger language plpgsql as $$
begin
  raise exception 'Nothing is deleted on this platform. Revert the change instead.';
end;
$$;
create or replace function public.refuse_audit_change() returns trigger language plpgsql as $$
begin
  raise exception 'The change history is append-only.';
end;
$$;

drop trigger if exists records_no_delete on public.records;
create trigger records_no_delete before delete on public.records for each row execute function public.refuse_delete();
drop trigger if exists audit_no_delete on public.audit_log;
create trigger audit_no_delete before delete on public.audit_log for each row execute function public.refuse_audit_change();
drop trigger if exists audit_no_update on public.audit_log;
create trigger audit_no_update before update on public.audit_log for each row execute function public.refuse_audit_change();
