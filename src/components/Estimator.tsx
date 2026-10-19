"use client";

import { useRef, useState } from "react";
import DemoForm from "@/components/DemoForm";
import { advise, PLANS, type Advice, type PlanFit } from "@/lib/estimate";
import { FILE_ACCEPT, SUPPORTED, summarizeFiles, type FileStat } from "@/lib/extract";
import { countWords } from "@/lib/wordcount";
import { CTA } from "@/lib/seo";

type Source = "url" | "files";
type PageStat = { url: string; strings: number; newWords: number };
type Result = {
  source: Source;
  label: string;
  pages?: PageStat[];
  files?: FileStat[];
  clientRendered?: boolean;
  truncated?: boolean;
  strings: number;
  words: number;
  advice: Advice;
};

const MAX_FILES = 10;
const MAX_FILE_BYTES = 10 * 1024 * 1024;

const n = (v: number) => v.toLocaleString("en-US");
const price = (p: PlanFit) => (p.monthlyPrice === null ? "Custom" : `$${p.monthlyPrice}/mo`);
const words = (p: PlanFit) => (p.wordsPerMonth < 0 ? "per contract" : n(p.wordsPerMonth));
const langs = (p: PlanFit) => (p.maxLanguages < 0 ? "unlimited" : String(p.maxLanguages));
const planName = (code: string | null) => PLANS.find((p) => p.code === code)?.name ?? code ?? "";

