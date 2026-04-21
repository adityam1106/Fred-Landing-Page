import "dotenv/config";
import express from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { handleWaitlistSubmission } from "./waitlist-handler.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "..");
const clientDistPath = path.resolve(projectRoot, "dist");
const clientIndexPath = path.resolve(clientDistPath, "index.html");

const app = express();
const port = Number(process.env.PORT ?? 3001);

app.set("trust proxy", true);
app.use(express.json({ limit: "16kb" }));

app.get("/api/health", (_request, response) => {
  response.json({ ok: true });
});

app.post("/api/waitlist", async (request, response) => {
  const result = await handleWaitlistSubmission({
    body: request.body,
    rateLimitKey: request.ip ?? "unknown",
  });

  response.status(result.statusCode).json(result.body);
});

if (process.env.NODE_ENV === "production") {
  app.use(express.static(clientDistPath));

  app.get("*", (request, response, next) => {
    if (request.path.startsWith("/api")) {
      next();
      return;
    }

    response.sendFile(clientIndexPath);
  });
}

app.listen(port, () => {
  console.log(`Fred server listening on http://localhost:${port}`);
});
