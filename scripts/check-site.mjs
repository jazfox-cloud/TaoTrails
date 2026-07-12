import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const required = [
  "index.html",
  "taoism/index.html",
  "taoism/origins/index.html",
  "tao-te-ching/index.html",
  "tao-te-ching/chapter-1/index.html",
  "sacred-mountains/index.html",
  "sacred-mountains/wudang-mountain/index.html",
  "sacred-mountains/zhongnan-mountain/index.html",
  "lifestyle/temple-etiquette/index.html",
  "lifestyle/taoist-tea/index.html",
  "about/index.html",
  "contact/index.html",
  "privacy/index.html",
  "terms/index.html",
  "css/styles.css",
  "js/site.js",
  "js/email-link.js",
  "public/assets/taotrails-hero-1600.jpg",
  "public/assets/taotrails-hero-900.jpg",
  "public/assets/mountain-wudang.jpg",
  "public/assets/mountain-zhongnan.jpg",
  "public/assets/mountain-qingcheng.jpg",
  "public/assets/mountain-longhu.jpg",
  "public/assets/mountain-wudang-square.jpg",
  "public/assets/mountain-zhongnan-square.jpg",
  "public/assets/mountain-qingcheng-square.jpg",
  "public/assets/mountain-longhu-square.jpg",
  "public/assets/tao-te-ching-thumb.jpg",
  "public/assets/taoist-tea-mountain-table.jpg",
  "functions/_middleware.js",
  "_redirects",
  "robots.txt",
  "sitemap.xml"
];

let failed = false;

for (const file of required) {
  const absolute = path.join(root, file);
  if (!fs.existsSync(absolute)) {
    console.error(`Missing required file: ${file}`);
    failed = true;
  }
}

const htmlFiles = required.filter((file) => file.endsWith(".html"));
for (const file of htmlFiles) {
  const html = fs.readFileSync(path.join(root, file), "utf8");
  for (const marker of ["<title>", 'name="description"', 'rel="canonical"']) {
    if (!html.includes(marker)) {
      console.error(`${file} is missing ${marker}`);
      failed = true;
    }
  }
  if (/mailto:|hello@taotrails\.com/i.test(html)) {
    console.error(`${file} exposes a raw email address to Cloudflare Email Protection`);
    failed = true;
  }
}

if (failed) {
  process.exit(1);
}

console.log(`Checked ${required.length} files. TaoTrails static MVP looks ready.`);
