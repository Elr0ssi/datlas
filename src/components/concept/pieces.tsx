"use client";

import { useEffect, useId, useRef, useState } from "react";
import { aReviser, lireLocal, surChangement } from "@/lib/carnet";
import { Newspaper, Swords, TrendingUp, Users, Wheat } from "lucide-react";
import { motion, useInView } from "framer-motion";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { LienCompte } from "@/components/compte/LienCompte";
import { BoutonTheme } from "./Theme";
import { ChoixMonnaie } from "./Monnaie";

/* ═══════════════════════════════════════════════════════════════════════════
   LES PETITES PIÈCES DU PROTOTYPE
   ═══════════════════════════════════════════════════════════════════════════ */

export const LENT = [0.22, 1, 0.36, 1] as const;

/**
 * L'emplacement d'une image à venir.
 *
 * Aucune photo n'est cherchée ni générée : le cadre garde exactement les
 * proportions prévues et affiche le nom du fichier attendu. Il suffira de
 * remplacer ce composant par une balise `img` pointant sur
 * `/concept/<nom>.png` une fois les visuels déposés.
 */
/* Une teinte par famille de sujet, pour que le cadre vide donne déjà une
   idée du rythme de la page. Ce ne sont pas des images : ce sont des fonds
   dégradés, générés en CSS, que le PNG viendra recouvrir. */
const TEINTES: Record<string, [string, string]> = {
  ECONOMIE: ["#4a2f16", "#0d1218"],
  GEOPOLITIQUE: ["#16304a", "#0d1218"],
  CLIMAT: ["#123b33", "#0d1218"],
  RESSOURCES: ["#4a2a18", "#0d1218"],
  SOCIETES: ["#33304a", "#0d1218"],
  ANALYSES: ["#2c3238", "#0d1218"],
  ARTICLE_01: ["#4a2a18", "#0b1016"],
  ARTICLE_02: ["#3d3418", "#0b1016"],
  ARTICLE_03: ["#123b33", "#0b1016"],
  ARTICLE_04: ["#16304a", "#0b1016"],
  THEME_01: ["#4a2f16", "#0b1016"],
  THEME_02: ["#16304a", "#0b1016"],
  THEME_03: ["#123b33", "#0b1016"],
  THEME_04: ["#4a2a18", "#0b1016"],
  THEME_05: ["#33304a", "#0b1016"],
};

function teinte(nom: string): [string, string] {
  const cle = Object.keys(TEINTES).find((k) => nom.includes(k));
  return cle ? TEINTES[cle] : ["#1a2029", "#0b1016"];
}

export function ImagePlaceholder({
  nom,
  ratio = "16 / 9",
  className = "",
}: {
  nom: string;
  ratio?: string;
  className?: string;
}) {
  const [a, b] = teinte(nom);
  return (
    <div
      className={`image-placeholder ${className}`}
      style={
        {
          aspectRatio: ratio,
          "--ph-a": a,
          "--ph-b": b,
        } as React.CSSProperties
      }
      data-png={nom}
    >
      <span className="image-placeholder-lueur" aria-hidden="true" />
      <span className="image-placeholder-trame" aria-hidden="true" />
      <span className="image-placeholder-etiquette">{nom}</span>
    </div>
  );
}

/** Un nombre qui se remplit quand il entre dans le champ. */
export function Compteur({
  valeur,
  prefixe = "",
  suffixe = "",
  decimales = 0,
  duree = 1.8,
}: {
  valeur: number;
  prefixe?: string;
  suffixe?: string;
  decimales?: number;
  duree?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const vu = useInView(ref, { once: true, margin: "-90px" });
  const [v, setV] = useState(0);

  useEffect(() => {
    if (!vu) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setV(valeur);
      return;
    }
    let f = 0;
    const t0 = performance.now();
    const pas = (t: number) => {
      const p = Math.min(1, (t - t0) / (duree * 1000));
      setV(valeur * (1 - Math.pow(1 - p, 4)));
      if (p < 1) f = requestAnimationFrame(pas);
    };
    f = requestAnimationFrame(pas);
    return () => cancelAnimationFrame(f);
  }, [vu, valeur, duree, decimales]);

  return (
    <span ref={ref} className="cg-tabulaire">
      {prefixe}
      {v.toLocaleString("fr-FR", { minimumFractionDigits: decimales, maximumFractionDigits: decimales })}
      {suffixe}
    </span>
  );
}

