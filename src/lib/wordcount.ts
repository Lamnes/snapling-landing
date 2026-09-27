// Billable words in a source text — the unit plans are priced in.
//
// The same rules as the platform's WordCounter (translator-saas
// billing/WordCounter.java) — change both together:
// - markup and placeholders don't count: tags (<b>, <0>, <1/>), {{name}},
//   {count}, %s, ${x};
// - a word is a run of letters and digits with at least one letter; an
//   apostrophe or hyphen inside keeps it one word ("don't", "e-mail"); bare
//   numbers ("100", "$20") aren't translated, so they don't count;
// - Chinese and Japanese don't separate words with spaces: each Han, Hiragana
//   or Katakana character is one word, as translation tools count them.

// Built with RegExp() so the Unicode property escapes don't depend on the TS target.
const MARKUP = /<[^<>]{1,200}>|\{\{[^{}]*\}\}|[%$]\{[^{}]*\}|\{[A-Za-z0-9_.]+\}|%[0-9]*\$?[sdfoxXeEgG]/g;
const CJK = new RegExp("[\\p{Script=Han}\\p{Script=Hiragana}\\p{Script=Katakana}]", "gu");
const TOKEN = new RegExp("[\\p{L}\\p{N}]+(?:['’\\-][\\p{L}\\p{N}]+)*", "gu");
const LETTER = new RegExp("\\p{L}", "u");

export function countWords(text: string | null | undefined): number {
  if (!text || !text.trim()) return 0;
  let s = text.replace(MARKUP, " ");
  let words = s.match(CJK)?.length ?? 0;
  s = s.replace(CJK, " ");
  for (const token of s.match(TOKEN) ?? []) {
    if (LETTER.test(token)) words++;
  }
  return words;
}
