-- No sign-in (Firefly's decision, 12 November 2026). Anyone with the link can add and change the
-- team's records, but only through the site's server, which validates each record, refuses
-- personal data, rate limits each visitor and logs every change (lib/platform/auth.ts). The server
-- uses the service role, which row-level security does not restrict.
--
-- So no browser role may touch these tables directly: the member policies the sign-in era
-- needed are dropped, and every table privilege is revoked from anon and authenticated. Row-level
-- security stays on with no policy for those roles, which refuses everything they ask. Deletes
-- stay refused for everyone, and the change history stays append-only (the triggers in
-- 20261108000000_platform.sql are unchanged).

drop policy if exists records_select_members on public.records;
drop policy if exists records_insert_members on public.records;
drop policy if exists records_update_members on public.records;

revoke all on public.records, public.audit_log, public.team_members from anon, authenticated;

alter table public.records      enable row level security;
alter table public.audit_log    enable row level security;
alter table public.team_members enable row level security;

-- The member list is no longer read by the site. It is kept, empty of meaning, rather than
-- dropped, so the history of who was a member before this change is not destroyed.
comment on table public.team_members is 'Unused since 12 November 2026: the site has no sign-in. Kept for the record; nothing reads it.';
