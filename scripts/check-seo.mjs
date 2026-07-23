import fs from "node:fs";
import path from "node:path";

const rootArgument = process.argv.find((argument) => argument.startsWith("--root="));
const root = path.resolve(rootArgument ? rootArgument.slice("--root=".length) : ".");
const productionOrigin = "https://taotrails.com";
const socialImageUrl = `${productionOrigin}/public/assets/taotrails-social.png`;
const failures = [];
const notes = [];

const read = (file) => fs.readFileSync(path.join(root, file), "utf8");
const fail = (message) => failures.push(message);
const one = (html, pattern) => html.match(pattern)?.[1] ?? null;
const count = (html, pattern) => [...html.matchAll(pattern)].length;
const stripTags = (value) => value.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
const localFileForUrl = (url) => {
  const pathname = new URL(url, productionOrigin).pathname;
  return pathname === "/" ? "index.html" : `${pathname.slice(1)}index.html`;
};

const sitemap = read("sitemap.xml");
const sitemapUrls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
const uniqueSitemapUrls = new Set(sitemapUrls);

if (sitemapUrls.length !== 14 || uniqueSitemapUrls.size !== 14) {
  fail(`sitemap must contain 14 unique URLs; found ${sitemapUrls.length} entries and ${uniqueSitemapUrls.size} unique URLs`);
}

const pages = new Map();
const titleOwners = new Map();
const descriptionOwners = new Map();
const inbound = new Map(sitemapUrls.map((url) => [new URL(url).pathname, new Map()]));
let imageCount = 0;
let informativeAltCount = 0;
let emptyAltCount = 0;

for (const url of sitemapUrls) {
  if (!url.startsWith(`${productionOrigin}/`) && url !== `${productionOrigin}/`) {
    fail(`sitemap URL is not an absolute HTTPS apex URL: ${url}`);
    continue;
  }

  const file = localFileForUrl(url);
  const absolute = path.join(root, file);
  if (!fs.existsSync(absolute)) {
    fail(`sitemap URL has no local page: ${url} -> ${file}`);
    continue;
  }

  const html = read(file);
  pages.set(new URL(url).pathname, { url, file, html });
  const title = one(html, /<title>([^<]+)<\/title>/i);
  const description = one(html, /<meta name="description" content="([^"]*)"/i);
  const canonical = one(html, /<link rel="canonical" href="([^"]*)"/i);
  const robots = one(html, /<meta name="robots" content="([^"]*)"/i);
  const h1Count = count(html, /<h1\b[^>]*>/gi);

  if (!title) fail(`${file} is missing a title`);
  if (!description) fail(`${file} is missing a description`);
  if (description && (description.length < 110 || description.length > 160)) {
    fail(`${file} description length ${description.length} is outside 110-160`);
  }
  if (canonical !== url) fail(`${file} canonical ${canonical} does not match ${url}`);
  if (robots?.toLowerCase().includes("noindex")) fail(`${file} is in the sitemap but has noindex`);
  if (h1Count !== 1) fail(`${file} has ${h1Count} H1 elements`);
  if (/http-equiv=["']refresh/i.test(html)) fail(`${file} contains a meta refresh`);
  if (/(location\.(href|replace|assign)|window\.location)/i.test(html)) fail(`${file} contains a JavaScript redirect`);

  if (title) {
    if (titleOwners.has(title)) fail(`${file} duplicates the title from ${titleOwners.get(title)}`);
    titleOwners.set(title, file);
  }
  if (description) {
    if (descriptionOwners.has(description)) fail(`${file} duplicates the description from ${descriptionOwners.get(description)}`);
    descriptionOwners.set(description, file);
  }

  const requiredSocial = {
    "og:title": title,
    "og:description": description,
    "og:url": canonical,
    "og:type": null,
    "og:image": socialImageUrl,
    "og:image:width": "1200",
    "og:image:height": "630",
    "og:image:type": "image/png",
    "og:image:alt": "TaoTrails abstract mountain trail beneath a rising sun",
  };
  for (const [property, expected] of Object.entries(requiredSocial)) {
    const values = [...html.matchAll(new RegExp(`<meta property="${property}" content="([^"]*)"`, "gi"))].map((match) => match[1]);
    if (values.length !== 1) fail(`${file} must contain exactly one ${property}; found ${values.length}`);
    if (expected !== null && values[0] !== expected) fail(`${file} ${property} does not match the expected value`);
  }
  const ogType = one(html, /<meta property="og:type" content="([^"]*)"/i);
  if (!["website", "article"].includes(ogType)) fail(`${file} has invalid og:type ${ogType}`);

  const requiredTwitter = {
    "twitter:card": "summary_large_image",
    "twitter:title": title,
    "twitter:description": description,
    "twitter:image": socialImageUrl,
    "twitter:image:alt": "TaoTrails abstract mountain trail beneath a rising sun",
  };
  for (const [name, expected] of Object.entries(requiredTwitter)) {
    const values = [...html.matchAll(new RegExp(`<meta name="${name}" content="([^"]*)"`, "gi"))].map((match) => match[1]);
    if (values.length !== 1) fail(`${file} must contain exactly one ${name}; found ${values.length}`);
    if (values[0] !== expected) fail(`${file} ${name} does not match the expected value`);
  }

  for (const match of html.matchAll(/<script\b[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi)) {
    try {
      JSON.parse(match[1]);
    } catch {
      fail(`${file} contains invalid JSON-LD`);
    }
  }

  for (const match of html.matchAll(/<img\b([^>]*)>/gi)) {
    imageCount += 1;
    const alt = match[1].match(/\balt="([^"]*)"/i)?.[1];
    if (alt === undefined) fail(`${file} has an image without an alt attribute`);
    else if (alt === "") emptyAltCount += 1;
    else informativeAltCount += 1;

    const source = match[1].match(/\bsrc="([^"]+)"/i)?.[1];
    if (source?.startsWith("/")) {
      const resource = path.join(root, source.slice(1));
      if (!fs.existsSync(resource)) fail(`${file} references a missing image: ${source}`);
    }
  }
}

