// Fetch a page from a PUBLIC address only — the estimator takes URLs from
// anyone, so it must not become a way into private networks (SSRF). Same
// policy as the platform's OutboundUrlGuard:
// - http/https only, no credentials in the URL;
// - every resolved address must be public (no loopback, private, link-local,
//   CGNAT, multicast, reserved; IPv4 inside IPv6 forms is unwrapped). The
//   check runs in the socket's DNS lookup, so the address that is checked is
//   the one connected to (no DNS-rebinding window);
// - redirects are followed by hand (≤ 5), each hop checked again;
// - the body is capped (truncated) and the whole request has a deadline.
// Server-only (node:http).

import dns from "node:dns";
import http from "node:http";
import https from "node:https";
import net from "node:net";
import zlib from "node:zlib";
import type { Readable } from "node:stream";

const MAX_REDIRECTS = 5;
const USER_AGENT = "Mozilla/5.0 (compatible; SnaplingBot/1.0; +estimate)";
export const PRIVATE_ADDRESS = "Local and private network addresses are not allowed";

export class FetchRefused extends Error {}

export function checkUrl(raw: string): URL {
  let url: URL;
  try {
    url = new URL(raw.trim());
  } catch {
    throw new FetchRefused("Malformed URL");
  }
  if (url.protocol !== "http:" && url.protocol !== "https:") {
    throw new FetchRefused("Only http and https URLs are allowed");
  }
  if (url.username || url.password) throw new FetchRefused("URLs with credentials are not allowed");
  const host = url.hostname.replace(/^\[|\]$/g, "");
  if (!host) throw new FetchRefused("URL has no host");
  if (net.isIP(host) && !isPublicAddress(host)) throw new FetchRefused(PRIVATE_ADDRESS);
  return url;
}

export function isPublicAddress(ip: string): boolean {
  if (net.isIPv4(ip)) return isPublicV4(ip.split(".").map(Number));
  if (net.isIPv6(ip)) return isPublicV6(ipv6Bytes(ip));
  return false;
}

function isPublicV4([a, b, c]: number[]): boolean {
  if (a === 0 || a === 10 || a === 127) return false; // this network, private, loopback
  if (a === 169 && b === 254) return false; // link-local
  if (a === 172 && b >= 16 && b <= 31) return false; // private
  if (a === 192 && b === 168) return false; // private
  if (a === 100 && b >= 64 && b <= 127) return false; // CGNAT 100.64/10
  if (a === 192 && b === 0 && c === 0) return false; // 192.0.0.0/24
  if (a >= 224) return false; // multicast, reserved, broadcast
  return true;
}

function isPublicV6(b: number[]): boolean {
  const zero = (from: number, to: number) => b.slice(from, to).every((x) => x === 0);
  if (zero(0, 16)) return false; // ::
  if (zero(0, 15) && b[15] === 1) return false; // ::1
  if (b[0] === 0xff) return false; // multicast
  if (b[0] === 0xfe && (b[1] & 0xc0) === 0x80) return false; // link-local fe80::/10
  if (b[0] === 0xfe && (b[1] & 0xc0) === 0xc0) return false; // site-local fec0::/10
  if ((b[0] & 0xfe) === 0xfc) return false; // unique local fc00::/7
  // IPv4 carried inside IPv6: ::a.b.c.d, ::ffff:a.b.c.d, NAT64 64:ff9b::/96, 6to4 2002::/16
  if (zero(0, 12) || (zero(0, 10) && b[10] === 0xff && b[11] === 0xff)) return isPublicV4(b.slice(12));
  if (b[0] === 0 && b[1] === 0x64 && b[2] === 0xff && b[3] === 0x9b && zero(4, 12)) return isPublicV4(b.slice(12));
  if (b[0] === 0x20 && b[1] === 0x02) return isPublicV4(b.slice(2, 6));
  return true;
}

function ipv6Bytes(ip: string): number[] {
  let s = ip.split("%")[0];
  const v4 = /(\d+\.\d+\.\d+\.\d+)$/.exec(s);
  if (v4) {
    const [a, b, c, d] = v4[1].split(".").map(Number);
    s = s.slice(0, -v4[1].length) + ((a << 8) | b).toString(16) + ":" + ((c << 8) | d).toString(16);
  }
  const [head, tail] = s.includes("::") ? s.split("::") : [s, null];
  const h = head ? head.split(":") : [];
  const t = tail ? tail.split(":") : [];
  const groups = tail === null ? h : [...h, ...Array(8 - h.length - t.length).fill("0"), ...t];
  return groups.flatMap((g) => {
    const n = parseInt(g || "0", 16);
    return [n >> 8, n & 0xff];
  });
}

