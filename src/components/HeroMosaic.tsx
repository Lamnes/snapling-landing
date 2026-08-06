"use client";

import { useEffect, useRef } from "react";

/* ============================================================
   Snapling — hero "Living Mosaic" background
   Multilingual glyph tiles (one 'sound' across scripts) that
   breathe and flip near the cursor. Container-sized, pauses
   when scrolled out of view, static under reduced-motion.
   Tuned to the landing brand: ink #0a0b0a + lime #cbfb60,
   tiles echo the panel grays.
   ============================================================ */

const PALETTE = ["#101010", "#161616", "#1c1c1c", "#232323", "#2a2a2a"];
const ACCENT = { r: 203, g: 251, b: 96 }; // lime #cbfb60
const CELL = 46;
const GAP = 2;
const GLYPH_SHARE = 0.28;
const FLIP_DUR = 0.35;
const FLIP_COOLDOWN = 1.1;

const GLYPH_SETS: string[][] = [
  ["A", "А", "あ", "ア", "아", "अ", "α", "א", "Ա", "ა", "অ"],
  ["B", "Б", "ば", "バ", "바", "ब", "β", "ב", "Բ", "ბ"],
  ["S", "С", "す", "ス", "스", "س", "σ", "ש", "Ս", "ს"],
  ["N", "Н", "ん", "ナ", "น", "ν", "נ", "Ն", "ნ", "ন"],
  ["K", "К", "か", "カ", "ก", "κ", "כ", "Կ", "კ", "க"],
  ["M", "М", "ま", "マ", "م", "μ", "מ", "Մ", "მ", "ம"],
  ["E", "Е", "え", "エ", "ε", "é", "Ե", "ე"],
  ["T", "Т", "た", "タ", "θ", "ת", "Տ", "த"],
  ["L", "Л", "ら", "ラ", "ล", "λ", "ל", "Լ", "ல"],
  ["R", "Р", "ら", "ラ", "ร", "ρ", "ר", "Ռ", "ர"],
  ["D", "Д", "だ", "ダ", "د", "δ", "ד", "Դ", "დ"],
  ["P", "П", "ぱ", "パ", "π", "פ", "Պ", "პ"],
  ["G", "Г", "が", "ガ", "γ", "ג", "Գ", "გ"],
  ["H", "Х", "は", "ハ", "ه", "ח", "Հ", "ჰ"],
  ["文", "字", "言", "語", "译", "訳", "词", "語"],
  ["한", "글", "말", "번", "역", "언", "어"],
  ["ñ", "ß", "ø", "ü", "ç", "å", "æ", "œ", "ё"],
  ["و", "ع", "ف", "ق", "ش", "خ"],
  ["ह", "ि", "म", "य", "र", "ल"],
  ["せ", "つ", "ね", "ふ", "ゆ", "を"],
  ["ሀ", "ለ", "መ", "ሰ", "በ", "ተ"],
  ["Ω", "Ψ", "Φ", "Σ", "Δ", "Λ"],
];

type Rgb = { r: number; g: number; b: number };
function hexToRgb(h: string): Rgb {
  return { r: parseInt(h.slice(1, 3), 16), g: parseInt(h.slice(3, 5), 16), b: parseInt(h.slice(5, 7), 16) };
}
const STOPS = PALETTE.map(hexToRgb);
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const mixRgb = (a: Rgb, b: Rgb, t: number): Rgb => ({ r: lerp(a.r, b.r, t), g: lerp(a.g, b.g, t), b: lerp(a.b, b.b, t) });
function paletteAt(v: number): Rgb {
  const x = Math.min(0.9999, Math.max(0, v)) * (STOPS.length - 1);
  const i = Math.floor(x);
  return mixRgb(STOPS[i], STOPS[i + 1], x - i);
}

type Glyph = { set: string[]; idx: number; prog: number; flipping: boolean; swapped: boolean; cooldown: number };
type Tile = { x: number; y: number; base: number; phase: number; speed: number; glyph: Glyph | null };