/** Un bloc qui monte à l'entrée dans le champ. */
export function Monte({
  children,
  delay = 0,
  y = 30,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  y?: number;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.95, delay, ease: LENT }}
    >
      {children}
    </motion.div>
  );
}

/** Le titre de section : une ligne fine, un libellé, rien d'autre. */
export function Enseigne({ children, droite }: { children: React.ReactNode; droite?: React.ReactNode }) {
  return (
    <div className="cg-enseigne">
      <span className="cg-enseigne-t">{children}</span>
      <span className="cg-enseigne-r" aria-hidden="true" />
      {droite}
    </div>
  );
}

/** Le titre de section des pages de sujet (Économie, Démographie, Forum…) :
    un grand titre blanc, et en dessous, en petit, ce qui le situe, une
    période, une source. Les pages de sujet partagent toutes cette forme. */
export function TitreSection({
  titre,
  sous,
  direct,
}: {
  titre: React.ReactNode;
  sous?: React.ReactNode;
  /** Un point vert qui bat devant le titre : la section avance en direct. */
  direct?: boolean;
}) {
  return (
    <div className="cg-ts">
      <h2 className="cg-ts-t">
        {direct && <span className="cg-point-vif" aria-hidden="true" />}
        {titre}
      </h2>
      {sous && <p className="cg-ts-s">{sous}</p>}
    </div>
  );
}

/* ── L'en-tête et le pied, partagés par les pages du prototype ──────────── */

interface Onglet {
  label: string;
  /** Absent : la rubrique est annoncée, mais elle n'a pas encore de page. */
  href?: string;
}

/* Les onglets, dans l'ordre où ils se lisent. Aucun symbole : le nom suffit,
   et un symbole devant chaque mot faisait de la barre une rangée de choses qui
   se ressemblent. */
const NAV: Onglet[] = [
  { label: "Économie", href: "/economie" },
  { label: "Démographie", href: "/demographie" },
  { label: "Conflits", href: "/conflits" },
  { label: "Ressources", href: "/ressources" },
  { label: "Forum", href: "/forum" },
  { label: "Comparer", href: "/comparer" },
  { label: "Articles", href: "/articles" },
];

/** Un onglet. Sans adresse, il se montre sans se laisser cliquer. */
function Lien({ n, actif, rang }: { n: Onglet; actif?: string; rang: number }) {
  const style = { "--i": rang } as React.CSSProperties;
  if (!n.href) {
    return (
      <span className="cg-nav-bientot" style={style}>
        {n.label}
        <em>bientôt</em>
      </span>
    );
  }
  /* Un lien Next : la page visée est préchargée, et la navigation se fait sans rechargement complet. */
  return (
    <Link
      href={n.href}
      className={actif === n.label ? "cg-nav-on" : undefined}
      aria-current={actif === n.label ? "page" : undefined}
      style={style}
    >
      {n.label}
    </Link>
  );
}

