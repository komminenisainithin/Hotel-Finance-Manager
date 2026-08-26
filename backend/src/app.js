import express from "express";
import cors from "cors";
import routes from "./routes/index.js";

const app = express();

const defaultOrigins = [
  "http://localhost:3000",
  "https://tiffinbooks.vercel.app",
  "https://www.tiffinbooks.vercel.app",
];

const envOrigins = (process.env.CORS_ORIGINS || "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

const allowedOrigins = [...new Set([...defaultOrigins, ...envOrigins])];

function isAllowedOrigin(origin) {
  if (!origin) return true;
  if (allowedOrigins.includes(origin)) return true;

  // Allow Vercel preview deployments for this project
  try {
    const { hostname } = new URL(origin);
    if (
      hostname.endsWith(".vercel.app") &&
      (hostname.includes("tiffinbooks") ||
        hostname.includes("hotel-finance-manager"))
    ) {
      return true;
    }
  } catch {
    return false;
  }

  return false;
}

app.use(
  cors({
    origin(origin, callback) {
      if (isAllowedOrigin(origin)) {
        callback(null, true);
        return;
      }

      // Do not throw — throwing returns 500 without CORS headers,
      // which browsers report as a confusing CORS error.
      console.warn(`CORS blocked for origin: ${origin}`);
      callback(null, false);
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Accept"],
  })
);
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Server is running...");
});

app.use("/api", routes);

export default app;
