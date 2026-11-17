"use client";

import { useEffect, useMemo, useState } from "react";
import type { FeatureCollection } from "geojson";
import { MapContainer, TileLayer, CircleMarker, Tooltip, Polyline, GeoJSON, ZoomControl, ScaleControl, useMap } from "react-leaflet";
import L from "leaflet";
import { PAYS_MO, lieuMO, statutMO, typeRelationMO, type DossierMO, type RelationMO, ATLAS_MO } from "@/data/conflits/moyenOrient";

/* ═══════════════════════════════════════════════════════════════════════════
   LA CARTE DE L'ATLAS DU MOYEN-ORIENT (Leaflet, rendue côté client seulement)

   Des repères géographiques civils (centres de villes, passages, centres de régions) et des liens explicatifs entre dossiers.
   Aucune position de troupe, aucun front, aucune trajectoire : les liens sont des courbes en pointillé, sans flèche, et le disent.
   ═══════════════════════════════════════════════════════════════════════════ */

const CADRE: L.LatLngBoundsExpression = [[11, 29], [39, 60]];
const PAR_NE = Object.fromEntries(Object.entries(PAYS_MO).map(([code, p]) => [p.ne, code]));

/** Un arc léger entre deux repères : il se lit comme un lien, pas comme un itinéraire. */
function arc(a: [number, number], b: [number, number]): [number, number][] {
  const [y1, x1] = a;
  const [y2, x2] = b;
  const mx = (x1 + x2) / 2;
  const my = (y1 + y2) / 2;
  const d = Math.hypot(x2 - x1, y2 - y1);
  const cx = mx - ((y2 - y1) / (d || 1)) * d * 0.22;
  const cy = my + ((x2 - x1) / (d || 1)) * d * 0.22;
  return Array.from({ length: 25 }, (_, i) => {
    const t = i / 24;
    return [(1 - t) * (1 - t) * y1 + 2 * (1 - t) * t * cy + t * t * y2, (1 - t) * (1 - t) * x1 + 2 * (1 - t) * t * cx + t * t * x2];
  });
}

