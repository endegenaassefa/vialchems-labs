-- ============================================================
-- Customer Accounts — make research_focus optional.
--
-- Operator decision (2026-06-12): the 10-character minimum was
-- customer friction without clear value. Drop both the NOT NULL
-- constraint and the length-range CHECK on customer_profiles.
-- archived_accounts gets the same NOT NULL relaxation so deletions
-- of accounts created BEFORE this change still snapshot correctly
-- if their original profile had a value.
--
-- Purely additive / relaxing — no destructive ops, no data
-- migration. Rollback = re-add the constraint (after verifying no
-- shorter-than-10 values landed in the meantime).
-- ============================================================

alter table public.customer_profiles
  drop constraint if exists customer_profiles_research_focus_check;

-- Length-range CHECK was unnamed in the original migration; drop
-- both the named and the unnamed variants defensively.
do $$
declare
  v_conname text;
begin
  for v_conname in
    select conname
    from pg_constraint
    where conrelid = 'public.customer_profiles'::regclass
      and contype = 'c'
      and pg_get_constraintdef(oid) ilike '%research_focus%between%'
  loop
    execute format('alter table public.customer_profiles drop constraint %I', v_conname);
  end loop;
end$$;

alter table public.customer_profiles
  alter column research_focus drop not null;

-- Re-add a max-length cap so a runaway client can't stuff a giant
-- string into the column. Lower bound removed; upper bound preserved.
alter table public.customer_profiles
  add constraint customer_profiles_research_focus_max_len
  check (research_focus is null or char_length(research_focus) <= 500);

-- archived_accounts mirrors the relaxation so account deletion
-- snapshots a NULL research_focus correctly.
alter table public.archived_accounts
  alter column research_focus drop not null;

comment on column public.customer_profiles.research_focus is
  'Optional free-text description of the customer''s research focus. ' ||
  'Up to 500 chars; NULL when the customer skipped the field.';
