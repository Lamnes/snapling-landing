// Source strings of a localization file, for the volume estimate. Runs in the
// browser, so files never leave the visitor's machine. The same rules as the
// platform's SourceExtractor (translator-saas estimate/SourceExtractor.java).

export const SUPPORTED = "JSON / ARB, PO / POT, XLIFF, CSV / TSV, iOS .strings, .properties, TXT";
export const FILE_ACCEPT = ".json,.arb,.po,.pot,.xlf,.xliff,.csv,.tsv,.strings,.properties,.txt";

const HAS_LETTER = new RegExp("\\p{L}", "u");

/** Whitespace collapsed and trimmed — the form the SDK keys strings by. */
export function normalize(raw: string | null | undefined): string {
  return (raw ?? "").replace(/\s+/g, " ").trim();
}

/** What the SDK would translate: at least 2 characters and a letter. */
export function isTranslatable(s: string): boolean {
  return s.length >= 2 && HAS_LETTER.test(s);
}

function add(out: string[], raw: string | null | undefined) {
  const s = normalize(raw);
  if (isTranslatable(s)) out.push(s);
}

const LINES = /\r\n|\r|\n/;

export function fromFile(fileName: string, content: string): string[] {
  const name = fileName.toLowerCase();
  const ext = name.includes(".") ? name.slice(name.lastIndexOf(".") + 1) : "";
  const text = content.charCodeAt(0) === 0xfeff ? content.slice(1) : content;
  const out: string[] = [];
  try {
    switch (ext) {
      case "json":
      case "arb":
        json(JSON.parse(text), out, ext === "arb");
        break;
      case "po":
      case "pot":
        po(text, out);
        break;
      case "xlf":
      case "xliff":
        for (const m of text.matchAll(/<source\b[^>]*>([\s\S]*?)<\/source\s*>/gi)) add(out, xmlText(m[1]));
        break;
      case "csv":
        csv(text, detectDelimiter(text), out);
        break;
      case "tsv":
        csv(text, "\t", out);
        break;
      case "strings":
        for (const m of text.matchAll(/"((?:[^"\\]|\\.)*)"\s*=\s*"((?:[^"\\]|\\.)*)"\s*;/g)) add(out, unescape(m[2]));
        break;
      case "properties":
        for (const line of text.split(LINES)) {
          const l = line.trim();
          if (!l || l.startsWith("#") || l.startsWith("!")) continue;
          const i = indexOfSeparator(l);
          if (i > 0) add(out, l.slice(i + 1));
        }
        break;
      case "txt":
        for (const line of text.split(LINES)) add(out, line);
        break;
      default:
        throw new UnsupportedFile(`Unsupported file type: ${fileName}. Supported: ${SUPPORTED}`);
    }
  } catch (e) {
    if (e instanceof UnsupportedFile) throw e;
    throw new Error(`Couldn't read ${fileName}: ${e instanceof Error ? e.message : String(e)}`);
  }
  return out;
}

class UnsupportedFile extends Error {}

function json(node: unknown, out: string[], arb: boolean) {
  if (typeof node === "string") {
    add(out, node);
  } else if (Array.isArray(node)) {
    for (const child of node) json(child, out, arb);
  } else if (node && typeof node === "object") {
    for (const [key, value] of Object.entries(node)) {
      if (arb && key.startsWith("@")) continue; // ARB metadata
      json(value, out, arb);
    }
  }
}

function po(text: string, out: string[]) {
  let cur: string | null = null;
  for (const raw of text.split(LINES)) {
    const line = raw.trim();
    const m = /^(msgid|msgid_plural)\s+"(.*)"\s*$/.exec(line);
    const cont = /^"(.*)"\s*$/.exec(line);
    if (m) {
      if (cur !== null) add(out, unescape(cur));
      cur = m[2];
    } else if (cur !== null && cont) {
      cur += cont[1];
    } else if (cur !== null) {
      add(out, unescape(cur)); // msgid "" (the header) adds nothing
      cur = null;
    }
  }
  if (cur !== null) add(out, unescape(cur));
}

