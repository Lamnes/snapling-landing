"use client";

import { useRef, useState } from "react";

const BARS = [10, 22, 38, 26, 48, 34, 60, 40, 54, 30, 44, 24, 52, 32, 18];

type Key = "en" | "ja";
type Track = { key: Key; label: string; src: string; line: string };

// Real samples generated through Snapling (seed-audio, one voice across both
// languages) — see public/audio/. The JA clip is the EN line translated + re-voiced.
const TRACKS: Track[] = [
  { key: "en", label: "EN — original", src: "/audio/elder-en.mp3", line: "Choose your destiny, traveler." },
  { key: "ja", label: "JA — localized", src: "/audio/elder-ja.mp3", line: "旅人よ、汝の運命を選べ。" },
];

/**
 * Voice-localization sample: play the original English line, then the same voice
 * re-voiced in Japanese. Real audio, generated through Snapling.
 */
export default function VoiceSample() {
  const [playing, setPlaying] = useState<Key | null>(null);
  const refs = useRef<Record<Key, HTMLAudioElement | null>>({ en: null, ja: null });

  const toggle = (key: Key) => {
    const other: Key = key === "en" ? "ja" : "en";
    const otherEl = refs.current[other];
    if (otherEl) {
      otherEl.pause();
      otherEl.currentTime = 0;
    }
    const el = refs.current[key];
    if (!el) return;
    if (playing === key) {
      el.pause();
      setPlaying(null);
    } else {
      el.currentTime = 0;
      void el.play();
      setPlaying(key);
    }
  };

  return (
    <div className="rounded-xl border border-line bg-panel/60 p-4">
      <div className="flex items-center justify-between">
        <span className="font-mono text-[10px] tracking-widest text-faint">VOICE LOCALIZATION</span>
        <span className="font-mono text-[10px] tracking-wide text-lime">same voice, new language</span>
      </div>

      <div className="mt-3 space-y-2.5">
        {TRACKS.map((t) => {
          const active = playing === t.key;
          return (
            <div key={t.key} className="flex items-center gap-3">
              <button
                onClick={() => toggle(t.key)}
                aria-label={active ? `Pause ${t.label}` : `Play ${t.label}`}
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

              <span className="w-24 text-right font-mono text-[10px] tracking-wide text-faint">{t.label}</span>
              <audio
                ref={(el) => { refs.current[t.key] = el; }}
                src={t.src}
                preload="none"
                onEnded={() => setPlaying(null)}
              />
            </div>
          );
        })}
      </div>

      <p className="mt-3 text-[11px] leading-relaxed text-faint">
        “{TRACKS[0].line}” <span className="text-white/45">→ {TRACKS[1].line}</span>
      </p>

      <style>{`@keyframes snapWave { from { transform: scaleY(0.35); } to { transform: scaleY(1.3); } }`}</style>
    </div>
  );
}
