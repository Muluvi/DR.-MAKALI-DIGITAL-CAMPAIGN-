-- The Campaigner Network's private data (lib/network/, docs/network/README.md).
--
-- Personal data and political association, which the Data Protection Act, 2019 treats as sensitive.
-- Every table below has row-level security ON and NO policy: the anon and authenticated keys (the
-- only keys a browser can ever hold) are refused every row. Only the site's server, with the service
-- role, reaches these tables, and lib/network/service.ts enforces who may see what on every call.
--
-- Never stored: national ID numbers, voter card numbers, or how a person intends to vote.
-- Deletion is real: withdrawal erases a person's details; deletion and the retention purge remove the
-- row (net_purge_expired below). Village codes reference the Act's schedule held in the repository
-- (data/network/kitui-villages.v1.json); no village or voter figure is stored here.

create extension if not exists pgcrypto;

create table if not exists public.net_people (
  id                              text primary key,
  name                            text not null,
  phone                           text unique check (phone is null or phone ~ '^\+254[17][0-9]{8}$'),
  email                           text,
  woman                           boolean,
  youth                           boolean,
  consent                         jsonb not null check (consent ? 'collected_by' and consent ? 'collected_at' and consent ? 'purpose' and consent ? 'channel'),
  declaration_not_public_officer  boolean not null check (declaration_not_public_officer),
  serving_county_officer          boolean not null check (not serving_county_officer),
  public_funds_role               text not null check (public_funds_role in ('none','teacher','chief_or_assistant_chief','community_health_worker','other_public_funds','unsure')),
  eligibility                     text not null check (eligibility in ('cleared','review','barred')),
  status                          text not null check (status in ('active','withdrawn')),
  retention_until                 date not null,
  created_at                      timestamptz not null,
  updated_at                      timestamptz not null,
  created_by                      text not null
);

create table if not exists public.net_groups (
  id                                text primary key,
  type                              text not null,
  name                              text not null,
  level                             text not null check (level in ('county','constituency','ward','unit')),
  constituency                      text,
  ward_code                         integer check (ward_code between 331 and 370),
  village_code                      integer check (village_code between 1 and 247),
  leader_name                       text,
  leader_phone                      text,
  approx_members                    integer check (approx_members is null or approx_members >= 0),
  activation                        text not null check (activation in ('identified','contacted','active','paused')),
  representative_person_id          text references public.net_people (id) on delete set null,
  consent_status                    text not null check (consent_status in ('not_asked','given','refused','withdrawn')),
  consent                           jsonb,
  endorsement_confirmed_in_writing  boolean not null default false,
  endorsement_reference             text,
  created_at                        timestamptz not null,
  updated_at                        timestamptz not null,
  check (level not in ('unit','ward') or ward_code is not null),
  check ((leader_name is null and leader_phone is null) or consent_status = 'given'),
  check (not endorsement_confirmed_in_writing or endorsement_reference is not null)
);

create table if not exists public.net_roles (
  id            text primary key,
  person_id     text not null references public.net_people (id) on delete cascade,
  kind          text not null,
  constituency  text,
  ward_code     integer check (ward_code between 331 and 370),
  village_code  integer check (village_code between 1 and 247),
  group_type    text,
  group_id      text references public.net_groups (id) on delete set null,
  is_primary    boolean not null default false,
  active        boolean not null default true,
  started_at    timestamptz not null,
  ended_at      timestamptz
);
create index if not exists net_roles_person on public.net_roles (person_id);
create index if not exists net_roles_unit on public.net_roles (ward_code, village_code) where active;
-- One primary reporting line per person.
create unique index if not exists net_roles_one_primary on public.net_roles (person_id) where is_primary and active;

create table if not exists public.net_tasks (
  id            text primary key,
  title         text not null,
  instructions  text not null,
  due           date not null,
  evidence      text not null,
  objective     text not null check (objective in ('1','2','3','4','5')),
  template      text,
  target        jsonb not null,
  chain         text not null check (chain in ('geo','group')),
  created_by    text not null,
  created_at    timestamptz not null
);

create table if not exists public.net_assignments (
  id              text primary key,
  task_id         text not null references public.net_tasks (id) on delete cascade,
  person_id       text not null references public.net_people (id) on delete cascade,
  role_id         text not null,
  state           text not null check (state in ('Assigned','Acknowledged','In progress','Done','Blocked')),
  note            text,
  via             text not null check (via in ('app','ussd','whatsapp')),
  clash_decision  text,
  updated_at      timestamptz not null
);
create index if not exists net_assignments_person on public.net_assignments (person_id);
create index if not exists net_assignments_task on public.net_assignments (task_id);

