import Link from "next/link";
import Header from "@/components/Header";
import { Logo } from "@/components/Header";
import BeforeAfter from "@/components/BeforeAfter";
import HeroMosaic from "@/components/HeroMosaic";
import { Frame, GameUI, StoreCreative, BattleButton, LqaShot } from "@/components/Mocks";
import VoiceSample from "@/components/VoiceSample";
import DemoForm from "@/components/DemoForm";
import PilotSteps from "@/components/PilotSteps";
import Languages from "@/components/Languages";
import { LANGUAGES } from "@/lib/languages";
import { softwareApplicationJsonLd, faqJsonLd, faqs, CTA, contactEmail } from "@/lib/seo";

function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export default function Home() {
  return (
    <div id="top">
      <JsonLd data={softwareApplicationJsonLd()} />
      <JsonLd data={faqJsonLd()} />
      <Header />
      <main id="main">
        <Hero />
        <EngineTicker />
        <Problem />
        <Modules />
        <StoreDemo />
        <ContextDemo />
        <LqaDemo />
        <HowItWorks />
        <Why />
        <WhoFor />
        <Pricing />
        <LanguagesSection />
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
      {/* living-mosaic background — client canvas, container-sized, pauses off-screen */}
      <div aria-hidden className="pointer-events-none absolute inset-0 z-0">
        <HeroMosaic />
        {/* contrast: dim where the headline sits, keep the right side lively */}
        <div className="absolute inset-0 bg-[radial-gradient(125%_115%_at_12%_38%,rgba(10,11,10,0.94),rgba(10,11,10,0.62)_42%,rgba(10,11,10,0.22)_72%,transparent)]" />
        {/* dissolve into the page */}
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-[#0a0b0a]" />
      </div>
      <div className="glow pointer-events-none absolute inset-x-0 top-0 z-[1] h-[520px]" />
      <div className="relative z-10 mx-auto grid max-w-6xl items-center gap-12 px-6 pt-16 pb-20 lg:grid-cols-2 lg:pt-24">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-line bg-white/[0.03] px-3 py-1.5 font-mono text-[11px] tracking-wide text-lime">
            <span className="h-1.5 w-1.5 rounded-full bg-lime" />
            CLOSED PILOT — ONBOARDING NOW
          </span>
          <h1 className="h-display mt-6 text-balance text-5xl sm:text-6xl">
            Text, voice and store creatives for your game — <span className="text-lime">one SDK</span>.
          </h1>
          <p className="mt-6 max-w-md text-pretty text-lg leading-relaxed text-muted">
            UI strings, character voiceover and store art, localized in one engine and delivered by
            asset key to Unity, Unreal and Flutter. Every string is translated with the screen it
            appears on, and every localized screen is checked before it ships.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href="#contact" className="rounded-lg bg-lime px-5 py-3 font-semibold text-black transition hover:bg-lime-dim active:scale-[0.98]">
              {CTA} →
            </a>
            <a href="#how" className="rounded-lg border border-line-strong px-5 py-3 font-semibold text-white/90 transition hover:bg-white/5 active:scale-[0.98]">
              See how it works
            </a>
          </div>
          <p className="mt-8 font-mono text-xs text-faint">
            <span className="text-lime">→</span> snapling.getAudio(&quot;dialogue.elder_01&quot;, &quot;ja&quot;)
          </p>
        </div>

        <div className="relative space-y-4">
          <Frame label="Shadow Realm — main menu">
            <BeforeAfter
              leftLabel="EN — SOURCE"
              rightLabel="JA — LOCALIZED"
              left={<GameUI lang="en" />}
              right={<GameUI lang="ja" />}
            />
          </Frame>
          <VoiceSample />
        </div>
      </div>
    </section>
  );
}

/* ---------------- Engine ticker ---------------- */

function EngineTicker() {
  const engines = ["Unity", "Unreal", "Flutter", "Web"];
  return (
    <section className="grid-band border-y border-line bg-white/[0.015]">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-8 gap-y-3 px-6 py-5">
        <span className="font-mono text-[11px] tracking-widest text-faint">ONE SDK, EVERY ENGINE</span>
        {engines.map((e) => (
          <span key={e} className="font-display text-lg font-bold text-white/80">
            {e}
          </span>
        ))}
      </div>
    </section>
  );
}

/* ---------------- Problem ---------------- */

function Problem() {
  const items = [
    ["01", "UI strings, translated by hand", "Exported, sent out, re-imported — and dynamic content breaks in the build."],
    ["02", "Character voiceover in a studio", "Actors, studio time and post — weeks of turnaround, and a re-record every time a line changes."],
    ["03", "Store creatives redrawn per language", "Every screenshot and banner rebuilt in Photoshop for each locale."],
    ["04", "It doesn't scale", "Scattered tools and a fresh project for every language you ship."],
  ];
  return (
    <Section id="problem">
      <Eyebrow>The problem</Eyebrow>
      <H2>Localizing a game isn&apos;t just text</H2>
      <Lead>
        A game is UI strings, character voiceover, store texts, ad creatives and trailers — usually
        handled by separate tools and expensive manual dubbing, redone for every language.
      </Lead>

      {/* Third-party, checkable numbers — not our own estimates. */}
      <div className="mt-10 grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2">
        {/* Refresh monthly: English 34.20%, Simplified Chinese 31.39% in September 2026. */}
        <SourcedStat
          value="~66%"
          body="of Steam users don't use English as their main language — Simplified Chinese is nearly as common, 31.4% against 34.2%."
          source="Steam Hardware & Software Survey, Sep 2026"
          href="https://store.steampowered.com/hwsurvey/"
        />
        <SourcedStat
          value="76%"
          body="of consumers prefer to buy products with information in their own language — 40% won't buy from sites in another language."
          source="CSA Research, 8,709 consumers / 29 countries"
          href="https://csa-research.com/l/media/Consumers-Prefer-their-Own-Language"
        />
      </div>

      <div className="mt-12 grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2">
        {items.map(([n, title, body]) => (
          <div key={n} className="bg-ink p-6">
            <span className="font-mono text-sm text-lime">{n}</span>
            <h3 className="mt-3 text-lg font-semibold">{title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted">{body}</p>
          </div>
        ))}
      </div>
    </Section>
  );
}

/* ---------------- Modules ---------------- */

function Modules() {
  const cards = [
    {
      icon: <IconCode />,
      title: "Text localization",
      body: "UI and store text via native SDKs (Unity, Unreal, Flutter) and a web SDK, addressed by asset key. Brands and game names stay intact.",
      foot: <code className="font-mono text-[11px] text-lime">snapling.t(&quot;menu.play&quot;)</code>,
    },
    {
      icon: <IconMic />,
      title: "Voice localization",
      highlight: true,
      body: "Automatic voiceover for dialogue and voice prompts — a consistent voice per language, delivered by asset key. No actors, no dubbing studio.",
      foot: <span className="font-mono text-[11px] text-lime">ASR → translate → TTS</span>,
    },
    {
      icon: <IconImage />,
      title: "Creative localization",
      body: "Store screenshots and banners redrawn with the translation on the image — matching style and font. App store localization, not an overlay.",
      foot: <span className="font-mono text-[11px] text-faint">EN → JA · redrawn</span>,
    },
    {
      icon: <IconPlay />,
      title: "Video localization",
      soon: true,
      body: "Trailer and promo dubbing: speech recognition → translation → voice synthesis. Same energy, new language.",
      foot: <span className="font-mono text-[11px] text-faint">trailers · promos</span>,
    },
  ];
  return (
    <Section id="modules">
      <Eyebrow>The platform</Eyebrow>
      <H2>Localize your whole game</H2>
      <Lead>
        Text, voice and creatives — one game localization engine, end to end, with your brand and
        game titles kept intact. Video is next.
      </Lead>
      <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((c) => (
          <div
            key={c.title}
            className={`relative flex flex-col rounded-2xl border p-6 transition-colors ${
              c.highlight
                ? "border-lime/50 bg-lime/[0.06] hover:border-lime/70"
                : "border-line bg-panel hover:border-line-strong"
            }`}
          >
            {c.soon && (
              <span className="absolute right-4 top-4 rounded bg-lime/15 px-2 py-0.5 font-mono text-[10px] tracking-wide text-lime">
                SOON
              </span>
            )}
            {c.highlight && (
              <span className="absolute right-4 top-4 rounded bg-lime px-2 py-0.5 font-mono text-[10px] tracking-wide text-black">
                CORE
              </span>
            )}
            <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-lime/10 text-lime">
              {c.icon}
            </span>
            <h3 className="mt-5 text-xl font-semibold">{c.title}</h3>
            <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">{c.body}</p>
            <div className="mt-4 rounded-lg border border-line bg-black/40 px-3 py-2">{c.foot}</div>
          </div>
        ))}
      </div>
    </Section>
  );
}

/* ---------------- Store creative before/after ---------------- */

function StoreDemo() {
  return (
    <Section>
      {/* Side by side, not a slider: the banner is left-aligned, so any split
          position cut the Japanese text under the English half. */}
      <div className="grid gap-4 md:grid-cols-2">
        {(["en", "ja"] as const).map((lang) => (
          <div key={lang} className="relative overflow-hidden rounded-2xl border border-line-strong">
            <span className={`absolute right-3 top-3 z-20 rounded-md px-2 py-1 font-mono text-[10px] tracking-wide ${
              lang === "en" ? "bg-black/70 text-white/80" : "bg-lime/90 text-black"}`}>
              {lang === "en" ? "EN — SOURCE" : "JA — LOCALIZED"}
            </span>
            <StoreCreative lang={lang} />
          </div>
        ))}
      </div>
      <p className="mt-4 text-center text-sm text-faint">
        Store screenshots and banners redrawn in place — the text is translated and re-rendered on
        the image, same layout and font.
      </p>
    </Section>
  );
}

/* ---------------- Context-aware translation ---------------- */

function ContextDemo() {
  return (
    <Section id="context">
      <Eyebrow>Context-aware translation</Eyebrow>
      <H2>Translate with eyes, not blind</H2>
      <Lead>
        The same word means different things on different screens. Snapling sees a screenshot of where
        each string appears — so it picks the right meaning instead of guessing.
      </Lead>
      <div className="mt-12 grid gap-4 lg:grid-cols-2">
        {/* Without context */}
        <div className="rounded-2xl border border-line bg-panel p-6">
          <p className="font-mono text-[11px] tracking-widest text-faint">WITHOUT CONTEXT</p>
          <div className="mt-4 inline-flex items-center gap-2 rounded-lg border border-line bg-black/40 px-3 py-2">
            <span className="font-mono text-xs text-faint">string</span>
            <span className="font-semibold">&quot;Charge&quot;</span>
          </div>
          <p className="mt-5 text-sm text-muted">Three plausible translations — the tool can&apos;t tell which:</p>
          <div className="mt-3 flex flex-wrap gap-2 text-sm">
            <span className="rounded-lg border border-line px-3 py-1.5 text-white/80">⚔️ Attack?</span>
            <span className="rounded-lg border border-line px-3 py-1.5 text-white/80">🔋 Battery?</span>
            <span className="rounded-lg border border-line px-3 py-1.5 text-white/80">💳 Payment?</span>
          </div>
          <p className="mt-5 font-mono text-xs text-red-400">→ the tool has to guess, and ships whichever it picks</p>
        </div>

        {/* With context */}
        <div className="rounded-2xl border border-lime/50 bg-lime/[0.06] p-6">
          <p className="font-mono text-[11px] tracking-widest text-lime">WITH CONTEXT</p>
          <div className="mt-4 grid grid-cols-[1fr_auto] items-center gap-4">
            <BattleButton />
            <div className="text-center">
              <p className="font-mono text-[11px] text-faint">resolved</p>
              <p className="mt-1 text-2xl" style={{ fontFamily: "'Yu Gothic','Noto Sans JP','Meiryo',sans-serif" }}>突撃</p>
              <p className="text-sm text-lime">Charge (assault) ✓</p>
            </div>
          </div>
          <p className="mt-5 text-sm text-white/80">
            It&apos;s a battle action — the model sees the battle HUD and the enemy, and translates
            &quot;Charge&quot; as a <span className="font-semibold">battle charge</span>, not a battery or a payment.
          </p>
        </div>
      </div>
      <p className="mt-4 text-center text-sm text-faint">Snapling sees the screen, not just the string.</p>
    </Section>
  );
}

/* ---------------- Automated LQA ---------------- */

function LqaDemo() {
  const catches = [
    ["Untranslated", "Source-language text left on a localized screen"],
    ["Overflow", "Text spilling out of a button or container"],
    ["Truncation", "Text cut off or clipped mid-word"],
    ["Broken glyphs", "Missing-font boxes (tofu) instead of characters"],
  ];
  return (
    <Section id="lqa">
      <Eyebrow>Automated LQA</Eyebrow>
      <H2>We verify nothing broke</H2>
      <Lead>
        German text runs longer than English; fonts miss glyphs; strings slip through untranslated.
        Snapling analyzes screenshots on every language and boxes the defects — no manual LQA pass per
        screen, per release.
      </Lead>

      <figure className="mt-8 rounded-2xl border border-line bg-panel/50 p-6">
        <blockquote className="text-lg leading-relaxed text-white/85">
          “Leaving insufficient time or budget for LQA is the single most common reason otherwise
          well-executed localization projects produce poor results.”
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
          · the industry&apos;s largest game-services provider. That&apos;s the step we automate.
        </figcaption>
      </figure>

      <div className="mt-12 grid items-center gap-8 lg:grid-cols-2">
        <Frame label="build/de · main_menu.png — 2 issues">
          <LqaShot />
        </Frame>
        <div>
          <ul className="space-y-3">
            {catches.map(([title, body]) => (
              <li key={title} className="flex items-start gap-3">
                <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-lime/15 text-[11px] text-lime">✓</span>
                <span>
                  <span className="font-semibold">{title}</span>
                  <span className="text-muted"> — {body}</span>
                </span>
              </li>
            ))}
          </ul>
          <p className="mt-6 rounded-lg border border-line bg-black/40 px-4 py-3 text-sm text-muted">
            Ships a CI-friendly report — <span className="font-mono text-lime">critical_count</span> can gate a
            release build.
          </p>
        </div>
      </div>
    </Section>
  );
}

/* ---------------- How it works ---------------- */

function HowItWorks() {
  const steps = [
    ["1", "Connect", "Drop in the Unity, Unreal, Flutter or web SDK — or upload your assets. No re-platforming."],
    ["2", "Translate & voice", "AI translates every string and re-voices every line for the target language."],
    ["3", "Protect the brand", "Brand names and game titles are recognized and locked — never translated, never altered."],
    ["4", "Ships by key", "Your game fetches text and audio by asset key and keeps them on the device — it works offline after the first load. Every language is also yours as JSON."],
  ];
  return (
    <Section id="how">
      <Eyebrow>How it works</Eyebrow>
      <H2>How Snapling works</H2>
      <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {steps.map(([n, title, body]) => (
          <div key={n}>
            <span className="flex h-9 w-9 items-center justify-center rounded-full border border-lime/40 font-mono text-sm text-lime">
              {n}
            </span>
            <h3 className="mt-4 text-lg font-semibold">{title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted">{body}</p>
          </div>
        ))}
      </div>
    </Section>
  );
}

/* ---------------- Why ---------------- */

function Why() {
  const items = [
    [<IconLayers key="a" />, "One engine: text, voice and creatives — video next", "The whole game, not just strings."],
    [<IconCode key="b" />, "Native SDKs for Unity, Unreal & Flutter", "Plus a web SDK — the same asset-key contract everywhere."],
    [<IconMic key="c" />, "Automated voiceover — no studios", "Re-voice dialogue in every language on our voice list, without actors or booking time."],
    [<IconKey key="d" />, "Key-based asset localization", "The native model for games — fetch text and audio by asset key."],
    [<IconEye key="e" />, "Context-aware translation", "The model sees where each string appears on screen — ambiguous UI words resolve right."],
    [<IconScan key="f" />, "Automated LQA", "Every localized screenshot checked for overflow, truncation, untranslated text and broken glyphs."],
    [<IconModel key="g" />, "No AI vendor lock-in", "We pick the best model per task — translation, voice, vision — and swap them as they improve. Your pipeline doesn't change."],
    [<IconBolt key="h" />, "A run, not a project", "Adding a language is a pipeline run against your existing keys — not a new localization project."],
  ] as const;
  return (
    <Section id="why">
      <Eyebrow>Why Snapling</Eyebrow>
      <H2>What you get</H2>
      <div className="mt-12 grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
        {items.map(([icon, title, body], i) => (
          <div key={i} className="bg-ink p-6">
            <span className="text-lime">{icon}</span>
            <h3 className="mt-4 text-lg font-semibold">{title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted">{body}</p>
          </div>
        ))}
        {/* 8 items in a 3-col grid leave a hole — make the 9th cell a deliberate action. */}
        <a
          href="#contact"
          className="group flex items-center justify-center gap-2 bg-ink p-6 font-semibold text-lime transition-colors hover:bg-lime/[0.04] sm:col-span-2 lg:col-span-1"
        >
          {CTA}
          <span aria-hidden className="transition-transform group-hover:translate-x-1">→</span>
        </a>
      </div>
    </Section>
  );
}

/* ---------------- Who it's for ---------------- */

function WhoFor() {
  const cards = [
    ["Indie studios", "Ship your game in five languages with voice — no dubbing studio and no localization project per language."],
    ["Mobile developers", "Localize UI and store creatives for every market — app store localization (ASO) from the first plan."],
    ["Publishers", "Roll out localization across a portfolio — one engine for text, voice and creatives, trailers next."],
  ];
  return (
    <Section id="who">
      <Eyebrow>Who it&apos;s for</Eyebrow>
      <H2>Built for indie studios, mobile devs &amp; publishers</H2>
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

/* ---------------- Pricing ---------------- */

function Pricing() {
  // Quotas are the platform's plans (translator-saas billing/Plan.java) — and
  // src/lib/estimate.ts, the estimator. Change all three together. Images are one
  // counter: LQA screenshots and store creatives draw on the same quota.
  const tiers = [
    {
      name: "Indie",
      price: "$99",
      unit: "/mo",
      blurb: "For solo devs & small teams.",
      features: [
        "1 game · 5 seats",
        "Up to 5 languages",
        "50k translated words / mo",
        "30 min voiceover / mo — a voice per character",
        "200 images / mo — LQA screenshots or store creatives",
        "Game title & brand lock",
        "CI-ready LQA report",
        "All SDKs (Unity, Unreal, Flutter, web)",
      ],
      cta: CTA,
    },
    {
      name: "Studio",
      price: "$499",
      unit: "/mo",
      blurb: "For growing studios.",
      plus: "Everything in Indie, plus:",
      features: [
        "Up to 2 games · 20 seats",
        "Up to 15 languages",
        "300k translated words / mo",
        "120 min voiceover / mo",
        "2,000 images / mo",
        "Priority support",
      ],
      highlight: true,
      cta: CTA,
    },
    {
      name: "Publisher",
      price: "Custom",
      unit: "",
      blurb: "For publishers & large studios.",
      plus: "Everything in Studio, plus:",
      features: [
        "Portfolio of games",
        "Unlimited languages",
        "Volume word, image & voiceover quotas",
        "SLA",
        "Dedicated support",
      ],
      cta: "Talk to us",
    },
  ];
  return (
    <Section id="pricing">
      <Eyebrow>Pricing</Eyebrow>
      <H2>Launch pricing</H2>
      <Lead>
        Replaces a TMS, a dubbing studio and a creatives designer — with the quotas spelled out, so
        you can check them against your build instead of guessing.
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
                RECOMMENDED
              </span>
            )}
            <h3 className="text-lg font-semibold">{t.name}</h3>
            <p className="mt-1 text-sm text-faint">{t.blurb}</p>
            <p className="mt-4">
              <span className="h-display text-4xl">{t.price}</span>
              <span className="text-sm text-faint">{t.unit}</span>
            </p>
            {t.plus && <p className="mt-5 text-sm font-semibold text-white/85">{t.plus}</p>}
            <ul className={`${t.plus ? "mt-2" : "mt-5"} flex-1 space-y-2 text-sm text-muted`}>
              {t.features.map((f) => (
                <li key={f} className="flex items-start gap-2">
                  <span className="mt-0.5 text-lime">✓</span> {f}
                </li>
              ))}
            </ul>
            <a
              href="#contact"
              className={`mt-6 rounded-lg px-4 py-2.5 text-center text-sm font-semibold transition active:scale-[0.98] ${
                t.highlight
                  ? "bg-lime text-black hover:bg-lime-dim"
                  : "border border-line-strong text-white/90 hover:bg-white/5"
              }`}
            >
              {t.cta}
            </a>
          </div>
        ))}
      </div>
      <p className="mt-6 text-center">
        <Link href="/estimate" className="font-semibold text-lime transition-colors hover:text-lime-dim">
          Not sure how many words your game has? Count them →
        </Link>
      </p>
      <p className="mt-4 text-center text-xs text-faint">
        Over the quota (indicative): $3 per 1,000 words ($2.50 on Studio) · $0.20 per image ($0.15 on
        Studio) · $4 per voiceover minute. Final pricing is set at launch.
      </p>
    </Section>
  );
}

