const http = require("http");
const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "build");
const port = Number(process.env.PORT || 3000);

const mimeTypes = {
  ".html": "text/html",
  ".js": "application/javascript",
  ".css": "text/css",
  ".json": "application/json",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
};

const serveFile = (target, res) => {
  fs.readFile(target, (error, content) => {
    if (error) {
      res.writeHead(404);
      res.end("Not found");
      return;
    }

    const ext = path.extname(target);
    res.writeHead(200, { "Content-Type": mimeTypes[ext] || "text/plain" });
    res.end(content);
  });
};

http
  .createServer((req, res) => {
    const requested = req.url === "/" ? "/index.html" : req.url;
    const filePath = path.join(root, requested.split("?")[0]);

    fs.stat(filePath, (error, stat) => {
      if (!error && stat.isFile()) {
        serveFile(filePath, res);
        return;
      }

      serveFile(path.join(root, "index.html"), res);
    });
  })
  .listen(port, () => {
    console.log(`Frontend build server running on http://localhost:${port}`);
  });
