// Central SEO constants.
//
// The public origin for canonical / OG / sitemap: NEXT_PUBLIC_SITE_URL once the
// domain is chosen; until then the Railway domain the site is actually served
// from, so these never point at a domain we don't own. (Read at build time.)
export const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.RAILWAY_PUBLIC_DOMAIN ? `https://${process.env.RAILWAY_PUBLIC_DOMAIN}` : "https://snapling.dev")
).replace(/\/+$/, "");
export const siteName = "Snapling";

// One contact address everywhere (footer, form fallback).
export const contactEmail = process.env.NEXT_PUBLIC_CONTACT_EMAIL || "hello@snapling.io";

// One name for one action, everywhere on the page (header, hero, pricing, CTA,
// footer). "Apply" reads as selection, not a sale — we're in closed pilot.
export const CTA = "Apply for a pilot";

export const title = "Snapling — AI Game Localization: Text, Voice & Creatives";
export const description =
  "Text, voice and store creatives for your game in one SDK for Unity, Unreal and Flutter. Every string is translated with the screen it appears on, and every localized screen is checked for overflow, truncation and untranslated text.";

export const ogTitle = "Snapling — Text, voice and store creatives for your game, one SDK";
export const ogDescription =
  "Game localization in one engine: UI text, voiceover and store creatives by asset key, translated with screen context and verified by automated LQA. Native SDKs for Unity, Unreal, Flutter.";

// FAQ — used both for the on-page section and the FAQPage JSON-LD.
export const faqs: { q: string; a: string }[] = [
  {
    q: "Can Snapling localize game voiceover automatically?",
    a: "Yes. Snapling translates and re-voices dialogue and voice prompts with one consistent voice per character, delivered by asset key through native SDKs — no dubbing studio required. The voice languages are listed under Languages; each one passed a speak-and-transcribe-back check.",
  },
  {
    q: "Which engines and platforms do you support?",
    a: "Native SDKs for Unity, Unreal, and Flutter, plus a web SDK. The same contract works across all of them: fetch localized text and audio by key.",
  },
  {
    q: "Will my brand and game names stay intact?",
    a: "Yes, on every plan. Brand names and in-game titles are recognized and locked — and you can add your own list — so they are never translated or altered during localization.",
  },
  {
    q: "Does my game need to be online?",
    a: "Only to fetch updates. The native SDKs keep text and audio on the device after the first load, so the game keeps working offline, and a missing translation shows your fallback text instead of an empty label.",
  },
  {
    q: "Can I export everything and leave?",
    a: "Yes. Every language is available as JSON (asset key → text) and every voice line as an audio file by key — your localization stays yours.",
  },
  {
    q: "How does store creative localization work?",
    a: "Snapling finds the text on a store screenshot or banner, translates it, and re-renders it directly on the image — matching the original style and font. It's not a text overlay.",
  },
  {
    q: "How does context-aware translation work?",
    a: "Snapling can see a screenshot of where each UI string appears on screen and translates with that visual context. So an ambiguous word like \"Charge\" on a battle button becomes a battle charge, not \"battery\" or \"payment\" — the model translates with eyes, not blind.",
  },
  {
    q: "Does Snapling check the localized build for bugs?",
    a: "Yes — automated LQA. Upload screenshots per language and Snapling flags visible defects: text overflowing buttons, truncated strings, untranslated text and broken glyphs, each boxed on the image. It ships a CI-friendly report you can gate a release on.",
  },
];

export function softwareApplicationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Snapling",
    applicationCategory: "DeveloperApplication",
    applicationSubCategory: "Game Localization Software",
    operatingSystem: "Web, Unity, Unreal, Flutter",
    description:
      "AI localization for games: UI text, voiceover and store creatives, with brand names and design preserved. Context-aware translation and automated LQA. Native SDKs for Unity, Unreal, and Flutter.",
    url: `${siteUrl}/`,
    offers: { "@type": "Offer", availability: "https://schema.org/PreOrder" },
    publisher: {
      "@type": "Organization",
      name: "Snapling",
      url: `${siteUrl}/`,
      logo: `${siteUrl}/favicon.svg`,
    },
  };
}

export function faqJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}
