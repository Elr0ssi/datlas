import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Datlas · Maîtriser le monde, en jouant avec ses chiffres";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const MARQUE =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#4318d1"/><stop offset=".55" stop-color="#6d3df5"/><stop offset="1" stop-color="#a77bff"/></linearGradient><mask id="m"><path d="M7 6h9a10 10 0 0 1 0 20H7z" fill="#fff"/><rect x="12" y="15" width="16" height="2" fill="#000"/><ellipse cx="17.5" cy="16" rx="4.5" ry="11" fill="none" stroke="#000" stroke-width="2"/></mask></defs><rect width="32" height="32" rx="8" fill="url(#g)"/><rect width="32" height="32" fill="#fff" mask="url(#m)"/><circle cx="25.5" cy="6.5" r="3.25" fill="#ff6fb5" stroke="#fff" stroke-width="1.5"/></svg>'
  );

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "center",
          padding: "0 96px",
          background: "linear-gradient(135deg, #0a0912 0%, #1b1240 60%, #3a1d8a 100%)",
          fontFamily: "system-ui, sans-serif",
          color: "#f5f3ff",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          {/* La marque, la même que l'icône de l'onglet (src/app/icon.svg). */}
          <img src={MARQUE} width={76} height={76} alt="" />
          <div style={{ fontSize: 56, fontWeight: 800, letterSpacing: -2 }}>Datlas</div>
        </div>
        <div style={{ marginTop: 48, fontSize: 84, fontWeight: 800, letterSpacing: -3, lineHeight: 1.02 }}>
          Maîtriser le monde, en jouant avec ses chiffres.
        </div>
        <div style={{ marginTop: 28, fontSize: 32, color: "#bdb8da" }}>
          PIB, dette, chômage, population : plus de 200 pays, sourcés.
        </div>
      </div>
    ),
    { ...size },
  );
}
