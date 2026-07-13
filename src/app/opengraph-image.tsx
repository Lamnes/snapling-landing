import { ImageResponse } from "next/og";

export const alt = "Snapling — AI Game Localization: Text & Voice";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const BARS = [18, 34, 52, 30, 62, 44, 74, 40, 58, 28, 46, 20];

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#1C1C1C",
          padding: "72px",
          fontFamily: "sans-serif",
        }}
      >
        {/* Brand */}
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 64,
              height: 64,
              borderRadius: 16,
              background: "#CBFB60",
              color: "#0a0b0a",
              fontSize: 44,
              fontWeight: 800,
            }}
          >
            S
          </div>
          <div style={{ color: "#f4f4f1", fontSize: 40, fontWeight: 700 }}>Snapling</div>
        </div>

        {/* Headline */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ color: "#f4f4f1", fontSize: 82, fontWeight: 800, lineHeight: 1.04 }}>
            AI Game Localization
          </div>
          <div style={{ color: "#CBFB60", fontSize: 82, fontWeight: 800, lineHeight: 1.04 }}>
            Text &amp; Voice
          </div>
          <div style={{ display: "flex", color: "#a6a6a0", fontSize: 32, marginTop: 22 }}>
            UI, voiceover &amp; store creatives — in any language.
          </div>
        </div>

        {/* Voice + language chips */}
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, height: 80 }}>
            {BARS.map((h, i) => (
              <div
                key={i}
                style={{ display: "flex", width: 8, height: h, borderRadius: 4, background: "#CBFB60" }}
              />
            ))}
          </div>
          <div style={{ display: "flex", color: "#f4f4f1", fontSize: 26, marginLeft: 8 }}>EN</div>
          <div style={{ display: "flex", color: "#CBFB60", fontSize: 30 }}>→</div>
          <div
            style={{
              display: "flex",
              padding: "10px 22px",
              borderRadius: 999,
              background: "#CBFB60",
              color: "#0a0b0a",
              fontSize: 26,
              fontWeight: 700,
            }}
          >
            JA — localized voice
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