function Cadrage({ points }: { points: [number, number][] }) {
  const carte = useMap();
  const cle = points.map((p) => p.join(",")).join("|");
  useEffect(() => {
    if (points.length > 1) carte.flyToBounds(L.latLngBounds(points), { padding: [56, 56], maxZoom: 7, duration: 0.8 });
    else if (points.length === 1) carte.flyTo(points[0], 7, { duration: 0.8 });
    else carte.flyToBounds(CADRE, { duration: 0.8 });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [carte, cle]);
  return null;
}

export default function CarteMoyenOrient({
  visibles, choisi, relations, nuit, onDossier,
}: {
  visibles: DossierMO[];
  choisi: DossierMO | null;
  relations: RelationMO[];
  nuit: boolean;
  onDossier: (id: string) => void;
}) {
  const [pays, setPays] = useState<FeatureCollection | null>(null);
  useEffect(() => {
    let vivant = true;
    fetch("/geo/ne_50m_countries.simplified.geojson").then((r) => r.json()).then((g) => vivant && setPays(g)).catch(() => {});
    return () => { vivant = false; };
  }, []);

  const lieuxVisibles = useMemo(() => {
    const ids = new Set(visibles.flatMap((c) => c.placeIds));
    return ATLAS_MO.places.filter((p) => ids.has(p.id));
  }, [visibles]);
  const cadrage = useMemo<[number, number][]>(
    () => (choisi ? choisi.placeIds.map((id) => lieuMO(id)).filter(Boolean).map((p) => [p!.lat, p!.lng] as [number, number]) : []),
    [choisi],
  );
  /* Les pays des dossiers visibles : on les colore légèrement, on les rend cliquables. */
  const parCode = useMemo(() => {
    const m = new Map<string, DossierMO[]>();
    for (const c of visibles) for (const code of c.countries) m.set(code, [...(m.get(code) ?? []), c]);
    return m;
  }, [visibles]);

  return (
    <div className="mo-carte" role="region" aria-label="Carte des repères et des liens entre les conflits du Moyen-Orient">
      <MapContainer bounds={CADRE} minZoom={3} maxZoom={11} zoomControl={false} scrollWheelZoom={false} className="mo-leaflet" attributionControl>
        <TileLayer
          key={nuit ? "nuit" : "jour"}
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url={`https://{s}.basemaps.cartocdn.com/${nuit ? "dark_all" : "light_all"}/{z}/{x}/{y}{r}.png`}
        />
        <ZoomControl position="topleft" />
        <ScaleControl position="bottomright" imperial={false} />
        {pays && (
          <GeoJSON
            key={`${visibles.map((c) => c.id).join("-")}|${choisi?.id ?? ""}`}
            data={pays}
            style={(f) => {
              const code = PAR_NE[String(f?.properties?.name ?? "")];
              const l = code ? parCode.get(code) : undefined;
              const actif = !!l && (!choisi || choisi.countries.includes(code));
              return { color: actif ? "#6a3fe0" : "transparent", weight: actif ? 1.2 : 0, fillColor: "#8f6bf7", fillOpacity: actif ? (choisi ? 0.2 : 0.12) : 0 };
            }}
            onEachFeature={(f, couche) => {
              const code = PAR_NE[String(f.properties?.name ?? "")];
              const l = code ? parCode.get(code) : undefined;
              if (!l?.length) return;
              couche.bindTooltip(`${PAYS_MO[code].fr} · ${l.length} dossier${l.length > 1 ? "s" : ""}`, { sticky: true, className: "mo-tip" });
              couche.on("click", (e: L.LeafletMouseEvent) => {
                if (l.length === 1) return onDossier(l[0].id);
                const boite = document.createElement("div");
                boite.className = "mo-choix";
                const t = document.createElement("b");
                t.textContent = `${PAYS_MO[code].fr} : choisir un dossier`;
                boite.append(t);
                for (const c of l) {
                  const b = document.createElement("button");
                  b.type = "button";
                  b.textContent = c.shortTitle;
                  b.onclick = () => { onDossier(c.id); couche.closePopup(); };
                  boite.append(b);
                }
                couche.bindPopup(boite, { className: "mo-pop" }).openPopup(e.latlng);
              });
            }}
          />
        )}
        <Cadrage points={cadrage} />
        {relations.map((r) => {
          const a = lieuMO(r.fromPlaceId);
          const b = lieuMO(r.toPlaceId);
          if (!a || !b) return null;
          return (
            <Polyline key={r.id} positions={arc([a.lat, a.lng], [b.lat, b.lng])} pathOptions={{ color: nuit ? "#c4b2ff" : "#5b2de0", weight: 2, opacity: 0.8, dashArray: "2 7", lineCap: "round" }}>
              <Tooltip sticky className="mo-tip">
                <b>{typeRelationMO(r.type)}</b> · {r.label}
                <br />
                <em>Lien explicatif entre deux dossiers, pas un trajet.</em>
              </Tooltip>
            </Polyline>
          );
        })}
        {lieuxVisibles.map((p) => {
          const lies = visibles.filter((c) => c.placeIds.includes(p.id));
          const dans = !choisi || lies.some((c) => c.id === choisi.id);
          const st = statutMO((choisi && dans ? choisi : lies[0])?.status ?? "");
          return (
            <CircleMarker
              key={p.id}
              center={[p.lat, p.lng]}
              radius={p.precision === "city_center" ? 6 : 8}
              pathOptions={{ color: "#fff", weight: 2, fillColor: st.couleur, fillOpacity: dans ? 0.95 : 0.25, opacity: dans ? 1 : 0.4, dashArray: p.precision === "city_center" ? undefined : "3 3" }}
              eventHandlers={{ click: () => lies[0] && onDossier(choisi && lies.some((c) => c.id === choisi.id) ? choisi.id : lies[0].id) }}
            >
              <Tooltip direction="top" offset={[0, -6]} className="mo-tip">
                <b>{p.name}</b>
                <br />
                {lies.map((c) => c.shortTitle).join(" · ")}
              </Tooltip>
            </CircleMarker>
          );
        })}
      </MapContainer>
    </div>
  );
}
