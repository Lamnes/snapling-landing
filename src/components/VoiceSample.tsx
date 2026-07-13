"use client";

import { useRef, useState } from "react";

const BARS = [10, 22, 38, 26, 48, 34, 60, 40, 54, 30, 44, 24, 52, 32, 18];

// Real samples generated through Snapling (seed-audio, ONE voice across every
// language) — see public/audio/. Each localized clip is the EN line translated
// and re-voiced. Same speaker, new language.
const SOURCE = { label: "EN — original", src: "/audio/elder-en.mp3", line: "Choose your destiny, traveler." };

type Locale = { short: string; name: string; src: string; line: string };
const LOCALES: Record<string, Locale> = {
  ja: { short: "JA", name: "日本語", src: "/audio/elder-ja.mp3", line: "旅人よ、汝の運命を選べ。" },
  es: { short: "ES", name: "Español", src: "/audio/elder-es.mp3", line: "Elige tu destino, viajero." },
  zh: { short: "ZH", name: "中文", src: "/audio/elder-zh.mp3", line: "旅者，选择你的命运。" },
};
const ORDER = ["ja", "es", "zh"];

type Which = "src" | "loc";

/**
 * Voice-localization sample with a language switcher: play the original English
 * line, then the same voice re-voiced in the chosen language. Real audio,
 * generated through Snapling.
 */
export default function VoiceSample() {
  const [lang, setLang] = useState("ja");
  const [playing, setPlaying] = useState<Which | null>(null);
  const srcRef = useRef<HTMLAudioElement | null>(null);
  const locRef = useRef<HTMLAudioElement | null>(null);

  const stopAll = () => {
    for (const el of [srcRef.current, locRef.current]) {
      if (el) { el.pause(); el.currentTime = 0; }
    }
    setPlaying(null);
  };

  const toggle = (which: Which) => {
    const el = which === "src" ? srcRef.current : locRef.current;
    const other = which === "src" ? locRef.current : srcRef.current;
    if (other) { other.pause(); other.currentTime = 0; }
    if (!el) return;
    if (playing === which) { el.pause(); setPlaying(null); }
    else { el.currentTime = 0; void el.play(); setPlaying(which); }
  };

  const pickLang = (code: string) => {
    if (code === lang) return;
    stopAll();
    setLang(code);
  };

  const loc = LOCALES[lang];

  return (
    <div className="rounded-xl border border-line bg-panel/60 p-4">
      <div className="flex items-center justify-between">
        <span className="font-mono text-[10px] tracking-widest text-faint">VOICE LOCALIZATION</span>
        <span className="font-mono text-[10px] tracking-wide text-lime">same voice, new language</span>
      </div>

      {/* Language switcher */}
      <div className="mt-3 flex items-center gap-2">
        <span className="font-mono text-[10px] tracking-wide text-faint">LOCALIZE TO</span>
        <div className="flex gap-1">
          {ORDER.map((code) => (
            <button
              key={code}
              onClick={() => pickLang(code)}
              className={`rounded-md px-2.5 py-1 text-xs font-semibold transition ${
                lang === code ? "bg-lime text-black" : "border border-line text-white/70 hover:text-white"
              }`}
            >
              {LOCALES[code].short}
            </button>
          ))}
        </div>
      </div>

      {/* Tracks */}
      <div className="mt-3 space-y-2.5">
        <Track
          active={playing === "src"}
          label={SOURCE.label}
          onToggle={() => toggle("src")}
        />
        <Track
          active={playing === "loc"}
          label={`${loc.short} — localized`}
          onToggle={() => toggle("loc")}
        />
      </div>

      <p className="mt-3 text-[11px] leading-relaxed text-faint">
        “{SOURCE.line}” <span className="text-white/45">→ {loc.line}</span>
      </p>

      {/* Audio elements. The localized src follows the switcher; key forces a
          reload so the new clip is ready to play. */}
      <audio ref={srcRef} src={SOURCE.src} preload="none" onEnded={() => setPlaying(null)} />
      <audio key={lang} ref={locRef} src={loc.src} preload="none" onEnded={() => setPlaying(null)} />

      <style>{`@keyframes snapWave { from { transform: scaleY(0.35); } to { transform: scaleY(1.3); } }`}</style>
    </div>
  );
}

function Track({ active, label, onToggle }: { active: boolean; label: string; onToggle: () => void }) {
  return (
    <div className="flex items-center gap-3">
      <button
        onClick={onToggle}
        aria-label={active ? `Pause ${label}` : `Play ${label}`}
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-lime text-black transition hover:bg-lime-dim"
      >
        {active ? (
          <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
            <rect x="6" y="5" width="4" height="14" rx="1" />
            <rect x="14" y="5" width="4" height="14" rx="1" />
          </svg>
        ) : (
          <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
            <path d="M7 5l12 7-12 7V5z" />
          </svg>
        )}
      </button>

      <div className="flex h-8 flex-1 items-center gap-[3px]">
        {BARS.map((h, i) => (
          <span
            key={i}
            className={`w-[3px] rounded-full ${active ? "bg-lime/80" : "bg-lime/25"}`}
            style={{
              height: `${h}%`,
              animation: active ? `snapWave 900ms ease-in-out ${i * 55}ms infinite alternate` : "none",
            }}
          />
        ))}
      </div>

      <span className="w-24 text-right font-mono text-[10px] tracking-wide text-faint">{label}</span>
    </div>
  );
}
