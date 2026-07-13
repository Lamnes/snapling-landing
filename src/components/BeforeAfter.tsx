"use client";

import { useRef, useState, type ReactNode } from "react";

/**
 * Draggable before/after split. `left` (source) sits in flow and defines the
 * size; `right` (localized) is overlaid and clipped to reveal from the handle.
 * Both children should render the SAME layout in two languages.
 */
export default function BeforeAfter({
  left,
  right,
  leftLabel,
  rightLabel,
  className = "",
}: {
  left: ReactNode;
  right: ReactNode;
  leftLabel: string;
  rightLabel: string;
  className?: string;
}) {
  const [pos, setPos] = useState(50);
  const wrap = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  const moveTo = (clientX: number) => {
    const el = wrap.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    let p = ((clientX - r.left) / r.width) * 100;
    p = Math.max(0, Math.min(100, p));
    setPos(p);
  };

  return (
    <div
      ref={wrap}
      className={`relative select-none touch-none overflow-hidden ${className}`}
      onPointerDown={(e) => {
        dragging.current = true;
        try {
          e.currentTarget.setPointerCapture(e.pointerId);
        } catch {
          /* ignore — not all pointer sources support capture */
        }
        moveTo(e.clientX);
      }}
      onPointerMove={(e) => dragging.current && moveTo(e.clientX)}
      onPointerUp={() => (dragging.current = false)}
      onPointerCancel={() => (dragging.current = false)}
    >
      {/* Source (in flow → defines height) */}
      <div>{left}</div>

      {/* Localized (overlay, clipped to the right of the handle) */}
      <div className="absolute inset-0" style={{ clipPath: `inset(0 0 0 ${pos}%)` }}>
        {right}
      </div>

      {/* Labels */}
      <span className="absolute left-3 top-3 z-20 rounded-md bg-black/70 px-2 py-1 font-mono text-[10px] tracking-wide text-white/80 backdrop-blur">
        {leftLabel}
      </span>
      <span className="absolute right-3 top-3 z-20 rounded-md bg-lime/90 px-2 py-1 font-mono text-[10px] tracking-wide text-black">
        {rightLabel}
      </span>

      {/* Divider + handle */}
      <div className="absolute inset-y-0 z-20 -translate-x-1/2" style={{ left: `${pos}%` }}>
        <div className="mx-auto h-full w-px bg-lime/70" />
        <button
          aria-label="Drag to compare"
          className="absolute top-1/2 left-1/2 flex h-9 w-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-lime/60 bg-ink/90 text-lime shadow-lg backdrop-blur"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M8 7 4 11l4 4" />
            <path d="M4 11h16" />
            <path d="m16 17 4-4-4-4" />
          </svg>
        </button>
      </div>
    </div>
  );
}
