
alter table public.households enable row level security;
alter table public.profiles enable row level security;
alter table public.projects enable row level security;
alter table public.tasks enable row level security;
alter table public.lists enable row level security;
alter table public.list_items enable row level security;
alter table public.item_locations enable row level security;
alter table public.recipes enable row level security;
alter table public.recipe_items enable row level security;
alter table public.routines enable row level security;
alter table public.routine_logs enable row level security;
alter table public.finance_categories enable row level security;
alter table public.recurring_charges enable row level security;
alter table public.incomes enable row level security;
alter table public.investments enable row level security;
alter table public.transactions enable row level security;
alter table public.bank_connections enable row level security;

create policy "own household" on public.households for select using (id = public.current_household_id());
create policy "update own household" on public.households for update using (id = public.current_household_id());

create policy "self and household profiles select" on public.profiles for select using (id = auth.uid() or household_id = public.current_household_id());
create policy "self profile update" on public.profiles for update using (id = auth.uid());

create policy "hh select projects" on public.projects for select using (household_id = public.current_household_id());
create policy "hh write projects" on public.projects for all using (household_id = public.current_household_id()) with check (household_id = public.current_household_id());

create policy "hh all tasks" on public.tasks for all using (household_id = public.current_household_id()) with check (household_id = public.current_household_id());

create policy "hh all lists" on public.lists for all using (household_id = public.current_household_id()) with check (household_id = public.current_household_id());

create policy "hh all list_items" on public.list_items for all using (
  exists (select 1 from public.lists l where l.id = list_items.list_id and l.household_id = public.current_household_id())
) with check (
  exists (select 1 from public.lists l where l.id = list_items.list_id and l.household_id = public.current_household_id())
);

create policy "hh all item_locations" on public.item_locations for all using (household_id = public.current_household_id()) with check (household_id = public.current_household_id());

create policy "hh all recipes" on public.recipes for all using (household_id = public.current_household_id()) with check (household_id = public.current_household_id());

create policy "hh all recipe_items" on public.recipe_items for all using (
  exists (select 1 from public.recipes r where r.id = recipe_items.recipe_id and r.household_id = public.current_household_id())
) with check (
  exists (select 1 from public.recipes r where r.id = recipe_items.recipe_id and r.household_id = public.current_household_id())
);

create policy "hh all routines" on public.routines for all using (household_id = public.current_household_id()) with check (household_id = public.current_household_id());

create policy "hh all routine_logs" on public.routine_logs for all using (
  exists (select 1 from public.routines r where r.id = routine_logs.routine_id and r.household_id = public.current_household_id())
) with check (
  exists (select 1 from public.routines r where r.id = routine_logs.routine_id and r.household_id = public.current_household_id())
);

create policy "hh all finance_categories" on public.finance_categories for all using (household_id = public.current_household_id()) with check (household_id = public.current_household_id());
create policy "hh all recurring_charges" on public.recurring_charges for all using (household_id = public.current_household_id()) with check (household_id = public.current_household_id());
create policy "hh all incomes" on public.incomes for all using (household_id = public.current_household_id()) with check (household_id = public.current_household_id());
create policy "hh all investments" on public.investments for all using (household_id = public.current_household_id()) with check (household_id = public.current_household_id());
create policy "hh all transactions" on public.transactions for all using (household_id = public.current_household_id()) with check (household_id = public.current_household_id());
create policy "hh all bank_connections" on public.bank_connections for all using (household_id = public.current_household_id()) with check (household_id = public.current_household_id());

create or replace function public.join_household(code text)
returns uuid language plpgsql security definer set search_path = public as $$
declare
  target_id uuid;
  old_id uuid;
begin
  select id into target_id from public.households where invite_code = code;
  if target_id is null then
    raise exception 'Code invalide';
  end if;

  select household_id into old_id from public.profiles where id = auth.uid();

  update public.profiles set household_id = target_id where id = auth.uid();

  if old_id is not null and old_id <> target_id then
    if not exists (select 1 from public.profiles where household_id = old_id) then
      delete from public.households where id = old_id;
    end if;
  end if;

  return target_id;
end;
$$;

grant execute on function public.join_household(text) to authenticated;
