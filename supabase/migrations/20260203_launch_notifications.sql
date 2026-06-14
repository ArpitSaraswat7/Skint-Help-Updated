-- Migration: 20260203_launch_notifications
-- Purpose: Store email sign-ups from the PublicFoodMap "Notify Me" form (CQ-07 fix)
-- RLS: Public can INSERT their own email; only admin can SELECT/DELETE

-- Create the table
create table if not exists public.launch_notifications (
    id          uuid        primary key default gen_random_uuid(),
    email       text        not null,
    created_at  timestamptz not null default now(),
    -- Prevent duplicate signups from the same email
    constraint launch_notifications_email_unique unique (email)
);

-- Enable Row Level Security
alter table public.launch_notifications enable row level security;

-- Policy 1: Anyone (even unauthenticated) can insert their own email
create policy "launch_notifications_public_insert"
    on public.launch_notifications
    for insert
    with check (true);

-- Policy 2: Only admins can view the subscriber list
create policy "launch_notifications_admin_select"
    on public.launch_notifications
    for select
    using (
        auth.jwt() ->> 'role' = 'admin'
        or exists (
            select 1 from public.profiles
            where profiles.id = auth.uid()
              and profiles.role = 'admin'
        )
    );

-- Policy 3: Only admins can delete entries (e.g. unsubscribe handling)
create policy "launch_notifications_admin_delete"
    on public.launch_notifications
    for delete
    using (
        auth.jwt() ->> 'role' = 'admin'
        or exists (
            select 1 from public.profiles
            where profiles.id = auth.uid()
              and profiles.role = 'admin'
        )
    );

-- Index for email lookups and deduplication checks
create index if not exists launch_notifications_email_idx
    on public.launch_notifications (email);
