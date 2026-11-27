-- Les messages envoyés depuis /contact : questions, signalement d'une erreur de chiffre, exercice des droits RGPD,
-- signalement d'un contenu (DSA). Tout le monde peut écrire ; personne ne peut relire par l'API publique :
-- la lecture se fait depuis le tableau de bord Supabase, par l'éditeur.
create table if not exists public.contacts (
  id uuid primary key default gen_random_uuid(),
  sujet text not null check (sujet in ('question', 'erreur', 'rgpd', 'signalement', 'presse', 'autre')),
  email text check (email is null or (char_length(email) <= 200 and email ~ '^[^@\s]+@[^@\s]+\.[^@\s]+$')),
  nom text check (nom is null or char_length(nom) <= 120),
  message text not null check (char_length(message) between 10 and 5000),
  page text check (page is null or char_length(page) <= 500),
  profil_id uuid references public.profils(id) on delete set null,
  etat text not null default 'nouveau' check (etat in ('nouveau', 'en_cours', 'traite')),
  cree_le timestamptz not null default now()
);

alter table public.contacts enable row level security;

-- Écrire, oui (connecté ou non) ; lire, modifier ou effacer, non : aucune autre politique n'est créée.
create policy "contacts_envoi" on public.contacts for insert to anon, authenticated
  with check (etat = 'nouveau' and (profil_id is null or profil_id = auth.uid()));

-- Un garde-fou contre l'envoi en rafale : au plus 30 messages par minute pour tout le site.
create or replace function public.contacts_limite() returns trigger
  language plpgsql security definer set search_path = public as $$
begin
  if (select count(*) from public.contacts where cree_le > now() - interval '1 minute') >= 30 then
    raise exception 'Trop de messages en peu de temps. Reessayez dans une minute.';
  end if;
  return new;
end $$;
revoke all on function public.contacts_limite() from public, anon, authenticated;

create trigger contacts_limite_debit before insert on public.contacts
  for each row execute function public.contacts_limite();

create index if not exists contacts_recents on public.contacts (etat, cree_le desc);
