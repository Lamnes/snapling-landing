import type { Metadata } from "next";
import Header from "@/components/Header";
import type { NavItem } from "@/components/Header";
import { Logo } from "@/components/Header";
import { Frame } from "@/components/Mocks";
import DemoForm from "@/components/DemoForm";
import DemoVideo from "@/components/DemoVideo";
import { siteName, CTA } from "@/lib/seo";

/* ---------------- SEO ---------------- */

const pageTitle =
  "Snapling — iGaming Localization: Compliance-Grade Translation for Casinos";
const pageDescription =
  "Casino localization that sees the screen: every UI string translated with the screenshot it lives on, every localized screen checked for truncated or untranslated compliance text. Context-aware translation + automated LQA for regulated markets.";

export const metadata: Metadata = {
  title: pageTitle,
  description: pageDescription,
  alternates: { canonical: "/igaming" },
  openGraph: {
    type: "website",
    url: "/igaming",
    siteName,
    title: "Snapling — Localization that sees your casino",
    description:
      "Context-aware casino translation + automated LQA. The wrong word on a button and a cut-off 18+ line are license risks — Snapling catches both before a regulator does.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Snapling — Localization that sees your casino",
    description:
      "Context-aware casino translation + automated LQA for regulated markets.",
  },
};

/* FAQ — on-page section + FAQPage JSON-LD (mirrors the main page's pattern). */
const igamingFaqs: { q: string; a: string }[] = [
  {
    q: "How do you handle responsible-gambling and compliance text?",
    a: "Compliance strings — 18+ notices, responsible-gambling lines, terms — are localized like any other string, and then automated LQA verifies them on the final screens. Truncated, cut-off or untranslated compliance text is flagged so a build with a broken RG line doesn't ship.",
  },
  {
    q: "Which markets and languages do you cover?",
    a: "Any language the pipeline supports. The live demo ships one English casino into German, Spanish, Portuguese, French and Turkish in a single run. Adding a market is a pipeline run against your existing keys, not a new localization project.",
  },
  {
    q: "Do you support web casinos or game engines?",
    a: "Both. Casino lobbies and web games use the web SDK; game clients built in Unity, Unreal or Flutter use the native SDKs. The contract is the same everywhere: fetch localized text by asset key.",
  },
  {
    q: "Will our brand and game names survive translation?",
    a: "Yes. Brand names and game titles are recognized and locked — in the live demo, \"LuckySpin\" and every slot title (Golden Spin, Aztec Fortune and the rest) stay untranslated across all five languages, and numbers and currency formats are preserved.",
  },
  {
    q: "How does the pilot work?",
    a: "We're onboarding a small group of teams for closed pilots. Bring a slice of your casino — a lobby, one game, a set of screens. We localize it with you into your markets and hand back the LQA report. Pilot participants lock in 50% off launch pricing for 12 months.",
  },
];

function igamingFaqJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: igamingFaqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}

function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

/* ---------------- Page ---------------- */

const NAV: NavItem[] = [
  { label: "Live demo", href: "#demo" },
  { label: "Visual context", href: "#context" },
  { label: "Auto-LQA", href: "#lqa" },
  { label: "Pricing", href: "#pricing" },
  { label: "For game studios", href: "/" },
];

export default function IGaming() {
  return (
    <div id="top">
      <JsonLd data={igamingFaqJsonLd()} />
      <Header nav={NAV} />
      <main id="main">
        <Hero />
        <MarketTicker />
        <Stakes />
        <LiveDemo />
        <ContextProof />
        <LqaGate />
        <Markets />
        <Pitch />
        <WhoFor />
        <PricingStrip />
        <Faq />
        <FinalCta />
      </main>
      <Footer />
    </div>
  );
}

/* ---------------- Hero ---------------- */

