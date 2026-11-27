-- L'adresse est tenue pour confirmee a l'inscription.
--
-- Pourquoi : le service d'envoi de courriels inclus dans le forfait gratuit
-- refuse de livrer aux adresses qui ne sont pas dans l'equipe du projet. Un
-- courriel de confirmation ne partirait donc jamais, et chaque compte cree
-- resterait bloque. On pose la confirmation ici, ce qui revient exactement a
-- decocher « Confirm email » dans la console, mais sans dependre d'un
-- reglage qu'on oublie.
--
-- Ce que ca coute : une adresse n'est pas verifiee. Le pseudo, lui, est
-- unique, et c'est lui qui porte l'identite publique. Le jour ou un serveur
-- d'envoi est branche (Resend, Brevo, tous deux gratuits a ce volume), il
-- suffit de supprimer ce declencheur pour retrouver la verification.
--
-- `confirmed_at` n'est pas touche : c'est une colonne calculee.
create or replace function public.confirmer_adresse() returns trigger
  language plpgsql security definer set search_path = public as $$
begin
  if new.email_confirmed_at is null then
    new.email_confirmed_at := now();
  end if;
  return new;
end $$;
revoke all on function public.confirmer_adresse() from anon, authenticated, public;

create trigger confirmer_adresse_a_l_inscription
  before insert on auth.users
  for each row execute function public.confirmer_adresse();
