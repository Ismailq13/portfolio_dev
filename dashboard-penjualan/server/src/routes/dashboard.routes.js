// src/routes/dashboard.routes.js
// Lapisan ROUTE: menerima request HTTP, membaca parameter, memanggil service,
// lalu mengirim JSON. Tidak ada SQL dan tidak ada hitungan bisnis di sini.

import { Router } from "express";
import * as layanan from "../services/dashboard.service.js";
import { bacaFilter, bacaPilihan, bacaAngka } from "../services/filter.js";

export const dashboardRouter = Router();

// GET /api/ringkasan?dari=&sampai=&wilayah=&kategori=
dashboardRouter.get("/ringkasan", async (req, res) => {
  const filter = bacaFilter(req.query);
  res.json(await layanan.ringkasan(filter));
});

// GET /api/tren?satuan=bulan  (hari | minggu | bulan)
dashboardRouter.get("/tren", async (req, res) => {
  const filter = bacaFilter(req.query);
  const satuan = bacaPilihan(
    req.query.satuan,
    ["hari", "minggu", "bulan"],
    "bulan",
    "satuan",
  );
  res.json(await layanan.tren(filter, satuan));
});

// GET /api/per-kelompok?kelompok=kategori  (kategori | subkategori | wilayah | segmen)
dashboardRouter.get("/per-kelompok", async (req, res) => {
  const filter = bacaFilter(req.query);
  const kelompok = bacaPilihan(
    req.query.kelompok,
    ["kategori", "subkategori", "wilayah", "segmen"],
    "kategori",
    "kelompok",
  );
  res.json(await layanan.perKelompok(filter, kelompok));
});

// GET /api/produk-teratas?urut=penjualan&limit=10
dashboardRouter.get("/produk-teratas", async (req, res) => {
  const filter = bacaFilter(req.query);
  const urut = bacaPilihan(
    req.query.urut,
    ["penjualan", "laba"],
    "penjualan",
    "urut",
  );
  const limit = bacaAngka(req.query.limit, 10, 1, 50, "limit");
  res.json(await layanan.produkTeratas(filter, urut, limit));
});

// GET /api/opsi-filter
dashboardRouter.get("/opsi-filter", async (req, res) => {
  res.json(await layanan.opsiFilter());
});
