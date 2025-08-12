import express, { Request, Response } from "express";
import cors from "cors";
import path from "path";
import { convertToRoman } from "./roman";

/**
 * Express server exposing REST and SSE endpoints for Roman numerals conversion.
 * - POST /api/convert: JSON body { number: number }
 * - GET /api/convert-sse/:number: Streams a single conversion result then closes
 */
export function createApp() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json({ limit: "1mb" }));
  app.use(express.static("public"));

  // Health endpoint for readiness/liveness checks
  app.get("/health", (_req: Request, res: Response) => {
    res.status(200).json({ status: "ok" });
  });

  // API: Convert using JSON
  app.post("/api/convert", async (req: Request, res: Response) => {
    try {
      const { number } = req.body ?? {};

      if (number === undefined || number === null) {
        return res.status(400).json({ error: "Field 'number' is required" });
      }

      const parsed = Number(number);
      if (!Number.isFinite(parsed) || !Number.isInteger(parsed)) {
        return res.status(400).json({ error: "Invalid number provided" });
      }

      try {
        const roman = convertToRoman(parsed);
        return res.status(200).json({ number: parsed, roman });
      } catch (err) {
        if (err instanceof RangeError || err instanceof TypeError) {
          return res.status(400).json({ error: err.message });
        }
        throw err;
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Internal server error";
      return res.status(500).json({ error: message });
    }
  });

  // SSE endpoint for streaming a single conversion result
  app.get("/api/convert-sse/:number", async (req: Request, res: Response) => {
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.setHeader("Access-Control-Allow-Origin", "*");

    const heartbeat = setInterval(() => {
      try {
        res.write(":\n\n");
      } catch {
        // ignore
      }
    }, 15000);

    const onClose = () => {
      clearInterval(heartbeat);
      try {
        res.end();
      } catch {
        // ignore
      }
    };
    req.on("close", onClose);

    try {
      const raw = req.params.number;
      const parsed = Number(raw);
      if (!Number.isFinite(parsed) || !Number.isInteger(parsed)) {
        res.write(`data: ${JSON.stringify({ error: "Invalid number provided" })}\n\n`);
        return onClose();
      }

      try {
        await new Promise((resolve) => setTimeout(resolve, 300));
        const roman = convertToRoman(parsed);
        res.write(`data: ${JSON.stringify({ number: parsed, roman })}\n\n`);
        return onClose();
      } catch (err) {
        const message = err instanceof Error ? err.message : "Conversion failed";
        res.write(`data: ${JSON.stringify({ error: message })}\n\n`);
        return onClose();
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Internal server error";
      try {
        res.write(`data: ${JSON.stringify({ error: message })}\n\n`);
      } finally {
        return onClose();
      }
    }
  });

  // Serve HTML
  app.get("/", (_req: Request, res: Response) => {
    res.sendFile(path.join(process.cwd(), "public", "index.html"));
  });

  // Fallback error handler (never expose stack in prod)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  app.use((err: Error, _req: Request, res: Response, _next: unknown) => {
    const statusCode = 500;
    const message = process.env.NODE_ENV === "production" ? "Internal server error" : err.message;
    res.status(statusCode).json({ error: message });
  });

  return app;
}

if (require.main === module) {
  const app = createApp();
  const port = Number(process.env.PORT) || 3000;
  app.listen(port, () => {
    // eslint-disable-next-line no-console
    console.log(`Server running on http://localhost:${port}`);
  });
}
