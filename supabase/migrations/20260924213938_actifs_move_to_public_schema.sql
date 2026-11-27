
drop trigger if exists on_auth_user_created on auth.users;
drop schema if exists actifs cascade;

-- households let a couple/team share data
create table public.households (
  id uuid primary key default gen_random_uuid(),
  name text not null default 'Mon espace',
  invite_code text not null default substr(md5(random()::text), 1, 8),
  created_at timestamptz not null default now()
);

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  household_id uuid references public.households(id) on delete set null,
  display_name text,
  avatar_url text,
  created_at timestamptz not null default now()
);

create or replace function public.current_household_id()
returns uuid language sql stable security definer set search_path = public as $$
  select household_id from public.profiles where id = auth.uid();
$$;

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
declare
  hh_id uuid;
begin
  insert into public.households (name) values ('Espace de ' || coalesce(new.raw_user_meta_data->>'display_name', split_part(new.email,'@',1)))
  returning id into hh_id;
  insert into public.profiles (id, household_id, display_name)
  values (new.id, hh_id, coalesce(new.raw_user_meta_data->>'display_name', split_part(new.email,'@',1)));
  return new;
end;
$$;

create trigger on_auth_user_created after insert on auth.users
  for each row execute function public.handle_new_user();

-- PROJECTS & TASKS
create table public.projects (
  id uuid primary key default gen_random_uuid(),
  household_id uuid not null references public.households(id) on delete cascade,
  name text not null,
  color text not null default '#6366f1',
  icon text default '📁',
  archived boolean not null default false,
  created_by uuid references auth.users(id),
  created_at timestamptz not null default now()
);

create type public.task_priority as enum ('low','medium','high');
create type public.task_status as enum ('todo','doing','done');

create table public.tasks (
  id uuid primary key default gen_random_uuid(),
  household_id uuid not null references public.households(id) on delete cascade,
  project_id uuid references public.projects(id) on delete set null,
  title text not null,
  description text,
  priority public.task_priority not null default 'medium',
  status public.task_status not null default 'todo',
  due_date date,
  assigned_to uuid references auth.users(id),
  created_by uuid references auth.users(id),
  created_at timestamptz not null default now(),
  completed_at timestamptz
);

-- LISTS (shopping / generic), recipes, item locations
create type public.list_type as enum ('generic','shopping','recipe');

create table public.lists (
  id uuid primary key default gen_random_uuid(),
  household_id uuid not null references public.households(id) on delete cascade,
  name text not null,
  category text default 'Général',
  type public.list_type not null default 'generic',
  created_by uuid references auth.users(id),
  created_at timestamptz not null default now()
);

create table public.list_items (
  id uuid primary key default gen_random_uuid(),
  list_id uuid not null references public.lists(id) on delete cascade,
  label text not null,
  quantity text,
  note text,
  checked boolean not null default false,
  position int not null default 0,
  created_at timestamptz not null default now()
);

create table public.item_locations (
  id uuid primary key default gen_random_uuid(),
  household_id uuid not null references public.households(id) on delete cascade,
  item_label text not null,
  store_name text not null,
  note text,
  created_at timestamptz not null default now()
);

create table public.recipes (
  id uuid primary key default gen_random_uuid(),
  household_id uuid not null references public.households(id) on delete cascade,
  name text not null,
  category text default 'Repas',
  notes text,
  created_by uuid references auth.users(id),
  created_at timestamptz not null default now()
);

create table public.recipe_items (
  id uuid primary key default gen_random_uuid(),
  recipe_id uuid not null references public.recipes(id) on delete cascade,
  label text not null,
  quantity text,
  note text,
  position int not null default 0
);

-- ROUTINES / HABITS
create type public.routine_frequency as enum ('daily','weekly');

create table public.routines (
  id uuid primary key default gen_random_uuid(),
  household_id uuid not null references public.households(id) on delete cascade,
  user_id uuid references auth.users(id),
  title text not null,
  category text default 'Général',
  color text default '#22c55e',
  frequency public.routine_frequency not null default 'daily',
  days_of_week int[] default '{0,1,2,3,4,5,6}',
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table public.routine_logs (
  id uuid primary key default gen_random_uuid(),
  routine_id uuid not null references public.routines(id) on delete cascade,
  user_id uuid references auth.users(id),
  log_date date not null,
  done boolean not null default true,
  created_at timestamptz not null default now(),
  unique (routine_id, log_date, user_id)
);

-- FINANCE
create type public.finance_kind as enum ('expense','income');
create type public.charge_frequency as enum ('monthly','yearly','weekly','once');

create table public.finance_categories (
  id uuid primary key default gen_random_uuid(),
  household_id uuid not null references public.households(id) on delete cascade,
  name text not null,
  kind public.finance_kind not null default 'expense',
  color text default '#f97316'
);

create table public.recurring_charges (
  id uuid primary key default gen_random_uuid(),
  household_id uuid not null references public.households(id) on delete cascade,
  name text not null,
  amount numeric(12,2) not null,
  category_id uuid references public.finance_categories(id) on delete set null,
  frequency public.charge_frequency not null default 'monthly',
  next_date date not null,
  active boolean not null default true,
  created_by uuid references auth.users(id),
  created_at timestamptz not null default now()
);

create table public.incomes (
  id uuid primary key default gen_random_uuid(),
  household_id uuid not null references public.households(id) on delete cascade,
  name text not null,
  amount numeric(12,2) not null,
  expected_date date not null,
  recurring boolean not null default false,
  frequency public.charge_frequency not null default 'monthly',
  status text not null default 'expected',
  created_by uuid references auth.users(id),
  created_at timestamptz not null default now()
);

create table public.investments (
  id uuid primary key default gen_random_uuid(),
  household_id uuid not null references public.households(id) on delete cascade,
  project_name text not null,
  amount_invested numeric(12,2) not null,
  invested_date date not null default current_date,
  expected_return numeric(12,2),
  expected_return_date date,
  status text not null default 'active',
  notes text,
  created_by uuid references auth.users(id),
  created_at timestamptz not null default now()
);

create table public.transactions (
  id uuid primary key default gen_random_uuid(),
  household_id uuid not null references public.households(id) on delete cascade,
  label text not null,
  amount numeric(12,2) not null,
  kind public.finance_kind not null default 'expense',
  txn_date date not null default current_date,
  category_id uuid references public.finance_categories(id) on delete set null,
  source text not null default 'manual',
  created_by uuid references auth.users(id),
  created_at timestamptz not null default now()
);

create table public.bank_connections (
  id uuid primary key default gen_random_uuid(),
  household_id uuid not null references public.households(id) on delete cascade,
  provider text not null default 'manual',
  status text not null default 'not_connected',
  created_at timestamptz not null default now()
);
