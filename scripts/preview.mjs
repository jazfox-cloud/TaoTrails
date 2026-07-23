import fs from "node:fs";
import http from "node:http";
import path from "node:path";

const root = path.resolve("dist");
const port = Number(process.env.PORT || 4321);
const contentTypes = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".jpg": "image/jpeg",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
  ".xml": "application/xml; charset=utf-8",
};

const server = http.createServer((request, response) => {
  const url = new URL(request.url, `http://${request.headers.host || "127.0.0.1"}`);
  let pathname;
  try {
    pathname = decodeURIComponent(url.pathname);
  } catch {
    return sendNotFound(response);
  }

  if (pathname !== "/" && !pathname.endsWith("/") && path.posix.extname(pathname) === "") {
    response.writeHead(308, { Location: `${pathname}/${url.search}` });
    return response.end();
  }

  const relative = pathname === "/" ? "index.html" : pathname.endsWith("/") ? `${pathname.slice(1)}index.html` : pathname.slice(1);
  const absolute = path.resolve(root, relative);
  if (!absolute.startsWith(`${root}${path.sep}`) || !fs.existsSync(absolute) || !fs.statSync(absolute).isFile()) {
    return sendNotFound(response);
  }

  response.writeHead(200, { "Content-Type": contentTypes[path.extname(absolute).toLowerCase()] || "application/octet-stream" });
  fs.createReadStream(absolute).pipe(response);
});

server.listen(port, "127.0.0.1", () => {
  console.log(`Serving ${root} at http://127.0.0.1:${port}`);
});

function sendNotFound(response) {
  const file = path.join(root, "404.html");
  response.writeHead(404, { "Content-Type": "text/html; charset=utf-8" });
  fs.createReadStream(file).pipe(response);
}
