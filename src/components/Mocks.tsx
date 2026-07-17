/* Presentational game mockups rendered in two languages for the split demos.
   The game NAME ("SHADOW REALM") stays intact in both — the UI strings localize.
   That's the "brand & titles preserved" story, shown visually. */

type Lang = "en" | "ja";

/** A neutral device/window frame around a mockup. */
export function Frame({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="overflow-hidden rounded-xl border border-line-strong bg-[#0e0d14]">
      <div className="flex items-center gap-2 border-b border-line px-3 py-2">
        <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
        <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
        <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
        <span className="ml-3 font-mono text-[11px] text-white/50">{label}</span>
      </div>
      {children}
    </div>
  );
}

// CJK-safe stack so the Japanese side renders on any OS.
const jp = {
  fontFamily:
    "'Yu Gothic','Hiragino Kaku Gothic ProN','Noto Sans JP','Meiryo',system-ui,sans-serif",
};
const langStyle = (lang: Lang) => (lang === "ja" ? jp : undefined);

const GAME = {
  en: {
    speaker: "ELDER",
    line: "Choose your destiny, traveler.",
    menu: ["Play", "Continue", "Settings", "Quit"],
  },
  ja: {
    speaker: "長老",
    // Must stay identical to the voice sample + the generated audio clip
    // (public/audio/elder-ja.mp3) — this is Snapling's actual output for the EN
    // line. One string, one translation: the product's own promise.
    line: "旅人よ、汝の運命を選べ。",
    menu: ["プレイ", "つづきから", "設定", "終了"],
  },
} as const;

/** A stylized game main-menu screen. */
export function GameUI({ lang }: { lang: Lang }) {
  const t = GAME[lang];
  return (
    <div
      className="relative flex h-[380px] flex-col justify-between overflow-hidden p-6 text-white"
      style={{ background: "radial-gradient(120% 90% at 30% 0%, #24304a 0%, #12101f 55%, #0b0910 100%)" }}
    >
      {/* Title (game name — preserved in both languages) */}
      <div className="flex items-center gap-2">
        <span className="text-lg text-lime">◆</span>
        <span className="font-display text-2xl font-extrabold tracking-tight">SHADOW REALM</span>
      </div>

      {/* Dialogue box */}
      <div className="rounded-xl border border-white/15 bg-black/45 p-4 backdrop-blur">
        <p className="font-mono text-[10px] tracking-widest text-lime">{t.speaker}</p>
        <p className="mt-1 text-lg" style={langStyle(lang)}>
          {t.line}
        </p>
      </div>

      {/* Menu */}
      <div className="grid grid-cols-2 gap-2">
        {t.menu.map((m, i) => (
          <div
            key={i}
            className={`rounded-lg px-4 py-2.5 text-center text-sm font-semibold ${
              i === 0 ? "bg-lime text-black" : "border border-white/15 bg-white/5 text-white/90"
            }`}
            style={langStyle(lang)}
          >
            {m}
          </div>
        ))}
      </div>
    </div>
  );
}

/** A compact combat scene with a "Charge" action button — the visual context
    that disambiguates the word (attack, not battery/payment). */
export function BattleButton() {
  return (
    <div
      className="relative flex h-full min-h-[220px] flex-col justify-between overflow-hidden rounded-xl border border-line p-4 text-white"
      style={{ background: "radial-gradient(120% 90% at 50% 0%, #2a1c34 0%, #17101f 55%, #0b0910 100%)" }}
    >
      <div className="flex items-center justify-between font-mono text-[10px] tracking-widest text-white/60">
        <span>BATTLE · TURN 3</span>
        <span className="text-red-400">ENEMY HP 45/60</span>
      </div>
      <div className="flex items-center justify-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-lime/40 bg-black/30 text-2xl">
          👾
        </div>
      </div>
      <div className="flex items-center justify-center gap-2 rounded-lg bg-red-600 px-4 py-2.5 font-semibold shadow-lg">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <path d="m3 21 6-6M14.5 4.5 20 10l-9 9-5.5-5.5 9-9zM14.5 4.5 18 1l5 5-3.5 3.5" />
        </svg>
        Charge
      </div>
    </div>
  );
}

/** A localized game menu with two deliberate defects boxed, as Auto-LQA flags them. */
export function LqaShot() {
  return (
    <div
      className="relative overflow-hidden rounded-xl border border-line-strong p-6 text-white"
      style={{ background: "linear-gradient(135deg, #1a2233 0%, #12101f 60%, #0b0910 100%)" }}
    >
      <p className="font-display text-xl font-extrabold tracking-tight">HAUPTMENÜ</p>
      <div className="mt-6 space-y-5">
        <div className="w-56 rounded-lg bg-[#4a6bd8] px-4 py-2 text-sm font-semibold">Neues Spiel</div>

        {/* OVERFLOW: text spills past the button; boxed red */}
        <div className="relative w-44">
          <div className="w-44 rounded-lg bg-[#4a6bd8] px-4 py-2 text-sm font-semibold">
            <span className="whitespace-nowrap">Spielstand fortsetzen und laden</span>
          </div>
          <Defect color="#ef4444" label="Overflow" className="-inset-1" />
        </div>

        {/* UNTRANSLATED: English on a German screen; boxed amber */}
        <div className="relative w-56">
          <div className="w-56 rounded-lg bg-[#4a6bd8] px-4 py-2 text-sm font-semibold">Settings</div>
          <Defect color="#f59e0b" label="Untranslated" className="-inset-1" />
        </div>

        <div className="w-56 rounded-lg bg-[#4a6bd8] px-4 py-2 text-sm font-semibold">Beenden</div>
      </div>
    </div>
  );
}

function Defect({ color, label, className = "" }: { color: string; label: string; className?: string }) {
  return (
    <div
      className={`pointer-events-none absolute rounded ${className}`}
      style={{ border: `2px solid ${color}`, boxShadow: "0 0 0 1px rgba(0,0,0,.4)" }}
    >
      <span
        className="absolute -top-4 left-0 rounded px-1 text-[10px] font-medium text-black"
        style={{ background: color }}
      >
        {label}
      </span>
    </div>
  );
}

const STORE = {
  en: {
    headline: "EPIC QUESTS AWAIT",
    sub: "Battle. Explore. Conquer.",
    badge: "NOW FREE",
    cta: "DOWNLOAD",
  },
  ja: {
    headline: "壮大な冒険が待つ",
    sub: "戦え。探索せよ。征服せよ。",
    badge: "無料",
    cta: "ダウンロード",
  },
} as const;

/** A store screenshot / promo creative, rendered per language. */
export function StoreCreative({ lang }: { lang: Lang }) {
  const t = STORE[lang];
  return (
    <div
      className="relative h-64 w-full overflow-hidden p-6 text-white"
      style={{ background: "linear-gradient(135deg, #2a2140 0%, #171029 50%, #0d0b12 100%)" }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm font-semibold">
          <span className="text-lime">◆</span> SHADOW REALM
        </div>
        <span className="rounded-md bg-lime px-2 py-0.5 text-[11px] font-bold text-black" style={langStyle(lang)}>
          {t.badge}
        </span>
      </div>
      <p className="mt-8 font-display text-3xl font-extrabold tracking-tight" style={langStyle(lang)}>
        {t.headline}
      </p>
      <p className="mt-2 text-sm text-white/70" style={langStyle(lang)}>
        {t.sub}
      </p>
      <span
        className="mt-5 inline-block rounded-lg bg-lime px-5 py-2 text-sm font-bold text-black"
        style={langStyle(lang)}
      >
        {t.cta}
      </span>
    </div>
  );
}