export function EnTete({ actif }: { actif?: string }) {
  /* Une pilule. Au repos, elle ne porte que le nom ; on s'en approche, ou on
     la touche, et elle s'ouvre sur les rubriques puis sur les réglages et le
     compte, séparés par un trait.

     L'ouverture se fait au survol et à la prise de focus : un menu qui ne
     répond qu'à la souris est un menu fermé pour qui navigue au clavier.
     Elle tient aussi au clic, sinon un écran tactile n'y accède jamais. */
  const [ouvert, setOuvert] = useState(false);
  const barre = useRef<HTMLElement>(null);
  /* En haut de la page, sur grand écran, la pilule reste dépliée ; dès qu'on descend, elle se replie
     (avec la même animation que la fermeture) et ne se redéplie qu'au survol, ou en remontant tout en haut.
     Sous 900 px, c'est un panneau : il ne s'ouvre qu'au toucher, jamais tout seul. */
  const [enHaut, setEnHaut] = useState(false);
  useEffect(() => {
    const large = window.matchMedia("(min-width: 901px)");
    let haut = false;
    const lire = () => {
      /* Deux seuils : on ne bascule pas à chaque pixel autour de la limite. */
      const y = window.scrollY;
      const suite = large.matches && (haut ? y < 40 : y < 8);
      if (suite !== haut) {
        haut = suite;
        setEnHaut(suite);
      }
    };
    lire();
    window.addEventListener("scroll", lire, { passive: true });
    large.addEventListener("change", lire);
    return () => {
      window.removeEventListener("scroll", lire);
      large.removeEventListener("change", lire);
    };
  }, []);
  const deplie = ouvert || enHaut;

  /* Sur téléphone, la barre s'efface quand on descend (l'écran entier pour lire) et revient dès qu'on remonte. */
  const [cache, setCache] = useState(false);
  useEffect(() => {
    const etroit = window.matchMedia("(max-width: 900px)");
    let avantY = window.scrollY;
    let etat = false;
    const lire = () => {
      const y = window.scrollY;
      const d = y - avantY;
      if (Math.abs(d) < 8) return;
      avantY = y;
      const suite = etroit.matches && y > 140 && d > 0;
      if (suite !== etat) {
        etat = suite;
        setCache(suite);
      }
    };
    window.addEventListener("scroll", lire, { passive: true });
    return () => window.removeEventListener("scroll", lire);
  }, []);

  /* Le glisseur : une pastille qui suit l'onglet survolé en s'étirant d'un onglet à l'autre. */
  const nav = useRef<HTMLElement>(null);
  const [glisse, setGlisse] = useState<{ x: number; w: number; vu: boolean; anime: boolean }>({ x: 0, w: 0, vu: false, anime: false });
  const versLien = (cible: EventTarget | null) => {
    const a = (cible as HTMLElement | null)?.closest?.("a");
    const n = nav.current;
    if (!a || !n || !n.contains(a)) return;
    const x = a.offsetLeft;
    const w = a.offsetWidth;
    setGlisse((g) => {
      if (g.vu) return { x, w, vu: true, anime: true };
      /* Première entrée : la pastille apparaît sur l'onglet sans voyager depuis l'ancien. */
      requestAnimationFrame(() => setGlisse((h) => ({ ...h, vu: true, anime: true })));
      return { x, w, vu: false, anime: false };
    });
  };
  /* Vrai quand l'ouverture est terminée : le corps cesse alors de rogner son
     contenu, pour laisser la liste des monnaies déborder. */
  const [fini, setFini] = useState(false);
  useEffect(() => {
    if (!deplie) {
      setFini(false);
      return;
    }
    const t = window.setTimeout(() => setFini(true), 720);
    return () => window.clearTimeout(t);
  }, [deplie]);
  /* L'état du menu au moment où le doigt se pose : sur un écran tactile, la
     prise de focus l'ouvre avant que le clic n'arrive, et le clic, voyant un
     menu déjà ouvert, suivait le lien. On retient donc l'état d'avant. */
  const avant = useRef(false);

  /* Échap referme, et un clic ailleurs aussi. */
  useEffect(() => {
    if (!ouvert) return;
    const touche = (e: KeyboardEvent) => e.key === "Escape" && setOuvert(false);
    const ailleurs = (e: PointerEvent) => {
      if (!barre.current?.contains(e.target as Node)) setOuvert(false);
    };
    window.addEventListener("keydown", touche);
    window.addEventListener("pointerdown", ailleurs);
    return () => {
      window.removeEventListener("keydown", touche);
      window.removeEventListener("pointerdown", ailleurs);
    };
  }, [ouvert]);

  return (
    <>
    <header
      ref={barre}
      className={`cg-header${deplie ? " cg-header-ouvert" : ""}${fini ? " cg-header-fini" : ""}${cache && !ouvert ? " cg-header-cache" : ""}`}
      onPointerEnter={(e) => e.pointerType === "mouse" && setOuvert(true)}
      onPointerLeave={(e) => e.pointerType === "mouse" && setOuvert(false)}
      onFocus={() => setOuvert(true)}
    >
      <div className="cg-pill">
        <a
          href="/"
          className="cg-logo"
          onPointerDownCapture={() => {
            avant.current = deplie;
          }}
          onClick={(e) => {
            if (!avant.current) {
              e.preventDefault();
              setOuvert(true);
            }
          }}
        >
          <MarqueDatlas />
          <span className="cg-logo-t">Datlas</span>
        </a>

        <div className="cg-pill-corps">
          <nav
            ref={nav}
            className="cg-nav"
            aria-label="Rubriques"
            onPointerOver={(e) => e.pointerType === "mouse" && versLien(e.target)}
            onFocus={(e) => versLien(e.target)}
            onPointerLeave={() => setGlisse((g) => ({ ...g, vu: false }))}
            onBlur={() => setGlisse((g) => ({ ...g, vu: false }))}
          >
            <span
              className={`cg-glisse${glisse.vu ? " cg-glisse-on" : ""}${glisse.anime ? " cg-glisse-anime" : ""}`}
              style={{ transform: `translateX(${glisse.x}px)`, width: glisse.w }}
              aria-hidden="true"
            />
            {NAV.map((n, i) => (
              <Lien key={n.label} n={n} actif={actif} rang={i} />
            ))}
          </nav>

          <span className="cg-sep" aria-hidden="true" />

          <div className="cg-bout">
            <BoutonCarnet />
            <ChoixMonnaie />
            <BoutonTheme className="cg-jour" />
          </div>
        </div>

        {/* L'entrée de compte reste posée sur mobile : sans elle, « Se
            connecter » existerait dans la page sans que personne puisse le
            toucher. Sur grand écran, elle arrive avec le reste. */}
        <BoutonCarnet mobile />
        <LienCompte className="cg-cnx" />
      </div>
    </header>
    <BarreBas actif={actif} cache={cache && !ouvert} />
    </>
  );
}