function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="glow pointer-events-none absolute inset-x-0 top-0 h-[520px]" />
      <div
        aria-hidden
        className="grid-band pointer-events-none absolute inset-x-0 top-0 h-[520px] [mask-image:radial-gradient(70%_70%_at_50%_0%,black,transparent)]"
      />
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-6 pt-16 pb-20 lg:grid-cols-2 lg:pt-24">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-line bg-white/[0.03] px-3 py-1.5 font-mono text-[11px] tracking-wide text-lime">
            <span className="h-1.5 w-1.5 rounded-full bg-lime" />
            CLOSED PILOT — ONBOARDING NOW
          </span>
          <h1 className="h-display mt-6 text-balance text-5xl sm:text-6xl">
            Localization that <span className="text-lime">sees your casino</span>.
          </h1>
          <p className="mt-6 max-w-md text-pretty text-lg leading-relaxed text-muted">
            You ship into dozens of regulated markets — and blind translation tools pick the wrong
            word for a button and miss the compliance line a regulator reads. Snapling translates
            every string with the screen it lives on, then verifies every localized screen.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href="#contact" className="rounded-lg bg-lime px-5 py-3 font-semibold text-black transition hover:bg-lime-dim active:scale-[0.98]">
              {CTA} →
            </a>
            <a href="#demo" className="rounded-lg border border-line-strong px-5 py-3 font-semibold text-white/90 transition hover:bg-white/5 active:scale-[0.98]">
              Watch it localize
            </a>
          </div>
          <p className="mt-8 font-mono text-xs text-faint">
            <span className="text-lime">→</span> snapling.t(&quot;win.gamble&quot;, &quot;de&quot;) · &quot;Spielen&quot;
          </p>
        </div>

        <div className="relative space-y-4">
          <Frame label="LuckySpin — win screen">
            <WinScreen />
          </Frame>
          <div className="flex items-center gap-3 rounded-xl border border-line bg-panel px-4 py-3">
            <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-lime" />
            <p className="font-mono text-xs text-muted">
              49 strings localized end-to-end · DE ES PT FR TR · live pipeline output
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

/** The slot WIN screen where "Gamble" is a double-or-nothing button — the
    visual context that makes German "Spielen" right and "Glücksspiel" wrong. */
