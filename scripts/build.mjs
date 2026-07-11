import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const out = path.join(root, "dist");
const include = [
  "about",
  "contact",
  "css",
  "js",
  "lifestyle",
  "public",
  "sacred-mountains",
  "privacy",
  "terms",
  "tao-te-ching",
  "taoism",
  "index.html",
  "_redirects",
  "robots.txt",
  "sitemap.xml"
];

fs.rmSync(out, { recursive: true, force: true });
fs.mkdirSync(out, { recursive: true });

for (const item of include) {
  const source = path.join(root, item);
  const target = path.join(out, item);
  if (!fs.existsSync(source)) continue;
  fs.cpSync(source, target, { recursive: true });
}

const policyLinks = '<span><a href="/about/">About</a> · <a href="/contact/">Contact</a> · <a href="/privacy/">Privacy</a> · <a href="/terms/">Terms</a></span>';
for (const file of walkHtml(out)) {
  const html = fs.readFileSync(file, "utf8").replace('<a href="/about/">Editorial standards</a>', policyLinks);
  fs.writeFileSync(file, html);
}

function walkHtml(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const target = path.join(directory, entry.name);
    return entry.isDirectory() ? walkHtml(target) : entry.name.endsWith(".html") ? [target] : [];
  });
}

console.log(`Built static site to ${path.relative(root, out)}`);
