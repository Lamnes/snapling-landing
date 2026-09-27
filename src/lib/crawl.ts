// Read up to 25 pages of a site the way the SDK would and count its words.
// Mirrors the platform's EstimateService.fromUrl + SourceExtractor.fromHtml,
// so a site scanned here and in the dashboard gives the same numbers.
// Server-only. (Relative .ts imports so `npm test` can load it in plain Node.)

import { parse, NodeType, type HTMLElement, type Node } from "node-html-parser";
import { fetchHtml } from "./safe-fetch.ts";
import { isTranslatable, normalize } from "./extract.ts";
import { countWords } from "./wordcount.ts";

export const MAX_PAGES = 25;
const PAGE_BYTES = 3 * 1024 * 1024;
const PAGE_TIMEOUT_MS = 10_000;
const CRAWL_BUDGET_MS = 40_000;
const MAX_QUEUE = 300;

const SKIP_TAGS = new Set(["script", "style", "noscript", "code", "pre", "textarea", "svg", "template"]);
const TRANSLATABLE_ATTRS = ["placeholder", "alt", "title", "aria-label"];
const SKIP_EXT = /\.(pdf|jpe?g|png|gif|webp|svg|ico|zip|rar|7z|gz|mp4|webm|mp3|wav|css|js|json|xml|txt|apk|exe|dmg)$/i;
const LANG_SEGMENT = /^[a-z]{2}([-_][a-z]{2,4})?$/i;
const INDEX_PAGE = /\/index\.(html?|php)$/i;

export type PageStat = { url: string; strings: number; newWords: number };
export type SiteScan = {
  host: string;
  pages: PageStat[];
  clientRendered: boolean; // the site renders its text in the browser — a server scan sees little
  truncated: boolean; // stopped at the page / time limit
  strings: number; // unique strings
  words: number;
};

/** Visible text nodes, translatable attributes, title and meta description. */
export function fromHtml(root: HTMLElement): string[] {
  const out: string[] = [];
  const add = (raw: string | undefined) => {
    const s = normalize(raw);
    if (isTranslatable(s)) out.push(s);
  };
  add(root.querySelector("title")?.text);
  add(root.querySelector("meta[name=description]")?.getAttribute("content"));
  // A page may omit <body> (valid HTML) — then walk everything but <head>.
  const body = root.querySelector("body") ?? root;
  const walk = (node: Node) => {
    if (node.nodeType === NodeType.TEXT_NODE) {
      add(node.text);
      return;
    }
    if (node.nodeType !== NodeType.ELEMENT_NODE) return;
    const el = node as HTMLElement;
    const tag = (el.rawTagName ?? "").toLowerCase();
    if (SKIP_TAGS.has(tag) || tag === "head" || el.hasAttribute("data-snapling-skip")) return;
    for (const attr of TRANSLATABLE_ATTRS) {
      if (el.hasAttribute(attr)) add(el.getAttribute(attr));
    }
    for (const child of el.childNodes) walk(child);
  };
  walk(body);
  return out;
}

export async function scanSite(startUrl: string): Promise<SiteScan> {
  const start = new URL(startUrl);
  const host = bareHost(start.hostname);
  const langSegment = firstSegment(start.pathname);
  const queue: string[] = [clean(start.toString())];
  const seen = new Set<string>([pageKey(start.toString())]);

  const unique = new Set<string>();
  const pages: PageStat[] = [];
  let clientRendered = false;
  const deadline = Date.now() + CRAWL_BUDGET_MS;

  while (queue.length && pages.length < MAX_PAGES && Date.now() < deadline) {
    const pageUrl = queue.shift()!;
    let page;
    try {
      page = await fetchHtml(pageUrl, Math.min(PAGE_TIMEOUT_MS, deadline - Date.now()), PAGE_BYTES);
    } catch (e) {
      if (!pages.length) throw new ScanFailed(`Couldn't open ${pageUrl}: ${e instanceof Error ? e.message : e}`);
      continue;
    }
    const root = parse(page.body, { comment: false });
    const strings = fromHtml(root);
    let pageWords = 0;
    let newWords = 0;
    for (const s of strings) {
      const w = countWords(s);
      pageWords += w;
      if (!unique.has(s)) {
        unique.add(s);
        newWords += w;
      }
    }
    if (!pages.length && pageWords < 40 && root.querySelector("script[src]")) clientRendered = true;
    pages.push({ url: page.url, strings: strings.length, newWords });
    seen.add(pageKey(page.url)); // after redirects

    for (const a of root.querySelectorAll("a[href]")) {
      let link: string;
      try {
        link = clean(new URL(a.getAttribute("href") ?? "", page.url).toString());
      } catch {
        continue;
      }
      if (queue.length > MAX_QUEUE || !followable(link, host, langSegment)) continue;
      const key = pageKey(link);
      if (!seen.has(key)) {
        seen.add(key);
        queue.push(link);
      }
    }
  }

  let words = 0;
  for (const s of unique) words += countWords(s);
  return { host: start.hostname, pages, clientRendered, truncated: queue.length > 0, strings: unique.size, words };
}

export class ScanFailed extends Error {}

function followable(link: string, host: string, langSegment: string): boolean {
  let u: URL;
  try {
    u = new URL(link);
  } catch {
    return false;
  }
  if (!u.protocol.startsWith("http") || bareHost(u.hostname) !== host) return false;
  if (SKIP_EXT.test(u.pathname)) return false;
  // Another language version of the same page isn't more source text.
  const seg = firstSegment(u.pathname);
  return !(LANG_SEGMENT.test(seg) && seg.toLowerCase() !== langSegment.toLowerCase());
}

/** Without fragment and query (pagination / tracking variants of one page). */
function clean(url: string): string {
  const s = url.replace(/[?#].*$/, "");
  return s.endsWith("/") && s.split("/").length - 1 > 3 ? s.slice(0, -1) : s;
}

/** One page, however it's linked: "/", "/index.html", "http://www." are the same page. */
export function pageKey(url: string): string {
  const s = clean(url)
    .replace(INDEX_PAGE, "")
    .replace(/^https?:\/\/(www\.)?/i, "")
    .toLowerCase();
  return s.endsWith("/") ? s.slice(0, -1) : s;
}

function bareHost(host: string): string {
  const h = host.toLowerCase();
  return h.startsWith("www.") ? h.slice(4) : h;
}

function firstSegment(path: string): string {
  const p = path.startsWith("/") ? path.slice(1) : path;
  const slash = p.indexOf("/");
  return slash >= 0 ? p.slice(0, slash) : p;
}