const SOURCE_HEADER = /^(source|en|en[-_][a-z]{2}|english|text|value|string|default|original)$/i;

function detectDelimiter(text: string): string {
  const first = text.split(LINES, 1)[0] ?? "";
  const n = (c: string) => first.split(c).length - 1;
  const commas = n(","), semis = n(";"), tabs = n("\t");
  if (tabs > commas && tabs > semis) return "\t";
  return semis > commas ? ";" : ",";
}

/** One column of source text: a header named like "source"/"en"/"text", else the second column. */
function csv(text: string, delim: string, out: string[]) {
  const rows = parseCsv(text, delim);
  if (!rows.length) return;
  const header = rows[0];
  let col = header.findIndex((h) => SOURCE_HEADER.test(h.trim()));
  const start = col >= 0 || looksLikeHeader(header) ? 1 : 0;
  if (col < 0) col = header.length > 1 ? 1 : 0;
  for (const row of rows.slice(start)) {
    if (col < row.length) add(out, row[col]);
  }
}

function looksLikeHeader(row: string[]): boolean {
  return row.length > 0 && /^(key|keys|id|name|string_?id|identifier|term)$/i.test(row[0].trim());
}

function parseCsv(text: string, delim: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let cell = "";
  let quoted = false;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (quoted) {
      if (ch === '"' && text[i + 1] === '"') {
        cell += '"';
        i++;
      } else if (ch === '"') quoted = false;
      else cell += ch;
    } else if (ch === '"') {
      quoted = true;
    } else if (ch === delim) {
      row.push(cell);
      cell = "";
    } else if (ch === "\n" || ch === "\r") {
      if (ch === "\r" && text[i + 1] === "\n") i++;
      row.push(cell);
      cell = "";
      rows.push(row);
      row = [];
    } else {
      cell += ch;
    }
  }
  if (cell || row.length) {
    row.push(cell);
    rows.push(row);
  }
  return rows;
}

function indexOfSeparator(line: string): number {
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (c === "\\") {
      i++;
      continue;
    }
    if (c === "=" || c === ":") return i;
  }
  return -1;
}

function unescape(s: string): string {
  return s.replaceAll("\\n", "\n").replaceAll("\\t", "\t").replaceAll('\\"', '"').replaceAll("\\\\", "\\");
}

/** Text content of an XML fragment: inline tags dropped, CDATA kept, entities decoded. */
function xmlText(xml: string): string {
  return xml
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, (_, cdata: string) => cdata.replace(/[<>&]/g, (c) => `&#${c.charCodeAt(0)};`))
    .replace(/<[^>]*>/g, "")
    .replace(/&(#x[0-9a-f]+|#\d+|lt|gt|amp|quot|apos);/gi, (_, e: string) => {
      const k = e.toLowerCase();
      if (k.startsWith("#x")) return String.fromCodePoint(parseInt(k.slice(2), 16));
      if (k.startsWith("#")) return String.fromCodePoint(parseInt(k.slice(1), 10));
      return { lt: "<", gt: ">", amp: "&", quot: '"', apos: "'" }[k] ?? "";
    });
}

export type FileStat = { name: string; strings: number; words: number };

/** Unique strings across files (a string repeated in two files is translated once). */
export function summarizeFiles(
  files: { name: string; content: string }[],
  countWords: (s: string) => number,
): { strings: number; words: number; files: FileStat[] } {
  const unique = new Set<string>();
  const stats: FileStat[] = [];
  for (const f of files) {
    const strings = fromFile(f.name, f.content);
    let fileWords = 0;
    for (const s of strings) {
      if (!unique.has(s)) {
        unique.add(s);
        fileWords += countWords(s);
      }
    }
    stats.push({ name: f.name, strings: strings.length, words: fileWords });
  }
  let words = 0;
  for (const s of unique) words += countWords(s);
  return { strings: unique.size, words, files: stats };
}
