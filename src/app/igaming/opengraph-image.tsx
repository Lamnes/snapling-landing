import { ImageResponse } from "next/og";

export const alt = "Snapling — iGaming Localization: Compliance-Grade Translation for Casinos";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const MARKETS = ["DE", "ES", "PT", "FR", "TR"];

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
          <div
            style={{
              display: "flex",
              marginLeft: 12,
              padding: "8px 18px",
              borderRadius: 999,
              border: "1px solid rgba(255,255,255,0.2)",
              color: "#CBFB60",
              fontSize: 22,
              letterSpacing: 2,
            }}
          >
            iGAMING
          </div>
        </div>

        {/* Headline */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ color: "#f4f4f1", fontSize: 78, fontWeight: 800, lineHeight: 1.04 }}>
            Localization that
          </div>
          <div style={{ color: "#CBFB60", fontSize: 78, fontWeight: 800, lineHeight: 1.04 }}>
            sees your casino
          </div>
          <div style={{ display: "flex", color: "#a6a6a0", fontSize: 32, marginTop: 22 }}>
            Context-aware translation + automated LQA for regulated markets.
          </div>
        </div>

        {/* One source → five markets */}
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ display: "flex", color: "#f4f4f1", fontSize: 26 }}>EN</div>
          <div style={{ display: "flex", color: "#CBFB60", fontSize: 30 }}>→</div>
          {MARKETS.map((m) => (
            <div
              key={m}
              style={{
                display: "flex",
                padding: "10px 20px",
                borderRadius: 999,
                background: m === "DE" ? "#CBFB60" : "rgba(255,255,255,0.06)",
                border: m === "DE" ? "none" : "1px solid rgba(255,255,255,0.16)",
                color: m === "DE" ? "#0a0b0a" : "#f4f4f1",
                fontSize: 26,
                fontWeight: 700,
              }}
            >
              {m}
            </div>
          ))}
        </div>
      </div>
    ),
    { ...size }
  );
}
