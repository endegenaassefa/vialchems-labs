import fs from "node:fs";
import http from "node:http";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "../../vector-bio-supply-demo");
const portArg = process.argv.find((arg) => arg.startsWith("--port="));
const port = Number(portArg?.split("=")[1] || process.env.PORT || 4179);

const types = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".pdf": "application/pdf",
  ".svg": "image/svg+xml; charset=utf-8"
};

function safePath(urlPath) {
  const decoded = decodeURIComponent(urlPath.split("?")[0]);
  const normalized = path.normalize(decoded === "/" ? "/index.html" : decoded);
  const candidate = path.join(root, normalized);
  if (!candidate.startsWith(root)) return null;
  return candidate;
}

const server = http.createServer((request, response) => {
  const filePath = safePath(request.url || "/");
  if (!filePath || !fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
    response.writeHead(404, { "content-type": "text/plain; charset=utf-8" });
    response.end("Not found");
    return;
  }
  response.writeHead(200, {
    "content-type": types[path.extname(filePath)] || "application/octet-stream"
  });
  fs.createReadStream(filePath).pipe(response);
});

server.listen(port, "127.0.0.1", () => {
  console.log(`Vector demo server listening at http://127.0.0.1:${port}`);
});