-- Field signals. Not polling, not vote estimates, not official data. person_id becomes 'deleted'
-- when its author is deleted, so a report outlives the link to a person but never the other way.
create table if not exists public.net_reports (
  id               text primary key,
  person_id        text not null,
  role_id          text not null,
  task_id          text,
  chain            text not null check (chain in ('geo','group')),
  activity         text not null,
  constituency     text not null,
  ward_code        integer not null check (ward_code between 331 and 370),
  village_code     integer check (village_code between 1 and 247),
  group_type       text,
  people_reached   integer not null check (people_reached >= 0),
  issue_category   text,
  issue_text       text,
  follow_up        boolean not null,
  follow_up_note   text,
  photo_path       text,
  channel          text not null check (channel in ('app','ussd','whatsapp')),
  created_at       timestamptz not null
);
create index if not exists net_reports_ward on public.net_reports (ward_code, created_at desc);

create table if not exists public.net_flags (
  id               text primary key,
  kind             text not null check (kind in ('safety','misconduct','unresponsive')),
  raised_by        text not null,
  details          text not null,
  constituency     text,
  ward_code        integer,
  owner_person_id  text,
  state            text not null check (state in ('open','closed')),
  resolution       text,
  created_at       timestamptz not null,
  closed_at        timestamptz,
  check (state = 'open' or (owner_person_id is not null and resolution is not null))
);

create table if not exists public.net_messages (
  id              text primary key,
  kind            text not null check (kind in ('broadcast','reply')),
  from_person_id  text not null,
  voice           text not null check (voice in ('command','candidate','campaigner')),
  body            text not null,
  audience        jsonb,
  to_person_id    text,
  in_reply_to     text,
  created_at      timestamptz not null
);

-- 'sent' means the provider accepted the request. Nothing is ever recorded as delivered on our say-so.
create table if not exists public.net_deliveries (
  id           text primary key,
  message_id   text,
  task_id      text,
  person_id    text not null,
  channel      text not null check (channel in ('app','whatsapp','ussd')),
  status       text not null check (status in ('in_app','sent','failed')),
  error        text,
  provider_id  text,
  at           timestamptz not null
);
create index if not exists net_deliveries_person on public.net_deliveries (person_id);

-- Views of contact lists, edits, exports and role changes. Details never hold a name or a number.
create table if not exists public.net_audit (
  id               text primary key,
  at               timestamptz not null,
  actor_person_id  text,
  actor_label      text not null,
  action           text not null,
  subject_table    text not null,
  subject_id       text,
  detail           text not null
);
create index if not exists net_audit_at on public.net_audit (at desc);

create table if not exists public.net_aliases (
  id            text primary key,
  village_code  integer not null check (village_code between 1 and 247),
  alias         text not null,
  added_by      text not null,
  at            timestamptz not null
);

create table if not exists public.net_targets (
  id       text primary key,
  unit     text not null check (unit in ('ward','village')),
  code     integer not null,
  target   integer not null check (target >= 2 and target <= 50),
  set_by   text not null,
  at       timestamptz not null,
  unique (unit, code)
);

create table if not exists public.net_settings (
  id               text primary key check (id = 'settings'),
  retention_until  date not null,
  updated_at       timestamptz not null
);

create table if not exists public.net_templates (
  id            text primary key,
  name          text not null,
  title         text not null,
  instructions  text not null,
  evidence      text not null,
  objective     text not null check (objective in ('1','2','3','4','5')),
  updated_at    timestamptz not null
);

-- Row-level security on, and no policy: nobody but the service role reads or writes a row.
do $$
declare t text;
begin
  foreach t in array array['net_people','net_groups','net_roles','net_tasks','net_assignments','net_reports','net_flags','net_messages','net_deliveries','net_audit','net_aliases','net_targets','net_settings','net_templates'] loop
    execute format('alter table public.%I enable row level security', t);
    execute format('alter table public.%I force row level security', t);
    execute format('revoke all on public.%I from anon, authenticated', t);
  end loop;
end $$;

-- The audit log is append-only.
create or replace function public.net_refuse_audit_change() returns trigger language plpgsql as $$
begin
  raise exception 'The network audit log is append-only.';
end;
$$;
drop trigger if exists net_audit_no_update on public.net_audit;
create trigger net_audit_no_update before update or delete on public.net_audit for each row execute function public.net_refuse_audit_change();

-- The retention purge: deletes everyone whose retention date has passed, with their seats and
-- assignments, unlinks their reports, and logs the count. Schedule it daily (pg_cron) after the
-- election, or run it from the tool's admin page.
create or replace function public.net_purge_expired() returns integer language plpgsql security definer set search_path = public as $$
declare n integer;
begin
  update public.net_reports set person_id = 'deleted', photo_path = null where person_id in (select id from public.net_people where retention_until < current_date);
  with gone as (delete from public.net_people where retention_until < current_date returning id) select count(*) into n from gone;
  insert into public.net_audit (id, at, actor_person_id, actor_label, action, subject_table, subject_id, detail)
  values (gen_random_uuid()::text, now(), null, 'retention schedule', 'delete', 'net_people', null, format('retention purge deleted %s records', n));
  return n;
end;
$$;
revoke all on function public.net_purge_expired() from public, anon, authenticated;

-- Field-report photos: a private bucket, read through short-lived signed links the server issues.
insert into storage.buckets (id, name, public) values ('network-field-photos', 'network-field-photos', false) on conflict (id) do nothing;
