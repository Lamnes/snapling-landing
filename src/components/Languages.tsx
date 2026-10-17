import { LANGUAGES, LANGUAGES_CHECKED } from "@/lib/languages";

// The checked list (not "any language"): text and voice separately, each
// language listed only after it passed the round-trip check.
export default function Languages() {
  const text = LANGUAGES.filter((l) => l.text);
  const voice = LANGUAGES.filter((l) => l.voice);
  return (
    <div className="mt-12 grid gap-4 md:grid-cols-2">
      <Column title={`Text · ${text.length} languages`} items={text.map((l) => l.name)}
        note="Translated and checked back into English by a second model." />
      <Column title={`Voice · ${voice.length} languages`} items={voice.map((l) => l.name)}
        note="Spoken, transcribed back and matched against the script." />
      <p className="text-xs text-faint md:col-span-2">
        Checked {LANGUAGES_CHECKED}. Need a language that isn&apos;t listed? Ask — we test it for your
        pilot.
      </p>
    </div>
  );
}

function Column({ title, items, note }: { title: string; items: string[]; note: string }) {
  return (
    <div className="rounded-2xl border border-line bg-panel p-6">
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="mt-1 text-xs text-faint">{note}</p>
      <ul className="mt-4 flex flex-wrap gap-1.5">
        {items.map((n) => (
          <li key={n} className="rounded-md border border-line px-2 py-1 text-xs text-white/80">{n}</li>
        ))}
      </ul>
    </div>
  );
}
