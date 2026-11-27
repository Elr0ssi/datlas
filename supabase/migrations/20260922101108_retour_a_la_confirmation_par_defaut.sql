-- Retrait du declencheur qui tenait toute adresse pour confirmee.
--
-- Il avait ete pose pour que l'inscription fonctionne sur le forfait
-- gratuit, ou le service d'envoi de courriels ne livre qu'aux adresses de
-- l'equipe du projet. Mais il rendait invisible un choix qui doit se voir :
-- la console aurait continue d'afficher « Confirm email » active alors que
-- plus aucune adresse n'etait verifiee.
--
-- Le projet revient donc a son reglage par defaut. Pour que l'inscription
-- fonctionne, deux chemins, tous deux visibles : decocher « Confirm email »
-- dans Authentication > Sign In / Providers > Email, ou brancher un serveur
-- d'envoi et garder la verification.
drop trigger if exists confirmer_adresse_a_l_inscription on auth.users;
drop function if exists public.confirmer_adresse();
