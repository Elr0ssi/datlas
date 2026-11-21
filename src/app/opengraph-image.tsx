import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Datlas · Maîtriser le monde, en jouant avec ses chiffres";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const MARQUE =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><defs><linearGradient id="f" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#4a1fd0"/><stop offset=".6" stop-color="#7c4dff"/><stop offset="1" stop-color="#b48cff"/></linearGradient><mask id="m"><path d="M14 12h15a20 20 0 0 1 0 40H14z" fill="#fff"/><g stroke="#000" stroke-width="3" fill="none" stroke-linecap="round"><path d="M22 25h30M22 39h30"/><path d="M29 12.5a9 19.5 0 0 1 0 39"/></g></mask></defs><rect width="64" height="64" rx="16" fill="url(#f)"/><rect width="64" height="64" fill="#fff" mask="url(#m)"/><circle cx="50" cy="14" r="5" fill="#ff8fc7" stroke="#fff" stroke-width="2"/></svg>',
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
