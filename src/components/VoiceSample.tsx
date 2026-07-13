"use client";

import { useState } from "react";

const BARS = [10, 22, 38, 26, 48, 34, 60, 40, 54, 30, 44, 24, 52, 32, 18];

/**
 * Illustrative voice-localization demo: a play toggle that animates a waveform
 * to convey "original → localized voice". Visual only (no audio in the mock);
 * real samples are wired in with client assets.
 */
export default function VoiceSample({
  from = "EN — original",
  to = "JA — localized voice",
}: {
  from?: string;
  to?: string;
}) {
  const [playing, setPlaying] = useState(false);

  return (
    <div className="rounded-xl border border-line bg-panel/60 p-4">
      <div className="flex items-center gap-3">
        <button
          onClick={() => setPlaying((p) => !p)}
          aria-label={playing ? "Pause voice sample" : "Play voice sample"}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-lime text-black transition hover:bg-lime-dim"
        >
          {playing ? (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <rect x="6" y="5" width="4" height="14" rx="1" />
              <rect x="14" y="5" width="4" height="14" rx="1" />
            </svg>
          ) : (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M7 5l12 7-12 7V5z" />
            </svg>
          )}
        </button>

        {/* Waveform */}
        <div className="flex h-10 flex-1 items-center gap-[3px]">
          {BARS.map((h, i) => (
            <span
              key={i}
              className="w-[3px] rounded-full bg-lime/70"
              style={{
                height: `${h}%`,
                animation: playing ? `snapWave 900ms ease-in-out ${i * 60}ms infinite alternate` : "none",
              }}
            />
          ))}
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between font-mono text-[10px] tracking-wide text-faint">
        <span>{from}</span>
        <span className="text-lime">→ {to}</span>
      </div>

      <style>{`@keyframes snapWave { from { transform: scaleY(0.4); } to { transform: scaleY(1.25); } }`}</style>
    </div>
  );
}