/* Sur téléphone, les rubriques à portée de pouce, comme dans une application. */
const BAS = [
  { label: "Économie", href: "/economie", Icone: TrendingUp },
  { label: "Démographie", href: "/demographie", Icone: Users },
  { label: "Conflits", href: "/conflits", Icone: Swords },
  { label: "Ressources", href: "/ressources", Icone: Wheat },
  { label: "Articles", href: "/articles", Icone: Newspaper },
];

function BarreBas({ actif, cache }: { actif?: string; cache: boolean }) {
  const chemin = usePathname() ?? "";
  const estActif = (label: string, href: string) =>
    actif === label || chemin === href || chemin.startsWith(`${href}/`) || (href === "/articles" && chemin.startsWith("/dette-publique"));
  return (
    <nav className={`cg-bas${cache ? " cg-bas-cache" : ""}`} aria-label="Rubriques principales">
      {BAS.map(({ label, href, Icone }) => (
        <Link key={href} href={href} className={estActif(label, href) ? "on" : undefined} aria-current={estActif(label, href) ? "page" : undefined}>
          <Icone size={19} strokeWidth={1.9} aria-hidden="true" />
          <span>{label}</span>
        </Link>
      ))}
    </nav>
  );
}

/* Le pied de page : la marque, puis quatre colonnes qui mènent à chaque page de fond du site, et toutes les pages
   légales. C'est aussi le maillage que suivent les moteurs : aucune page importante n'est à plus d'un clic. */