/** dns.lookup that refuses non-public addresses — used by the socket itself. */
const guardedLookup: net.LookupFunction = (hostname, options, callback) => {
  dns.lookup(hostname, { ...options, verbatim: true }, (err, address, family) => {
    if (err) return callback(err, address as string, family);
    const all = Array.isArray(address) ? address : [{ address, family }];
    if (!all.length || all.some((a) => !isPublicAddress(a.address))) {
      return callback(new FetchRefused(PRIVATE_ADDRESS) as NodeJS.ErrnoException, "", 0);
    }
    callback(null, address as string, family);
  });
};

// Keep-alive: a crawl reads many pages of one host; reusing the connection
// saves a TLS handshake per page. Each new socket still goes through guardedLookup.
const AGENTS = {
  http: new http.Agent({ keepAlive: true, maxSockets: 4 }),
  https: new https.Agent({ keepAlive: true, maxSockets: 4 }),
};

export type Page = { url: string; contentType: string; body: string };

/** GET an HTML page from a public URL; the body is truncated at maxBytes. */
export async function fetchHtml(raw: string, timeoutMs: number, maxBytes: number): Promise<Page> {
  let url = checkUrl(raw);
  const deadline = Date.now() + timeoutMs;
  for (let hop = 0; hop <= MAX_REDIRECTS; hop++) {
    const res = await get(url, Math.max(1, deadline - Date.now()), maxBytes);
    if (res.location !== null) {
      url = checkUrl(new URL(res.location, url).toString());
      continue;
    }
    if (res.status !== 200) throw new Error(`HTTP ${res.status}`);
    const type = res.contentType.toLowerCase();
    if (!(type.startsWith("text/") || type.includes("xml"))) throw new Error("Not an HTML page");
    return { url: url.toString(), contentType: res.contentType, body: decode(res.body, type) };
  }
  throw new Error("Too many redirects");
}

type Raw = { status: number; location: string | null; contentType: string; body: Buffer };

function get(url: URL, timeoutMs: number, maxBytes: number): Promise<Raw> {
  const secure = url.protocol === "https:";
  const client = secure ? https : http;
  return new Promise((resolve, reject) => {
    const req = client.get(
      url,
      {
        lookup: guardedLookup,
        agent: secure ? AGENTS.https : AGENTS.http,
        headers: {
          "User-Agent": USER_AGENT,
          Accept: "text/html,application/xhtml+xml;q=0.9,*/*;q=0.5",
          "Accept-Encoding": "gzip, deflate, br",
        },
      },
      (res) => {
        const status = res.statusCode ?? 0;
        if ([301, 302, 303, 307, 308].includes(status)) {
          res.resume();
          const location = res.headers.location;
          if (!location) return reject(new Error("Redirect without a Location header"));
          return resolve({ status, location, contentType: "", body: Buffer.alloc(0) });
        }
        const contentType = String(res.headers["content-type"] ?? "application/octet-stream");
        if (status !== 200) {
          res.resume();
          return resolve({ status, location: null, contentType, body: Buffer.alloc(0) });
        }
        const encoding = String(res.headers["content-encoding"] ?? "").toLowerCase();
        let stream: Readable = res;
        if (encoding === "gzip" || encoding === "x-gzip") stream = res.pipe(zlib.createGunzip());
        else if (encoding === "deflate") stream = res.pipe(zlib.createInflate());
        else if (encoding === "br") stream = res.pipe(zlib.createBrotliDecompress());

        const chunks: Buffer[] = [];
        let size = 0;
        const done = () => resolve({ status, location: null, contentType, body: Buffer.concat(chunks) });
        stream.on("data", (chunk: Buffer) => {
          const room = maxBytes - size;
          chunks.push(chunk.length > room ? chunk.subarray(0, room) : chunk);
          size += Math.min(chunk.length, room);
          if (size >= maxBytes) {
            req.destroy(); // enough — keep what we have
            done();
          }
        });
        stream.on("end", done);
        stream.on("error", (e) => (size > 0 ? done() : reject(e)));
      },
    );
    req.setTimeout(timeoutMs, () => req.destroy(new Error("Timed out")));
    req.on("error", reject);
  });
}

function decode(body: Buffer, contentType: string): string {
  const declared =
    /charset=["']?([\w-]+)/.exec(contentType)?.[1] ??
    /<meta[^>]+charset=["']?([\w-]+)/i.exec(body.subarray(0, 2048).toString("latin1"))?.[1];
  try {
    return new TextDecoder(declared ?? "utf-8").decode(body);
  } catch {
    return new TextDecoder("utf-8").decode(body);
  }
}
