// Central SEO constants. Replace `siteUrl` with the real domain when live.
export const siteUrl = "https://snapling.com";
export const siteName = "Snapling";

export const title = "Snapling — AI Game Localization: Text, Voice & Creatives";
export const description =
  "Localize your game's UI, voiceover, and store creatives into any language in minutes — translated in context and checked for defects on every screen. Native SDKs for Unity, Unreal, Flutter. No dubbing studios needed.";

export const ogTitle = "Snapling — AI Game Localization";
export const ogDescription =
  "Localize game UI, voiceover, and creatives into any language in minutes. Context-aware translation + automated LQA. Native SDKs for Unity, Unreal, Flutter.";

// FAQ — used both for the on-page section and the FAQPage JSON-LD.
export const faqs: { q: string; a: string }[] = [
  {
    q: "Can Snapling localize game voiceover automatically?",
    a: "Yes. Snapling translates and re-voices dialogue and voice prompts into any language with a consistent voice, delivered by asset key through native SDKs — no dubbing studio required.",
  },
  {
    q: "Which engines and platforms do you support?",
    a: "Native SDKs for Unity, Unreal, and Flutter, plus a web SDK. The same contract works across all of them: fetch localized text and audio by key.",
  },
  {
    q: "Will my brand and game names stay intact?",
    a: "Yes. Brand names and in-game titles are recognized and locked, so they are never translated or altered during localization.",
  },
  {
    q: "How does store creative localization work?",
    a: "Snapling finds the text on a store screenshot or banner, translates it, and re-renders it directly on the image — matching the original style and font. It's not a text overlay.",
  },
  {
    q: "How does context-aware translation work?",
    a: "Snapling can see a screenshot of where each UI string appears on screen and translates with that visual context. So an ambiguous word like \"Charge\" on a battle button becomes \"attack\", not \"battery\" or \"payment\" — the model translates with eyes, not blind.",
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
      "AI localization for games: translate UI, voiceover, store creatives, and trailers into any language while preserving brand and design. Context-aware translation and automated LQA. Native SDKs for Unity, Unreal, and Flutter.",
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