function WinScreen() {
  return (
    <div
      className="relative flex h-[340px] flex-col justify-between overflow-hidden px-6 pb-6 pt-12 text-white"
      style={{ background: "radial-gradient(120% 90% at 50% 0%, #23204a 0%, #141129 55%, #0b0910 100%)" }}
    >
      {/* Brand — locked, never translated */}
      <div className="flex items-center justify-between">
        <span className="font-display text-lg font-extrabold tracking-tight">
          <span className="text-[#f5c451]">Lucky</span>Spin
        </span>
        <span className="font-mono text-[10px] tracking-widest text-white/50">GOLDEN SPIN</span>
      </div>

      {/* Win banner */}
      <div className="text-center">
        <p className="font-mono text-[11px] tracking-[0.3em] text-[#f5c451]">BIG WIN</p>
        <p className="h-display mt-1 text-4xl text-white">$1,250.00</p>
      </div>

      {/* The two buttons — Collect vs Gamble (double or nothing) */}
      <div>
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-lg bg-[#f5c451] px-4 py-2.5 text-center text-sm font-bold text-[#2a1c00]">
            COLLECT
          </div>
          <div className="relative rounded-lg border-2 border-lime bg-white/5 px-4 py-2.5 text-center text-sm font-bold text-white">
            GAMBLE
            <span className="absolute -top-3 right-2 rounded bg-lime px-1.5 py-0.5 font-mono text-[9px] font-medium tracking-wide text-black">
              win.gamble
            </span>
          </div>
        </div>
        <p className="mt-3 text-center font-mono text-[11px] text-lime">
          &quot;Gamble&quot; → &quot;Spielen&quot; · usedContext: true
        </p>
      </div>
    </div>
  );
}

/* ---------------- Market ticker ---------------- */

function MarketTicker() {
  const markets = ["Deutsch", "Español", "Português", "Français", "Türkçe"];
  return (
    <section className="grid-band border-y border-line bg-white/[0.015]">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-8 gap-y-3 px-6 py-5">
        <span className="font-mono text-[11px] tracking-widest text-faint">ONE SOURCE, EVERY MARKET</span>
        {markets.map((m) => (
          <span key={m} className="font-display text-lg font-bold text-white/80">
            {m}
          </span>
        ))}
      </div>
    </section>
  );
}

/* ---------------- The stakes ---------------- */

function Stakes() {
  return (
    <Section id="stakes">
      <Eyebrow>The stakes</Eyebrow>
      <H2>A cut-off 18+ line isn&apos;t a typo. It&apos;s a license risk.</H2>
      <Lead>
        Regulators read your screens. Responsible-gambling notices, age limits, deposit terms — if
        localization truncates them or leaves them in English, the text your license requires simply
        isn&apos;t there. In gaming that&apos;s a bad review; in iGaming it&apos;s a finding.
      </Lead>

      <div className="mt-10 grid gap-px overflow-hidden rounded-2xl border border-line bg-line lg:grid-cols-2">
        {/* A real Auto-LQA finding — the truncated RG notice */}
        <div className="bg-ink p-6">
          <p className="font-mono text-[11px] tracking-widest text-faint">
            REAL AUTO-LQA FINDING — GERMAN CASINO SCREEN
          </p>
          <div className="relative mt-5">
            <div className="rounded-lg border border-white/10 bg-black/40 px-4 py-3">
              <p className="text-sm text-white/80">
                Spiele verantwortungsbewusst. Glücksspiel kann süchtig ma…
              </p>
            </div>
            <div
              className="pointer-events-none absolute -inset-1 rounded"
              style={{ border: "2px solid #ef4444", boxShadow: "0 0 0 1px rgba(0,0,0,.4)" }}
            >
              <span className="absolute -top-4 left-0 rounded bg-[#ef4444] px-1 text-[10px] font-medium text-black">
                Truncation · critical
              </span>
            </div>
          </div>
          <p className="mt-6 text-sm leading-relaxed text-muted">
            The responsible-gambling notice, cut off mid-word. A human LQA pass sees it on screen 40
            of 200 — or doesn&apos;t. Auto-LQA boxed it and marked it critical.
          </p>
        </div>

        <SourcedStat
          value="76%"
          body="of consumers prefer to buy products with information in their own language — 40% won't buy from sites in another language."
          source="CSA Research, 8,709 consumers / 29 countries"
          href="https://csa-research.com/l/media/Consumers-Prefer-their-Own-Language"
        />
      </div>
    </Section>
  );
}

/* ---------------- Live demo ---------------- */

function LiveDemo() {
  const langs = ["de", "es", "pt", "fr", "tr"] as const;
  return (
    <Section id="demo">
      <Eyebrow>Live demo</Eyebrow>
      <H2>Watch a casino localize itself</H2>
      <Lead>
        LuckySpin is our demo casino: 49 UI strings pushed through the live pipeline — initialize,
        translate, manifest — into five markets. This is the product running, not a concept reel.
      </Lead>

      <div className="mx-auto mt-10 max-w-4xl">
        <Frame label="LuckySpin — EN source → 5 markets · live pipeline">
          <DemoVideo />
        </Frame>
        <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
          <p className="font-mono text-xs text-faint">
            49 strings · 5 markets · real product output
          </p>
          <a
            href="/demo/casino.html"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg bg-lime px-5 py-3 font-semibold text-black transition hover:bg-lime-dim active:scale-[0.98]"
          >
            Open the live demo →
          </a>
        </div>
        <p className="mt-3 font-mono text-xs text-faint">
          jump straight to a market:{" "}
          {langs.map((l, i) => (
            <span key={l}>
              {i > 0 && " · "}
              <a
                href={`/demo/casino.html?lang=${l}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-lime underline decoration-line underline-offset-4 transition-colors hover:text-lime-dim"
              >
                {l.toUpperCase()}
              </a>
            </span>
          ))}
        </p>
      </div>
    </Section>
  );
}

/* ---------------- Visual context proof ---------------- */

function ContextProof() {
  return (
    <Section id="context">
      <Eyebrow>Visual context</Eyebrow>
      <H2>One word away from the wrong term</H2>
      <Lead>
        &quot;Gamble&quot; on a slot WIN screen is a button: double or nothing. A blind tool
        translates the word. Snapling translates the screen. Both outputs below are real.
      </Lead>
      <div className="mt-12 grid gap-4 lg:grid-cols-2">
        {/* Blind */}
        <div className="rounded-2xl border border-line bg-panel p-6">
          <p className="font-mono text-[11px] tracking-widest text-faint">TRANSLATED BLIND</p>
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-2 rounded-lg border border-line bg-black/40 px-3 py-2">
              <span className="font-mono text-xs text-faint">string</span>
              <span className="font-semibold">&quot;Gamble&quot;</span>
            </span>
            <span className="text-faint">→</span>
            <span className="rounded-lg border border-red-400/40 px-3 py-2 font-semibold text-red-400">
              &quot;Glücksspiel&quot;
            </span>
          </div>
          <p className="mt-5 text-sm leading-relaxed text-muted">
            The regulated word for the gambling <em>activity</em> — the term in every German
            compliance text. Correct in a dictionary, wrong on a double-or-nothing button.
          </p>
          <p className="mt-5 font-mono text-xs text-red-400">usedContext: false</p>
        </div>

        {/* With the screenshot */}
        <div className="rounded-2xl border border-lime/50 bg-lime/[0.06] p-6">
          <p className="font-mono text-[11px] tracking-widest text-lime">WITH THE SCREENSHOT</p>
          <div className="mt-4 grid grid-cols-[1fr_auto] items-center gap-4">
            <div className="grid grid-cols-2 gap-2">
              <span className="rounded-lg bg-[#f5c451] px-3 py-2 text-center text-xs font-bold text-[#2a1c00]">
                COLLECT
              </span>
              <span className="rounded-lg border border-white/25 bg-white/5 px-3 py-2 text-center text-xs font-bold text-white">
                GAMBLE
              </span>
            </div>
            <div className="text-center">
              <p className="font-mono text-[11px] text-faint">resolved</p>
              <p className="mt-1 text-2xl font-semibold">Spielen</p>
              <p className="text-sm text-lime">the action ✓</p>
            </div>
          </div>
          <p className="mt-5 text-sm leading-relaxed text-white/80">
            The model sees <span className="font-semibold">Collect</span> next to it on a WIN screen
            — so it translates the action, and steers clear of the regulated term.
          </p>
          <p className="mt-5 font-mono text-xs text-lime">usedContext: true</p>
        </div>
      </div>
      <p className="mt-4 text-center text-sm text-faint">
        <span className="font-mono">usedContext</span> is a field on the real API response — you can
        audit which strings were translated with the screen.
      </p>
    </Section>
  );
}

/* ---------------- Auto-LQA = the compliance gate ---------------- */

function LqaGate() {
  const findings = [
    {
      tag: "TRUNCATION",
      critical: true,
      text: "Spiele verantwortungsbewusst. Glücksspiel kann süchtig ma…",
      note: "Responsible-gambling notice cut off mid-word.",
    },
    {
      tag: "UNTRANSLATED",
      critical: false,
      text: "Terms & Conditions",
      note: "English left on a German screen.",
    },
    {
      tag: "UNTRANSLATED",
      critical: false,
      text: "Deposit",
      note: "English left on a German screen.",
    },
  ];
  return (
    <Section id="lqa">
      <Eyebrow>Auto-LQA</Eyebrow>
      <H2>The compliance gate</H2>
      <Lead>
        Upload localized screenshots and Snapling boxes what&apos;s broken — per screen, per
        language. Below: a real run over German casino screens. Six issues, four critical, and the
        worst one is exactly the line a regulator checks.
      </Lead>

      <div className="mt-12 grid items-start gap-8 lg:grid-cols-[1.1fr_1fr]">
        {/* The report */}
        <Frame label="lqa/de — casino screens · report">
          <div className="bg-[#0e0d14] p-6">
            <div className="flex flex-wrap items-end gap-x-8 gap-y-3">
              <div>
                <p className="h-display text-4xl">6</p>
                <p className="mt-1 font-mono text-[11px] tracking-widest text-faint">ISSUES</p>
              </div>
              <div>
                <p className="h-display text-4xl text-red-400">4</p>
                <p className="mt-1 font-mono text-[11px] tracking-widest text-faint">CRITICAL</p>
              </div>
              <div className="ml-auto flex flex-wrap gap-2">
                <span className="rounded bg-red-400/15 px-2 py-1 font-mono text-[10px] tracking-wide text-red-400">
                  TRUNCATION ×1
                </span>
                <span className="rounded bg-lime/15 px-2 py-1 font-mono text-[10px] tracking-wide text-lime">
                  UNTRANSLATED ×5
                </span>
              </div>
            </div>
            <ul className="mt-6 space-y-3">
              {findings.map((f) => (
                <li key={f.text} className="rounded-lg border border-line bg-black/40 p-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`rounded px-1.5 py-0.5 font-mono text-[10px] tracking-wide ${
                        f.critical ? "bg-red-400 text-black" : "bg-white/10 text-white/70"
                      }`}
                    >
                      {f.critical ? `CRITICAL · ${f.tag}` : f.tag}
                    </span>
                  </div>
                  <p className="mt-2 font-mono text-sm text-white/85">&quot;{f.text}&quot;</p>
                  <p className="mt-1 text-xs text-faint">{f.note}</p>
                </li>
              ))}
              <li className="px-4 font-mono text-[11px] text-faint">
                + 3 more untranslated strings in the full report
              </li>
            </ul>
          </div>
        </Frame>

        {/* Why it matters */}
        <div>
          <figure className="rounded-2xl border border-line bg-panel/50 p-6">
            <blockquote className="leading-relaxed text-white/85">
              “Leaving insufficient time or budget for LQA is the single most common reason
              otherwise well-executed localization projects produce poor results.”
            </blockquote>
            <figcaption className="mt-3 font-mono text-[11px] tracking-wide text-faint">
              —{" "}
              <a
                href="https://www.keywordsstudios.com/en/about-us/news-events/news/a-step-by-step-guide-to-game-localization/"
                target="_blank"
                rel="noopener noreferrer"
                className="underline decoration-line underline-offset-4 transition-colors hover:text-white/70"
              >
                Keywords Studios ↗
              </a>{" "}
              · the industry&apos;s largest game-services provider
            </figcaption>
          </figure>
          <p className="mt-6 rounded-lg border border-line bg-black/40 px-4 py-3 text-sm leading-relaxed text-muted">
            The report is CI-friendly: <span className="font-mono text-lime">critical_count</span>{" "}
            &gt; 0 can fail the build — so a cut-off responsible-gambling line never reaches a
            regulated market.
          </p>
          <p className="mt-4 text-sm leading-relaxed text-muted">
            In gamedev, a truncated string is polish. In iGaming, the truncated string was the 18+
            notice — that&apos;s the difference this page exists for.
          </p>
        </div>
      </div>
    </Section>
  );
}

/* ---------------- One source, five markets ---------------- */

function Markets() {
  // Real strings from the live demo's shipped manifest (public/demo/casino.html).
  const play = [
    ["DE", "Spielen"],
    ["ES", "Jugar"],
    ["PT", "Jogar"],
    ["FR", "Jouer"],
    ["TR", "Oyna"],
  ];
  const rg = [
    ["DE", "Verantwortungsbewusst spielen"],
    ["ES", "Juega responsablemente"],
    ["PT", "Jogue com responsabilidade"],
    ["FR", "Jouer de manière responsable"],
    ["TR", "Sorumlu oynayın"],
  ];
  return (
    <Section id="markets">
      <Eyebrow>One source, five markets</Eyebrow>
      <H2>The brand never translates. The compliance text always does.</H2>
      <Lead>
        One English casino, five markets in one run. Every row below is the live demo&apos;s actual
        output — names locked, numbers exact, the responsible-gambling line native in each language.
      </Lead>

      <div className="mt-12 divide-y divide-line overflow-hidden rounded-2xl border border-line bg-panel/40">
        <MarketRow label="BRAND LOCK">
          <span className="flex flex-wrap items-center gap-2">
            {["LuckySpin", "Golden Spin", "Aztec Fortune"].map((b) => (
              <span key={b} className="rounded-lg border border-line-strong bg-black/40 px-3 py-1.5 text-sm font-semibold">
                {b}
              </span>
            ))}
            <span className="text-sm text-faint">identical in all five languages — never translated</span>
          </span>
        </MarketRow>
        <MarketRow label='"PLAY" BUTTON'>
          <span className="flex flex-wrap gap-2">
            {play.map(([code, word]) => (
              <span key={code} className="inline-flex items-center gap-2 rounded-lg border border-line bg-black/40 px-3 py-1.5 text-sm">
                <span className="font-mono text-[10px] text-lime">{code}</span>
                {word}
              </span>
            ))}
          </span>
        </MarketRow>
        <MarketRow label='"PLAY RESPONSIBLY"'>
          <span className="flex flex-wrap gap-2">
            {rg.map(([code, line]) => (
              <span key={code} className="inline-flex items-center gap-2 rounded-lg border border-line bg-black/40 px-3 py-1.5 text-sm">
                <span className="font-mono text-[10px] text-lime">{code}</span>
                {line}
              </span>
            ))}
          </span>
        </MarketRow>
        <MarketRow label="NUMBERS & CURRENCY">
          <span className="text-sm text-muted">
            <span className="font-mono text-white/85">$82,400</span> jackpots,{" "}
            <span className="font-mono text-white/85">100%</span> bonuses,{" "}
            <span className="font-mono text-white/85">18+</span> — preserved digit for digit in
            every market.
          </span>
        </MarketRow>
      </div>
    </Section>
  );
}

function MarketRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid gap-3 p-5 sm:grid-cols-[180px_1fr] sm:items-center">
      <span className="font-mono text-[11px] tracking-widest text-faint">{label}</span>
      {children}
    </div>
  );
}

/* ---------------- The one-minute pitch ---------------- */

function Pitch() {
  return (
    <Section id="pitch">
      <Eyebrow>The one-minute version</Eyebrow>
      <H2>The whole story, narrated</H2>
      <Lead>
        Problem, live localization and the compliance gate in 65 seconds — the
        same cut we show investors and partners. Sound on.
      </Lead>
      <div className="mt-12 overflow-hidden rounded-2xl border border-line bg-panel transition-colors hover:border-line-strong">
        <video
          controls
          playsInline
          preload="metadata"
          poster="/video/investor-pitch-poster.jpg"
          className="block h-auto w-full"
          aria-label="Snapling for iGaming — 65 second narrated overview"
        >
          <source src="/video/investor-pitch.mp4" type="video/mp4" />
        </video>
      </div>
      <p className="mt-4 font-mono text-[11px] tracking-widest text-faint">
        65S · NARRATED · REAL PRODUCT OUTPUT THROUGHOUT
      </p>
    </Section>
  );
}

/* ---------------- Who it's for ---------------- */

function WhoFor() {
  const cards = [
    [
      "Operators",
      "One casino, every licensed market. Lobby, promos, cashier and the compliance text — localized in one run and verified screen by screen before a regulator sees it.",
    ],
    [
      "Aggregators & platforms",
      "A catalog of brands through one pipeline. Glossaries lock every skin's names and titles; each market ships from the same source keys, not a fresh project.",
    ],
    [
      "Slot studios",
      "Win screens, paytables, bonus rounds — translated with the screen they live on, so the button says the right thing in every market you certify.",
    ],
  ];
  return (
    <Section id="who">
      <Eyebrow>Who it&apos;s for</Eyebrow>
      <H2>Built for operators, platforms &amp; slot studios</H2>
      <div className="mt-12 grid gap-4 md:grid-cols-3">
        {cards.map(([title, body]) => (
          <div key={title} className="rounded-2xl border border-line bg-panel p-6 transition-colors hover:border-line-strong">
            <h3 className="text-lg font-semibold">{title}</h3>
            <p className="mt-3 text-sm leading-relaxed text-muted">{body}</p>
          </div>
        ))}
      </div>
    </Section>
  );
}

/* ---------------- Pricing strip (mirrors the main page 1:1) ---------------- */

function PricingStrip() {
  const tiers = [
    { name: "Indie", price: "$99", unit: "/mo", blurb: "For solo devs & small teams." },
    { name: "Studio", price: "$499", unit: "/mo", blurb: "For growing studios.", highlight: true },
    { name: "Publisher", price: "Custom", unit: "", blurb: "For publishers & large studios." },
  ];
  return (
    <Section id="pricing">
      <Eyebrow>Pricing</Eyebrow>
      <H2>Same engine, same pricing</H2>
      <Lead>
        iGaming runs on the same plans as the main product — no vertical markup. Full quotas, SDKs
        and add-ons are spelled out on the main page.
      </Lead>

      <div className="mt-8 rounded-xl border border-lime/40 bg-lime/[0.06] px-5 py-3 text-center text-sm">
        <span className="font-semibold text-lime">
          Pilot participants lock in 50% off launch pricing for 12 months.
        </span>{" "}
        <span className="text-muted">The prices below take effect at launch.</span>
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-3">
        {tiers.map((t) => (
          <div
            key={t.name}
            className={`relative flex flex-col rounded-2xl border p-6 transition-colors ${
              t.highlight
                ? "border-lime/60 bg-lime/[0.06] hover:border-lime/80"
                : "border-line bg-panel hover:border-line-strong"
            }`}
          >
            {t.highlight && (
              <span className="absolute right-5 top-6 rounded bg-lime px-2 py-0.5 font-mono text-[10px] tracking-wide text-black">
                MOST POPULAR
              </span>
            )}
            <h3 className="text-lg font-semibold">{t.name}</h3>
            <p className="mt-1 text-sm text-faint">{t.blurb}</p>
            <p className="mt-4">
              {t.price !== "Custom" && <span className="text-xs text-faint">from </span>}
              <span className="h-display text-4xl">{t.price}</span>
              <span className="text-sm text-faint">{t.unit}</span>
            </p>
          </div>
        ))}
      </div>
      <p className="mt-6 text-center">
        <a
          href="/#pricing"
          className="font-semibold text-lime transition-colors hover:text-lime-dim"
        >
          See full quotas on the main page →
        </a>
      </p>
    </Section>
  );
}

/* ---------------- FAQ ---------------- */

function Faq() {
  return (
    <Section id="faq">
      <Eyebrow>FAQ</Eyebrow>
      <H2>iGaming questions</H2>
      <div className="mt-10 divide-y divide-line overflow-hidden rounded-2xl border border-line">
        {igamingFaqs.map((f) => (
          <details key={f.q} className="group bg-panel/40 px-6 py-5 transition-colors hover:bg-panel/60 open:bg-panel/70">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold">
              {f.q}
              <span className="text-lime transition-transform group-open:rotate-45">+</span>
            </summary>
            <p className="mt-3 text-sm leading-relaxed text-muted">{f.a}</p>
          </details>
        ))}
      </div>
    </Section>
  );
}

/* ---------------- Final CTA ---------------- */

function FinalCta() {
  return (
    <Section id="contact">
      <div className="glow relative overflow-hidden rounded-3xl border border-line-strong bg-white/[0.02] px-6 py-16 text-center">
        <div
          aria-hidden
          className="grid-band pointer-events-none absolute inset-0 [mask-image:radial-gradient(70%_80%_at_50%_0%,black,transparent)]"
        />
        <h2 className="h-display text-balance text-4xl sm:text-5xl">{CTA}</h2>
        <p className="mx-auto mt-5 max-w-lg text-muted">
          We&apos;re onboarding a small group of teams for closed pilots. Bring a slice of your
          casino — a lobby, one game, a set of screens. We&apos;ll localize it into your markets and
          hand back the LQA report. Pilot participants lock in 50% off launch pricing for 12 months.
        </p>
        <DemoForm />
      </div>
    </Section>
  );
}

/* ---------------- Footer ---------------- */

function Footer() {
  return (
    <footer className="border-t border-line">
      <div className="mx-auto grid max-w-6xl gap-10 px-6 py-14 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <Logo />
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted">
            AI localization for iGaming: casino UI translated with visual context, verified with
            automated LQA — brand locked, compliance text intact in every regulated market.
          </p>
        </div>
        <div>
          <p className="font-mono text-[11px] tracking-widest text-faint">PRODUCT</p>
          <ul className="mt-4 space-y-2 text-sm text-muted">
            <li><a href="#demo" className="transition-colors hover:text-white">Live demo</a></li>
            <li><a href="#context" className="transition-colors hover:text-white">Visual context</a></li>
            <li><a href="#lqa" className="transition-colors hover:text-white">Automated LQA</a></li>
            <li><a href="#pricing" className="transition-colors hover:text-white">Pricing</a></li>
            <li><a href="/" className="transition-colors hover:text-white">Snapling for game studios</a></li>
          </ul>
        </div>
        <div>
          <p className="font-mono text-[11px] tracking-widest text-faint">CONTACT</p>
          <ul className="mt-4 space-y-2 text-sm text-muted">
            <li>Telegram — @snapling</li>
            <li><a href="mailto:hello@snapling.io" className="transition-colors hover:text-white">hello@snapling.io</a></li>
            <li><a href="#contact" className="text-lime hover:underline">{CTA} →</a></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-line">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-2 px-6 py-5 text-xs text-faint">
          <span>© 2026 Snapling. All rights reserved.</span>
          <span className="font-mono">iGaming localization · DE · ES · PT · FR · TR</span>
        </div>
      </div>
    </footer>
  );
}

/* ---------------- Shared bits (mirror page.tsx to keep it the only-edit-free) ---------------- */

function Section({ id, children }: { id?: string; children: React.ReactNode }) {
  return (
    <section id={id} className="mx-auto max-w-6xl px-6 py-20">
      {children}
    </section>
  );
}
function Eyebrow({ children }: { children: React.ReactNode }) {
  return <p className="eyebrow">{children}</p>;
}
function H2({ children }: { children: React.ReactNode }) {
  return <h2 className="h-display mt-4 text-balance text-4xl sm:text-5xl">{children}</h2>;
}
function Lead({ children }: { children: React.ReactNode }) {
  return <p className="mt-5 max-w-2xl text-pretty text-lg leading-relaxed text-muted">{children}</p>;
}

/** A third-party statistic with its source linked — checkable, not our estimate. */
function SourcedStat({ value, body, source, href }: { value: string; body: string; source: string; href: string }) {
  return (
    <div className="bg-ink p-6">
      <p className="h-display text-4xl text-lime">{value}</p>
      <p className="mt-2 text-sm leading-relaxed text-muted">{body}</p>
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-3 inline-block font-mono text-[10px] tracking-wide text-faint underline decoration-line underline-offset-4 transition-colors hover:text-white/70"
      >
        {source} ↗
      </a>
    </div>
  );
}