/* ---------------- Languages ---------------- */

function LanguagesSection() {
  const text = LANGUAGES.filter((l) => l.text).length;
  const voice = LANGUAGES.filter((l) => l.voice).length;
  return (
    <Section id="languages">
      <Eyebrow>Languages</Eyebrow>
      <H2>
        {text} languages for text, {voice} for voice
      </H2>
      <Lead>
        Not &quot;any language&quot;: each one below passed a check — text translated and read back by
        a second model, voice spoken and transcribed back against the script.
      </Lead>
      <Languages />
    </Section>
  );
}

/* ---------------- FAQ ---------------- */

function Faq() {
  return (
    <Section id="faq">
      <Eyebrow>FAQ</Eyebrow>
      <H2>Common questions</H2>
      <div className="mt-10 divide-y divide-line overflow-hidden rounded-2xl border border-line">
        {faqs.map((f) => (
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
        <div aria-hidden className="pointer-events-none absolute inset-0 z-0">
          <HeroMosaic />
          <div className="absolute inset-0 bg-[radial-gradient(90%_90%_at_50%_50%,rgba(10,11,10,0.9),rgba(10,11,10,0.62))]" />
        </div>
        <div className="relative z-10">
          <h2 className="h-display text-balance text-4xl sm:text-5xl">{CTA}</h2>
          <p className="mx-auto mt-5 max-w-lg text-muted">
            We&apos;re onboarding a small group of studios for closed pilots. Tell us about your game and
            the markets you&apos;re targeting — we&apos;ll get back to you within one business day. Pilot
            participants lock in 50% off launch pricing for 12 months.
          </p>
          <DemoForm />
          <PilotSteps />
        </div>
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
            AI game localization: UI text, voiceover and store creatives, delivered by asset key —
            brand-safe and design-preserving.
          </p>
        </div>
        <div>
          <p className="font-mono text-[11px] tracking-widest text-faint">PRODUCT</p>
          <ul className="mt-4 space-y-2 text-sm text-muted">
            <li><a href="#modules" className="transition-colors hover:text-white">Text localization</a></li>
            <li><a href="#modules" className="transition-colors hover:text-white">Voice localization</a></li>
            <li><a href="#modules" className="transition-colors hover:text-white">Creative localization</a></li>
            <li><a href="#context" className="transition-colors hover:text-white">Context-aware translation</a></li>
            <li><a href="#lqa" className="transition-colors hover:text-white">Automated LQA</a></li>
            <li><a href="#modules" className="transition-colors hover:text-white">Video localization (soon)</a></li>
            <li><a href="#pricing" className="transition-colors hover:text-white">Pricing</a></li>
            <li><a href="#languages" className="transition-colors hover:text-white">Languages</a></li>
          </ul>
        </div>
        <div>
          <p className="font-mono text-[11px] tracking-widest text-faint">SOLUTIONS</p>
          <ul className="mt-4 space-y-2 text-sm text-muted">
            <li><Link href="/igaming" className="transition-colors hover:text-white">iGaming</Link></li>
            <li><Link href="/estimate" className="transition-colors hover:text-white">Word count &amp; plan</Link></li>
          </ul>
          <p className="mt-8 font-mono text-[11px] tracking-widest text-faint">CONTACT</p>
          <ul className="mt-4 space-y-2 text-sm text-muted">
            <li><a href="https://t.me/snapling" target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-white">Telegram — @snapling</a></li>
            <li><a href={`mailto:${contactEmail}`} className="transition-colors hover:text-white">{contactEmail}</a></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-line">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-2 px-6 py-5 text-xs text-faint">
          <span className="flex flex-wrap gap-4">
            <span>© 2026 Snapling. All rights reserved.</span>
            <a href="/privacy" className="transition-colors hover:text-white">Privacy</a>
            <a href="/terms" className="transition-colors hover:text-white">Terms</a>
          </span>
          <span className="font-mono">AI game localization · Unity · Unreal · Flutter</span>
        </div>
      </div>
    </footer>
  );
}

/* ---------------- Shared bits ---------------- */

function Section({ id, children }: { id?: string; children: React.ReactNode }) {
  return (
    <section id={id} className="mx-auto max-w-6xl px-6 py-10 md:py-14">
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

/* ---------------- Icons (line, currentColor) ---------------- */

const sv = {
  width: 22,
  height: 22,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};
function IconCode() {
  return (<svg {...sv}><path d="m16 18 6-6-6-6" /><path d="m8 6-6 6 6 6" /></svg>);
}
function IconImage() {
  return (<svg {...sv}><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="9" cy="9" r="2" /><path d="m21 15-5-5L5 21" /></svg>);
}
function IconPlay() {
  return (<svg {...sv}><path d="m6 4 14 8-14 8V4z" /></svg>);
}
function IconMic() {
  return (<svg {...sv}><rect x="9" y="3" width="6" height="11" rx="3" /><path d="M5 11a7 7 0 0 0 14 0" /><path d="M12 18v3" /></svg>);
}
function IconKey() {
  return (<svg {...sv}><circle cx="8" cy="15" r="4" /><path d="m11 12 8-8" /><path d="m17 6 2 2" /><path d="m15 8 2 2" /></svg>);
}
function IconLayers() {
  return (<svg {...sv}><path d="m12 3 9 5-9 5-9-5 9-5z" /><path d="m3 13 9 5 9-5" /></svg>);
}
function IconModel() {
  return (<svg {...sv}><rect x="5" y="5" width="14" height="14" rx="3" /><path d="M9 3v2M15 3v2M9 19v2M15 19v2M3 9h2M3 15h2M19 9h2M19 15h2" /></svg>);
}
function IconBolt() {
  return (<svg {...sv}><path d="M13 2 4 14h7l-1 8 9-12h-7l1-8z" /></svg>);
}
function IconEye() {
  return (<svg {...sv}><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z" /><circle cx="12" cy="12" r="3" /></svg>);
}
function IconScan() {
  return (<svg {...sv}><path d="M3 7V5a2 2 0 0 1 2-2h2M17 3h2a2 2 0 0 1 2 2v2M21 17v2a2 2 0 0 1-2 2h-2M7 21H5a2 2 0 0 1-2-2v-2" /><path d="m8 12 3 3 5-6" /></svg>);
}