const PIED: { titre: string; liens: [string, string][] }[] = [
  { titre: "Explorer", liens: [["Économie", "/economie"], ["Démographie", "/demographie"], ["Conflits", "/conflits"], ["Ressources", "/ressources"], ["Classements", "/classements"], ["Pays", "/pays"]] },
  { titre: "Apprendre", liens: [["Articles", "/articles"], ["Dette publique", "/dette-publique"], ["Comparer des pays", "/comparer"], ["Forum", "/forum"], ["Mon carnet", "/carnet"]] },
  { titre: "Datlas", liens: [["À propos", "/a-propos"], ["Méthodologie", "/methodologie"], ["Sources", "/sources"], ["Contact", "/contact"], ["Plan du site", "/plan-du-site"]] },
  { titre: "Informations légales", liens: [["Mentions légales", "/mentions-legales"], ["Confidentialité", "/confidentialite"], ["Cookies", "/cookies"], ["CGU", "/cgu"], ["Modération", "/moderation"], ["Accessibilité", "/accessibilite"]] },
];

export function Pied() {
  return (
    <footer className="cg-pied">
      <div className="cg-wrap cg-pied-in cg-pied-grand">
        <div className="cg-pied-tete">
          <a href="/" className="cg-pied-marque">
            <MarqueDatlas />
            Datlas
          </a>
          <p className="cg-pied-devise">Maîtriser le monde, en jouant avec ses chiffres. Des données publiques, sourcées et datées, gratuites et sans publicité.</p>
        </div>
        <div className="cg-pied-cols">
          {PIED.map((c) => (
            <nav key={c.titre} className="cg-pied-col" aria-label={c.titre}>
              <p>{c.titre}</p>
              {c.liens.map(([l, h]) => (
                <Link key={h} href={h} prefetch={false}>{l}</Link>
              ))}
            </nav>
          ))}
        </div>
        <div className="cg-pied-bas">
          <span>© {new Date().getFullYear()} Datlas</span>
          <span>Sources : Banque mondiale, FMI, Nations Unies, FAO, INSEE, Eurostat</span>
        </div>
      </div>
    </footer>
  );
}

/** La marque de Datlas : un D dont la panse est un globe, et un point de donnée en orbite. La même que l'icône de l'onglet (src/app/icon.svg). */
export function MarqueDatlas() {
  const id = `cg-marque-${useId().replace(/:/g, "")}`;
  return (
    <span className="cg-logo-m" aria-hidden="true">
      <svg viewBox="0 0 64 64" width="100%" height="100%">
        <defs>
          <mask id={id}>
            <path d="M14 12h15a20 20 0 0 1 0 40H14z" fill="#fff" />
            <g stroke="#000" strokeWidth="3" fill="none" strokeLinecap="round" className="cg-marque-g">
              <path d="M22 25h30M22 39h30" />
              <path d="M29 12.5a9 19.5 0 0 1 0 39" />
            </g>
          </mask>
        </defs>
        <rect width="64" height="64" fill="#fff" mask={`url(#${id})`} />
        <circle cx="50" cy="14" r="5" fill="#ff8fc7" stroke="#fff" strokeWidth="2" className="cg-marque-o" />
      </svg>
    </span>
  );
}

/** L'entrée du carnet, dans la barre : un marque-page, et le nombre de cartes à revoir aujourd'hui. */
function BoutonCarnet({ mobile = false }: { mobile?: boolean }) {
  const [n, setN] = useState(0);
  useEffect(() => {
    const lire = () => setN(lireLocal().filter((e) => e.type === "traduction" && aReviser(e)).length);
    lire();
    const fin = surChangement(lire);
    const t = window.setInterval(lire, 60_000);
    return () => { fin(); window.clearInterval(t); };
  }, []);
  const titre = n ? `Mon carnet : ${n} carte${n > 1 ? "s" : ""} à revoir` : "Mon carnet";
  return (
    <Link href="/carnet" className={`cg-jour cg-carnet${mobile ? " cg-carnet-mob" : ""}`} title={titre} aria-label={titre}>
      <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" strokeLinecap="round">
        <path d="M6 3.5h12v17l-6-4-6 4z" />
      </svg>
      {n > 0 && <b className="cg-carnet-n">{n > 99 ? "99+" : n}</b>}
    </Link>
  );
}
