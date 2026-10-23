// src/app.js
// Merakit aplikasi Express: middleware, route, dan penangan error.
// Sengaja dipisah dari server.js supaya nanti bisa dites tanpa menyalakan server.

import express from "express";
import cors from "cors";
import { pool } from "./db.js";
import { catatRequest } from "./middleware/logger.js";
import { tidakDitemukan, tanganiError } from "./middleware/error.js";
import { dashboardRouter } from "./routes/dashboard.routes.js";

export const app = express();

// CORS: izinkan hanya frontend kita (Vite di port 5173) memanggil API ini dari browser
app.use(cors({ origin: process.env.CORS_ORIGIN ?? "http://localhost:5173" }));
app.use(catatRequest);

// Health check: dipakai untuk mengecek "server hidup dan bisa bicara dengan database?"
app.get("/api/health", async (req, res) => {
  await pool.query("SELECT 1");
  res.json({ status: "ok" });
});

// Semua endpoint dashboard diawali /api
app.use("/api", dashboardRouter);

// Urutan penting: dua baris ini harus paling akhir
app.use(tidakDitemukan);
app.use(tanganiError);
