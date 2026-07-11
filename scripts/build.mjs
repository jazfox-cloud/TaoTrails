import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const out = path.join(root, "dist");
const include = [
  "about",
  "css",
  "js",
  "lifestyle",
  "public",
  "sacred-mountains",
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

console.log(`Built static site to ${path.relative(root, out)}`);