for (const [sourcePath, page] of pages) {
  for (const match of page.html.matchAll(/<a\b([^>]*)href="([^"]+)"([^>]*)>([\s\S]*?)<\/a>/gi)) {
    const attributes = `${match[1]} ${match[3]}`;
    const href = match[2];
    if (!href.startsWith("/") || href.startsWith("//")) continue;
    const targetUrl = new URL(href, productionOrigin);
    const targetPath = targetUrl.pathname;
    const hasExtension = path.posix.extname(targetPath) !== "";
    if (!hasExtension && targetPath !== "/" && !targetPath.endsWith("/")) {
      fail(`${page.file} links to a redirecting slashless URL: ${href}`);
    }

    if (inbound.has(targetPath)) {
      if (sourcePath !== targetPath && !/\brel="[^"]*nofollow/i.test(attributes)) {
        const sources = inbound.get(targetPath);
        if (!sources.has(sourcePath)) sources.set(sourcePath, []);
        sources.get(sourcePath).push(stripTags(match[4]));
      }
      continue;
    }

    const localTarget = hasExtension
      ? path.join(root, targetPath.slice(1))
      : path.join(root, targetPath.slice(1), "index.html");
    if (!fs.existsSync(localTarget)) fail(`${page.file} has a broken internal link: ${href}`);
  }
}

for (const [pathname, sources] of inbound) {
  if (pathname !== "/" && sources.size === 0) fail(`${pathname} is an orphan page`);
  if (sources.size === 1) {
    notes.push(`weak internal link: ${pathname} has one dofollow source (${[...sources.keys()][0]})`);
  }
}

const robotsText = read("robots.txt");
if (!/^Sitemap: https:\/\/taotrails\.com\/sitemap\.xml$/m.test(robotsText)) {
  fail("robots.txt does not declare the canonical sitemap");
}

const notFound = read("404.html");
if (!/<meta name="robots" content="noindex, follow">/i.test(notFound)) fail("404.html must be noindex, follow");
if (/rel="canonical"|property="og:url"|property="og:image"|name="twitter:image"/i.test(notFound)) {
  fail("404.html must not contain canonical or social URL/image metadata");
}
if (count(notFound, /<h1\b[^>]*>/gi) !== 1) fail("404.html must contain exactly one H1");

const socialSvg = read("public/assets/taotrails-social.svg");
if (!/^<svg[\s\S]*<\/svg>\s*$/i.test(socialSvg) || !/width="1200" height="630"/i.test(socialSvg)) {
  fail("social SVG is not a complete 1200x630 SVG document");
}

const socialPng = fs.readFileSync(path.join(root, "public/assets/taotrails-social.png"));
const pngSignature = "89504e470d0a1a0a";
if (socialPng.subarray(0, 8).toString("hex") !== pngSignature) fail("social PNG has an invalid signature");
if (socialPng.readUInt32BE(16) !== 1200 || socialPng.readUInt32BE(20) !== 630) {
  fail(`social PNG must be 1200x630; found ${socialPng.readUInt32BE(16)}x${socialPng.readUInt32BE(20)}`);
}
if (socialPng[25] !== 2) fail(`social PNG must be opaque RGB; found PNG color type ${socialPng[25]}`);

if (failures.length) {
  for (const failure of failures) console.error(`SEO check failed: ${failure}`);
  process.exit(1);
}

console.log(`SEO check passed for ${pages.size} indexable pages in ${path.relative(process.cwd(), root) || "."}.`);
console.log(`Sitemap: ${sitemapUrls.length} unique canonical URLs.`);
console.log(`Images: ${imageCount} total, ${informativeAltCount} informative alt, ${emptyAltCount} empty alt.`);
for (const note of notes) console.log(note);