export default function Estimator({ initialSource }: { initialSource: Source }) {
  const [source, setSource] = useState<Source>(initialSource);
  const [url, setUrl] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [languages, setLanguages] = useState("5");
  const [updatePct, setUpdatePct] = useState("10");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<Result | null>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  const run = async () => {
    const langCount = Math.max(1, Math.min(100, Math.floor(Number(languages)) || 1));
    const rate = Math.min(100, Math.max(1, Number(updatePct) || 10)) / 100;
    setError("");
    setResult(null);
    try {
      if (source === "url") {
        if (!url.trim()) return setError("Enter the site address.");
        setBusy(true);
        const res = await fetch("/api/estimate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url, languages: langCount, updateRate: rate }),
        });
        const data = await res.json().catch(() => ({ error: "Couldn't read the site" }));
        if (!res.ok) return setError(data.error ?? "Couldn't read the site");
        setResult(data as Result);
      } else {
        if (!files.length) return setError("Choose at least one file.");
        const tooBig = files.find((f) => f.size > MAX_FILE_BYTES);
        if (tooBig) return setError(`${tooBig.name} is larger than 10 MB.`);
        setBusy(true);
        const read = await Promise.all(files.map(async (f) => ({ name: f.name, content: await f.text() })));
        const sum = summarizeFiles(read, countWords);
        setResult({
          source: "files",
          label: files.length === 1 ? files[0].name : `${files.length} files`,
          files: sum.files,
          strings: sum.strings,
          words: sum.words,
          advice: advise(sum.words, langCount, rate),
        });
      }
      requestAnimationFrame(() => resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
    } finally {
      setBusy(false);
    }
  };

  const tab = (id: Source, label: string) => (
    <button
      type="button"
      onClick={() => {
        setSource(id);
        setResult(null);
        setError("");
      }}
      aria-pressed={source === id}
      className={`rounded-lg border px-4 py-2 text-sm transition-colors ${
        source === id
          ? "border-lime/60 bg-lime/[0.08] font-semibold text-white"
          : "border-line text-muted hover:border-line-strong hover:text-white"
      }`}
    >
      {label}
    </button>
  );

  const input =
    "w-full rounded-lg border border-line-strong bg-white/[0.03] px-4 py-3 text-white transition-colors placeholder:text-faint outline-none focus:border-lime";

  return (
    <>
      <div className="mt-10 rounded-2xl border border-line bg-panel p-5 sm:p-7">
        <div className="flex flex-wrap gap-2">
          {tab("files", "Localization files")}
          {tab("url", "Website")}
        </div>

        {source === "url" ? (
          <div className="mt-6">
            <label htmlFor="est-url" className="text-sm text-muted">Site address</label>
            <input
              id="est-url"
              className={`${input} mt-2`}
              placeholder="your-casino.com"
              inputMode="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !busy && run()}
            />
            <p className="mt-2 text-xs text-faint">
              We read up to 25 pages of the site, the way the web SDK would. Text a game shows inside
              the engine isn&apos;t on its website — for that, count your string tables.
            </p>
          </div>
        ) : (
          <div className="mt-6">
            <label className="flex cursor-pointer flex-col items-center justify-center gap-1 rounded-xl border border-dashed border-line-strong px-4 py-8 text-center transition-colors hover:border-lime/60">
              <span className="font-semibold">
                {files.length ? `${files.length} file${files.length > 1 ? "s" : ""} selected` : "Choose files"}
              </span>
              <span className="text-xs text-faint">
                {files.length ? files.map((f) => f.name).join(", ") : `Source-language files: ${SUPPORTED}`}
              </span>
              <input
                type="file"
                multiple
                accept={FILE_ACCEPT}
                className="sr-only"
                onChange={(e) => setFiles([...(e.target.files ?? [])].slice(0, MAX_FILES))}
              />
            </label>
            <p className="mt-2 text-xs text-faint">
              Counted in your browser — the files aren&apos;t uploaded anywhere. Unity string tables
              export to CSV; Unreal to PO.
            </p>
          </div>
        )}

        <div className="mt-6 grid gap-4 sm:grid-cols-[1fr_1fr_auto] sm:items-end">
          <div>
            <label htmlFor="est-langs" className="text-sm text-muted">Target languages</label>
            <input
              id="est-langs"
              type="number"
              min={1}
              max={100}
              className={`${input} mt-2`}
              value={languages}
              onChange={(e) => setLanguages(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="est-rate" className="text-sm text-muted">Text that changes per month, %</label>
            <input
              id="est-rate"
              type="number"
              min={1}
              max={100}
              className={`${input} mt-2`}
              value={updatePct}
              onChange={(e) => setUpdatePct(e.target.value)}
            />
          </div>
          <button
            type="button"
            onClick={run}
            disabled={busy}
            className="rounded-lg bg-lime px-6 py-3 font-semibold text-black transition hover:bg-lime-dim active:scale-[0.98] disabled:opacity-60"
          >
            {busy ? (source === "url" ? "Reading the site…" : "Counting…") : "Count words"}
          </button>
        </div>
        {error && (
          <p role="alert" className="mt-4 rounded-lg border border-red-400/30 bg-red-400/10 px-4 py-3 text-sm text-red-200">
            {error}
          </p>
        )}
      </div>

      <div ref={resultRef} className="scroll-mt-24">
        {result && <ResultView r={result} />}
      </div>

      <div id="apply" className="mt-10 scroll-mt-24 rounded-3xl border border-line-strong bg-white/[0.02] px-6 py-12 text-center">
        <h2 className="h-display text-3xl sm:text-4xl">{CTA}</h2>
        <p className="mx-auto mt-4 max-w-lg text-muted">
          {result
            ? "Send the estimate with your application — we'll localize a slice of your product with you and confirm the plan on real numbers."
            : "We're onboarding a small group of studios for closed pilots. Bring your build and a few assets — we'll localize a slice of it with you."}
        </p>
        <DemoForm key={result ? summaryOf(result) : ""} initialNote={result ? summaryOf(result) : ""} />
      </div>
    </>
  );
}

/** One line for the pilot application note. */
function summaryOf(r: Result): string {
  const a = r.advice;
  return (
    `Estimate (${r.label}): ${n(r.words)} source words, ${a.languages} languages, ` +
    `~${n(a.monthlyWords)} words/mo → ${a.recommended.name}.`
  );
}

function ResultView({ r }: { r: Result }) {
  const a = r.advice;
  const rec = a.recommended;
  const pct = Math.round(a.updateRate * 100);

  return (
    <section aria-label="Estimate" className="mt-8 space-y-6">
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <Stat label="Words in the source" value={n(r.words)} />
        <Stat label="Unique strings" value={n(r.strings)} />
        <Stat label={`First translation · ${a.languages} lang.`} value={n(a.initialWords)} />
        <Stat label={`Monthly updates · ${pct}%`} value={n(a.monthlyWords)} />
      </div>
      <p className="text-xs leading-relaxed text-faint">
        Words of the source text, counted once per target language. Markup, placeholders and bare
        numbers don&apos;t count; repeated strings count once.
        {r.source === "url" &&
          ` Read ${r.pages?.length ?? 0} page${r.pages?.length === 1 ? "" : "s"} of ${r.label}${
            r.truncated ? " (stopped at the page limit — larger sites have more)" : ""
          }.`}
      </p>

      {r.clientRendered && (
        <p className="rounded-xl border border-amber-300/30 bg-amber-300/10 px-5 py-4 text-sm text-amber-100">
          This site builds its text in the browser, so a scan from our side sees little of it. The
          count will be low — the exact number comes from the web SDK once it runs on your pages.
        </p>
      )}

      <div className="rounded-2xl border border-lime/50 bg-lime/[0.06] p-6">
        <p className="font-mono text-[11px] tracking-widest text-lime">RECOMMENDED PLAN</p>
        <p className="mt-2 flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <span className="h-display text-3xl">{rec.name}</span>
          <span className="text-sm text-muted">
            {price(rec)} · {rec.wordsPerMonth < 0 ? "volume per contract" : `${n(rec.wordsPerMonth)} words / mo`} ·{" "}
            {rec.maxLanguages < 0 ? "unlimited languages" : `up to ${rec.maxLanguages} languages`}
          </span>
        </p>
        <ul className="mt-4 space-y-2 text-sm text-white/85">
          <li>
            Monthly updates: about <strong>{n(a.monthlyWords)} words</strong> ({pct}% of {n(r.words)} words ×{" "}
            {a.languages} languages)
            {rec.custom
              ? a.limitedBy === "languages"
                ? ` — more languages than Studio's ${PLANS[1].maxLanguages}.`
                : ` — more than Studio's ${n(PLANS[1].wordsPerMonth)} a month.`
              : ` — within ${rec.name}'s ${n(rec.wordsPerMonth)}.`}
          </li>
          <li>
            First full translation: <strong>{n(a.initialWords)} words</strong>
            {a.initialMonths === null
              ? "."
              : a.startOnPlan
                ? ` — about ${a.initialMonths} months of ${rec.name}'s quota; ${planName(a.startOnPlan)} covers it in one month, then switch to ${rec.name}.`
                : ` — fits in the first month of ${rec.name}.`}
          </li>
        </ul>
        <p className="mt-4 text-xs text-muted">
          Launch pricing. Pilot participants lock in 50% off for 12 months.
        </p>
      </div>

      <div className="rounded-2xl border border-line bg-panel p-6">
        <h2 className="font-semibold">All plans for this volume</h2>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[480px] text-left text-sm">
            <thead>
              <tr className="font-mono text-[11px] tracking-widest text-faint">
                <th className="pb-2 font-normal">PLAN</th>
                <th className="pb-2 font-normal">PRICE</th>
                <th className="pb-2 font-normal">WORDS / MO</th>
                <th className="pb-2 font-normal">LANGUAGES</th>
                <th className="pb-2 font-normal">FITS</th>
              </tr>
            </thead>
            <tbody>
              {a.plans.map((p) => {
                const fits = p.fitsMonthly && p.fitsLanguages;
                return (
                  <tr key={p.code} className={`border-t border-line ${p.code === rec.code ? "text-white" : "text-muted"}`}>
                    <td className="py-2.5 font-semibold">{p.name}</td>
                    <td className="py-2.5">{price(p)}</td>
                    <td className="py-2.5 font-mono">{words(p)}</td>
                    <td className="py-2.5 font-mono">{langs(p)}</td>
                    <td className="py-2.5">
                      {fits ? (
                        <span className="text-lime">✓</span>
                      ) : (
                        <span className="text-faint">✕ {p.fitsLanguages ? "words" : "languages"}</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {!!(r.pages?.length || r.files?.length) && (
        <details className="group rounded-2xl border border-line bg-panel p-6">
          <summary className="flex cursor-pointer list-none items-center justify-between font-semibold">
            {r.source === "url" ? `Pages read (${r.pages?.length})` : `Files (${r.files?.length})`}
            <span className="text-lime transition-transform group-open:rotate-45">+</span>
          </summary>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[480px] text-left text-sm text-muted">
              <thead>
                <tr className="font-mono text-[11px] tracking-widest text-faint">
                  <th className="pb-2 font-normal">{r.source === "url" ? "PAGE" : "FILE"}</th>
                  <th className="pb-2 font-normal">STRINGS</th>
                  <th className="pb-2 font-normal">{r.source === "url" ? "NEW WORDS" : "WORDS"}</th>
                </tr>
              </thead>
              <tbody>
                {r.source === "url"
                  ? r.pages?.map((p) => (
                      <tr key={p.url} className="border-t border-line">
                        <td className="max-w-[420px] truncate py-2 pr-4">{p.url}</td>
                        <td className="py-2 font-mono">{n(p.strings)}</td>
                        <td className="py-2 font-mono">{n(p.newWords)}</td>
                      </tr>
                    ))
                  : r.files?.map((f) => (
                      <tr key={f.name} className="border-t border-line">
                        <td className="py-2 pr-4">{f.name}</td>
                        <td className="py-2 font-mono">{n(f.strings)}</td>
                        <td className="py-2 font-mono">{n(f.words)}</td>
                      </tr>
                    ))}
              </tbody>
            </table>
          </div>
        </details>
      )}
    </section>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-line bg-panel px-4 py-4">
      <p className="text-xs text-faint">{label}</p>
      <p className="h-display mt-2 text-2xl sm:text-3xl">{value}</p>
    </div>
  );
}
