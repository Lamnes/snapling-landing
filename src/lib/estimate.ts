// Which plan fits a product's text volume.
//
// The plan is chosen by the MONTHLY volume — words × languages × the share of
// text that changes in a month — and the number of languages. The first full
// translation (words × languages) is shown separately: how many months of the
// recommended quota it takes, and which plan would cover it in one month.
//
// Mirrors the platform's PlanAdvisor (translator-saas estimate/PlanAdvisor.java)
// and the tiers in the Pricing section — keep all three in step.

export type Plan = {
  code: "indie" | "studio" | "publisher";
  name: string;
  monthlyPrice: number | null; // null = custom
  wordsPerMonth: number; // -1 = per contract
  maxLanguages: number; // -1 = unlimited
};

export const PLANS: Plan[] = [
  { code: "indie", name: "Indie", monthlyPrice: 99, wordsPerMonth: 50_000, maxLanguages: 5 },
  { code: "studio", name: "Studio", monthlyPrice: 499, wordsPerMonth: 300_000, maxLanguages: 15 },
  { code: "publisher", name: "Publisher", monthlyPrice: null, wordsPerMonth: -1, maxLanguages: -1 },
];

export const DEFAULT_LANGUAGES = 5;
export const DEFAULT_UPDATE_RATE = 0.1;

export type PlanFit = Plan & { custom: boolean; fitsMonthly: boolean; fitsLanguages: boolean };

export type Advice = {
  sourceWords: number;
  languages: number;
  updateRate: number;
  initialWords: number; // sourceWords × languages
  monthlyWords: number; // initialWords × updateRate
  recommended: PlanFit;
  limitedBy: "words" | "languages" | null; // why only Publisher fits
  initialMonths: number | null; // months of the recommended quota the first translation takes
  startOnPlan: Plan["code"] | null; // covers the first translation in one month, if not the recommended one
  plans: PlanFit[];
};

export function advise(sourceWords: number, languages: number, updateRate: number): Advice {
  const langs = Math.max(1, Math.floor(languages) || 1);
  const rate = Math.min(1, Math.max(0.01, updateRate));
  const initial = Math.max(0, sourceWords) * langs;
  const monthly = Math.ceil(initial * rate);

  const fits: PlanFit[] = PLANS.map((p) => ({
    ...p,
    custom: p.monthlyPrice === null,
    fitsMonthly: p.wordsPerMonth < 0 || p.wordsPerMonth >= monthly,
    fitsLanguages: p.maxLanguages < 0 || p.maxLanguages >= langs,
  }));
  const recommended =
    fits.find((f) => !f.custom && f.fitsMonthly && f.fitsLanguages) ?? fits[fits.length - 1];

  let limitedBy: Advice["limitedBy"] = null;
  if (recommended.custom) {
    limitedBy = fits[fits.length - 2].fitsLanguages ? "words" : "languages";
  }

  let initialMonths: number | null = null;
  let startOnPlan: Plan["code"] | null = null;
  if (!recommended.custom && recommended.wordsPerMonth > 0) {
    initialMonths = Math.round((initial * 10) / recommended.wordsPerMonth) / 10;
    if (initial > recommended.wordsPerMonth) {
      startOnPlan =
        fits.find((f) => !f.custom && f.wordsPerMonth >= initial && f.fitsLanguages)?.code ?? "publisher";
    }
  }

  return {
    sourceWords,
    languages: langs,
    updateRate: rate,
    initialWords: initial,
    monthlyWords: monthly,
    recommended,
    limitedBy,
    initialMonths,
    startOnPlan,
    plans: fits,
  };
}
