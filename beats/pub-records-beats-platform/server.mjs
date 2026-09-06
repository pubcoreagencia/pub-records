import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { extname, join, normalize } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL(".", import.meta.url));
const envPort = typeof process !== "undefined" && process.env ? process.env.PORT : undefined;
const port = Number(globalThis.PUB_RECORDS_BEATS_PORT || envPort || 4173);

const mimeTypes = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".wav": "audio/wav",
  ".ico": "image/x-icon"
};

function resolveStaticPath(urlPath) {
  const cleanPath = normalize(decodeURIComponent(urlPath.split("?")[0])).replace(/^(\.\.[/\\])+/, "");
  const candidate = join(root, cleanPath === "/" ? "index.html" : cleanPath);
  if (!candidate.startsWith(root)) return join(root, "index.html");
  return candidate;
}

export const server = createServer(async (req, res) => {
  try {
    const requestedPath = resolveStaticPath(req.url || "/");
    const ext = extname(requestedPath);
    const file = await readFile(requestedPath);
    res.writeHead(200, {
      "content-type": mimeTypes[ext] || "application/octet-stream",
      "cache-control": [".html", ".js", ".css"].includes(ext) ? "no-store" : "public, max-age=3600"
    });
    res.end(file);
  } catch (error) {
    try {
      const html = await readFile(join(root, "index.html"));
      res.writeHead(200, { "content-type": "text/html; charset=utf-8", "cache-control": "no-store" });
      res.end(html);
    } catch {
      res.writeHead(500, { "content-type": "text/plain; charset=utf-8" });
      res.end("PUB RECORDS Beats: erro ao carregar a aplicacao.");
    }
  }
});

server.listen(port, () => {
  console.log("PUB RECORDS Beats rodando em http://localhost:" + port);
});