export default function HeroMosaic() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const s = {
      tiles: [] as Tile[],
      pointer: { x: -9999, y: -9999 },
      reduced: window.matchMedia("(prefers-reduced-motion: reduce)").matches,
      lastT: 0,
      cell: CELL,
      inView: true,
      running: false,
    };

    function buildGrid() {
      const rect = wrap!.getBoundingClientRect();
      const W = Math.max(1, Math.round(rect.width));
      const H = Math.max(1, Math.round(rect.height));
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas!.width = W * dpr;
      canvas!.height = H * dpr;
      canvas!.style.width = W + "px";
      canvas!.style.height = H + "px";
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);

      const cell = W < 640 ? 40 : CELL;
      const cols = Math.ceil(W / cell) + 1;
      const rows = Math.ceil(H / cell) + 1;
      s.cell = cell;
      s.tiles = [];
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const offset = r % 2 ? cell / 2 : 0;
          const hasGlyph = Math.random() < GLYPH_SHARE;
          const set = GLYPH_SETS[(Math.random() * GLYPH_SETS.length) | 0];
          s.tiles.push({
            x: c * cell - offset,
            y: r * cell,
            base: 0.12 + Math.random() * 0.5,
            phase: Math.random() * Math.PI * 2,
            speed: 0.35 + Math.random() * 0.5,
            glyph: hasGlyph
              ? { set, idx: (Math.random() * set.length) | 0, prog: 0, flipping: false, swapped: false, cooldown: 0 }
              : null,
          });
        }
      }
    }

    let raf = 0;
    function frame(now: number) {
      if (!s.running) return;
      const t = now / 1000;
      const dt = s.lastT ? Math.min(t - s.lastT, 0.05) : 0.016;
      s.lastT = t;
      const rect = wrap!.getBoundingClientRect();
      const w = rect.width;
      const h = rect.height;
      ctx!.clearRect(0, 0, w, h);

      const cell = s.cell;
      const size = cell - GAP;
      const fontPx = Math.round(cell * 0.5);
      ctx!.textAlign = "center";
      ctx!.textBaseline = "middle";

      for (const tile of s.tiles) {
        const tx = tile.x + cell / 2;
        const ty = tile.y + cell / 2;

        let v = tile.base;
        if (!s.reduced) v += Math.sin(t * tile.speed + tile.phase) * 0.05;

        let glow = 0;
        if (!s.reduced) {
          const dx = tx - s.pointer.x;
          const dy = ty - s.pointer.y;
          const d2 = dx * dx + dy * dy;
          const R = 150;
          if (d2 < R * R) {
            glow = Math.pow(1 - Math.sqrt(d2) / R, 2) * 0.9;
            if (tile.glyph && d2 < 65 * 65 && !tile.glyph.flipping && t > tile.glyph.cooldown) {
              tile.glyph.flipping = true;
              tile.glyph.prog = 0;
              tile.glyph.swapped = false;
            }
          }
        }

        let col = paletteAt(v);
        if (glow > 0) col = mixRgb(col, ACCENT, glow * 0.16);

        ctx!.fillStyle = `rgb(${col.r | 0},${col.g | 0},${col.b | 0})`;
        ctx!.beginPath();
        ctx!.roundRect(tile.x + GAP / 2, tile.y + GAP / 2, size, size, 4);
        ctx!.fill();

        if (tile.glyph) {
          const g = tile.glyph;
          if (g.flipping && !s.reduced) {
            g.prog += dt / FLIP_DUR;
            if (g.prog >= 0.5 && !g.swapped) {
              g.idx = (g.idx + 1) % g.set.length;
              g.swapped = true;
            }
            if (g.prog >= 1) {
              g.prog = 0;
              g.flipping = false;
              g.cooldown = t + FLIP_COOLDOWN;
            }
          }
          const scaleX = g.flipping ? Math.abs(Math.cos(Math.PI * g.prog)) : 1;
          const hot = g.flipping ? 1 : glow;
          const gc = mixRgb({ r: 235, g: 235, b: 232 }, ACCENT, hot);
          const alpha = 0.22 + hot * 0.7;

          ctx!.save();
          ctx!.translate(tx, ty);
          ctx!.scale(Math.max(scaleX, 0.02), 1);
          ctx!.font = `500 ${fontPx}px ui-sans-serif, system-ui, sans-serif`;
          ctx!.fillStyle = `rgba(${gc.r | 0},${gc.g | 0},${gc.b | 0},${alpha})`;
          ctx!.fillText(g.set[g.idx], 0, 1);
          ctx!.restore();
        }
      }

      if (s.reduced) {
        s.running = false;
        return;
      }
      raf = requestAnimationFrame(frame);
    }

    function start() {
      if (s.running) return;
      s.running = true;
      s.lastT = 0;
      raf = requestAnimationFrame(frame);
    }
    function stop() {
      s.running = false;
      cancelAnimationFrame(raf);
    }

    buildGrid();
    // draw one frame immediately (also the only frame under reduced-motion)
    start();

    const ro = new ResizeObserver(() => {
      buildGrid();
      if (s.reduced) start();
    });
    ro.observe(wrap);

    const io = new IntersectionObserver(
      ([e]) => {
        s.inView = e.isIntersecting;
        if (s.inView && !s.reduced) start();
        else if (!s.inView) stop();
      },
      { threshold: 0 },
    );
    io.observe(wrap);

    const onMove = (e: PointerEvent) => {
      const r = canvas!.getBoundingClientRect();
      s.pointer.x = e.clientX - r.left;
      s.pointer.y = e.clientY - r.top;
    };
    const onLeave = () => {
      s.pointer.x = -9999;
      s.pointer.y = -9999;
    };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerleave", onLeave);

    return () => {
      stop();
      ro.disconnect();
      io.disconnect();
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <div ref={wrapRef} aria-hidden className="absolute inset-0">
      <canvas ref={canvasRef} className="block h-full w-full" />
    </div>
  );
}
