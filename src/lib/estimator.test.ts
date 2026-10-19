// The estimator's rules. Word counts, plan choice and file parsing use the same
// cases as the platform's WordCounterTest / PlanAdvisorTest / SourceExtractorTest
// (translator-saas) — keep them in step. Run: npm test

import { test } from "node:test";
import assert from "node:assert/strict";
import { parse } from "node-html-parser";
import { countWords } from "./wordcount.ts";
import { advise } from "./estimate.ts";
import { fromFile, summarizeFiles } from "./extract.ts";
import { fromHtml, pageKey } from "./crawl.ts";
import { checkUrl, isPublicAddress } from "./safe-fetch.ts";

test("counts words, not markup or numbers", () => {
  assert.equal(countWords("Get 100 free spins on your first deposit"), 7);
  assert.equal(countWords("Get <0>100 free spins</0> on your first deposit"), 7);
  assert.equal(countWords("Hello {{name}}, you have {count} new messages"), 5);
  assert.equal(countWords("Deposit $20 — win %s!"), 2);
  assert.equal(countWords("Don't miss the e-mail"), 4);
  assert.equal(countWords("  "), 0);
  assert.equal(countWords(null), 0);
});

test("counts other scripts", () => {
  assert.equal(countWords("Получите 100 бесплатных вращений"), 3);
  assert.equal(countWords("初回デポジットで"), 8);
  assert.equal(countWords("欢迎来到赌场！"), 6);
  assert.equal(countWords("LuckySpin へようこそ"), 6);
});

test("plan by monthly volume, first translation separately", () => {
  const a = advise(12_000, 5, 0.1);
  assert.equal(a.initialWords, 60_000);
  assert.equal(a.monthlyWords, 6_000);
  assert.equal(a.recommended.code, "indie");
  assert.equal(a.initialMonths, 1.2);
  assert.equal(a.startOnPlan, "studio");

  const b = advise(3_000, 8, 0.1);
  assert.equal(b.recommended.code, "studio");
  assert.equal(b.initialMonths, 0.1);
  assert.equal(b.startOnPlan, null);

  assert.equal(advise(250_000, 15, 0.1).recommended.code, "publisher");
  assert.equal(advise(250_000, 15, 0.1).limitedBy, "words");
  assert.equal(advise(1_000, 20, 0.1).limitedBy, "languages");
  assert.equal(advise(1_000, 20, 0.1).initialMonths, null);
});

test("page text like the SDK", () => {
  const root = parse(
    "<html><head><title>LuckySpin Casino</title>" +
      "<meta name=description content='Play slots online'></head><body>" +
      "<h1>Welcome back</h1><script>var x='nope'</script><img alt='Golden slot'>" +
      "<div data-snapling-skip>Skip me</div><code>npm i</code><p>$20</p><p>Don&rsquo;t&nbsp;stop</p></body></html>",
  );
  assert.deepEqual(fromHtml(root), ["LuckySpin Casino", "Play slots online", "Welcome back", "Golden slot", "Don’t stop"]);
});

test("localization files", () => {
  assert.deepEqual(fromFile("en.json", '{"a":{"b":"Play now"},"c":["Good luck"],"n":3}'), ["Play now", "Good luck"]);
  assert.deepEqual(fromFile("app_en.arb", '{"@@locale":"en","hi":"Hello","@hi":{"description":"Greeting"}}'), ["Hello"]);
  assert.deepEqual(
    fromFile("messages.po", 'msgid ""\nmsgstr ""\n"Language: de\\n"\n\nmsgid "Spin the "\n"wheel"\nmsgstr "Dreh das Rad"\n'),
    ["Spin the wheel"],
  );
  assert.deepEqual(
    fromFile("game.xlf", "<xliff><file><body><trans-unit id='1'><source>Claim <g>bonus</g> &amp; <![CDATA[<b>win</b>]]></source>" +
      "<target>Bonus</target></trans-unit></body></file></xliff>"),
    ["Claim bonus & <b>win</b>"],
  );
  assert.deepEqual(fromFile("Localizable.strings", '/* c */\n"play" = "Play now";\n"q" = "Say \\"hi\\"";'), ["Play now", 'Say "hi"']);
  assert.deepEqual(fromFile("messages.properties", "# c\nplay=Play now\nquit : Quit game"), ["Play now", "Quit game"]);
  assert.deepEqual(fromFile("strings.csv", 'key,en,de\nplay,Play now,Jetzt spielen\nquit,"Quit, really?",Beenden\n'), [
    "Play now",
    "Quit, really?",
  ]);
  assert.deepEqual(fromFile("table.csv", "play;Play now\nquit;Quit game\n"), ["Play now", "Quit game"]);
  assert.throws(() => fromFile("level.unity", "x"), /Supported/);
});

test("repeated strings across files count once", () => {
  // Same files as the platform's e2e check: 5 unique strings, 13 words.
  const sum = summarizeFiles(
    [
      { name: "en.json", content: JSON.stringify({ menu: { play: "Play now", quit: "Quit game" }, win: "You won {{count}} free spins!" }) },
      { name: "strings.csv", content: 'key,en,de\nshop.title,Item shop,Laden\nshop.buy,"Buy for 100 coins",Kaufen\n' },
      { name: "messages.po", content: 'msgid ""\nmsgstr ""\n\nmsgid "Play now"\nmsgstr "Jetzt spielen"\n' },
    ],
    countWords,
  );
  assert.equal(sum.strings, 5);
  assert.equal(sum.words, 13);
});

test("one page however it is linked", () => {
  const key = pageKey("https://books.toscrape.com/");
  for (const u of [
    "https://books.toscrape.com",
    "https://books.toscrape.com/index.html",
    "http://www.books.toscrape.com/index.htm",
    "https://books.toscrape.com/?page=2#top",
  ]) {
    assert.equal(pageKey(u), key, u);
  }
  assert.equal(pageKey("https://x.com/catalogue/travel_2/index.html"), pageKey("https://x.com/catalogue/travel_2/"));
  assert.notEqual(pageKey("https://x.com/index-of-games"), pageKey("https://x.com/"));
});

test("only public addresses", () => {
  for (const ip of ["127.0.0.1", "10.1.2.3", "172.16.0.1", "192.168.1.1", "169.254.169.254", "100.64.0.1", "0.0.0.0",
    "224.0.0.1", "255.255.255.255", "::1", "::", "fe80::1", "fd00::1", "::ffff:127.0.0.1", "::ffff:7f00:1",
    "64:ff9b::a00:1", "2002:c0a8:101::1"]) {
    assert.equal(isPublicAddress(ip), false, ip);
  }
  for (const ip of ["8.8.8.8", "1.1.1.1", "2606:4700:4700::1111", "::ffff:8.8.8.8"]) {
    assert.equal(isPublicAddress(ip), true, ip);
  }
  assert.throws(() => checkUrl("http://127.0.0.1:8080/"), /private/);
  assert.throws(() => checkUrl("http://[::1]/"), /private/);
  assert.throws(() => checkUrl("file:///etc/passwd"), /http/);
  assert.throws(() => checkUrl("https://user:pw@example.com/"), /credentials/);
  assert.equal(checkUrl("https://example.com/").hostname, "example.com");
});
