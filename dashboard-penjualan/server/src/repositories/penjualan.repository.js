// src/repositories/penjualan.repository.js
// Lapisan REPOSITORY: satu-satunya tempat yang berisi SQL.
// Lapisan lain cukup memanggil fungsi di sini tanpa tahu isi query-nya.

import { pool } from "../db.js";

// Menyusun bagian WHERE dari filter secara aman.
// Hasil untuk { dari: '2017-01-01', wilayah: 'West' }:
//   where = "WHERE order_date >= $1 AND region = $2"
//   nilai = ['2017-01-01', 'West']
export function susunWhere(filter) {
  const syarat = [];
  const nilai = [];

  if (filter.dari) {
    nilai.push(filter.dari);
    syarat.push(`order_date >= $${nilai.length}`);
  }
  if (filter.sampai) {
    nilai.push(filter.sampai);
    syarat.push(`order_date <= $${nilai.length}`);
  }
  if (filter.wilayah) {
    nilai.push(filter.wilayah);
    syarat.push(`region = $${nilai.length}`);
  }
  if (filter.kategori) {
    nilai.push(filter.kategori);
    syarat.push(`category = $${nilai.length}`);
  }

  const where = syarat.length > 0 ? `WHERE ${syarat.join(" AND ")}` : "";
  return { where, nilai };
}

// Angka total untuk kartu KPI
export async function ambilRingkasan(filter) {
  const { where, nilai } = susunWhere(filter);
  const { rows } = await pool.query(
    `SELECT
       COALESCE(ROUND(SUM(sales), 2), 0)::float8  AS total_penjualan,
       COALESCE(ROUND(SUM(profit), 2), 0)::float8 AS total_laba,
       COUNT(DISTINCT order_id)::int               AS jumlah_pesanan,
       COUNT(DISTINCT customer_id)::int            AS jumlah_pelanggan,
       COALESCE(SUM(quantity), 0)::int             AS jumlah_barang
     FROM penjualan
     ${where}`,
    nilai,
  );
  return rows[0]; // hanya ada satu baris hasil
}

// Satuan waktu yang diizinkan, dan pasangannya untuk PostgreSQL
const SATUAN = {
  hari: { trunc: "day", format: "YYYY-MM-DD" },
  minggu: { trunc: "week", format: "YYYY-MM-DD" }, // tanggal = hari Senin minggu itu
  bulan: { trunc: "month", format: "YYYY-MM" },
};

// Penjualan dan laba per periode waktu, untuk grafik garis
export async function ambilTren(filter, satuan) {
  const { where, nilai } = susunWhere(filter);
  const { trunc, format } = SATUAN[satuan];
  // trunc dan format aman disisipkan langsung karena berasal dari daftar SATUAN di atas,
  // bukan dari ketikan pengguna.
  const { rows } = await pool.query(
    `SELECT
       to_char(date_trunc('${trunc}', order_date), '${format}') AS periode,
       ROUND(SUM(sales), 2)::float8  AS penjualan,
       ROUND(SUM(profit), 2)::float8 AS laba,
       COUNT(DISTINCT order_id)::int AS jumlah_pesanan
     FROM penjualan
     ${where}
     GROUP BY 1
     ORDER BY 1`,
    nilai,
  );
  return rows;
}

// Total per satu kolom pengelompokan: kategori, sub-kategori, wilayah, atau segmen.
// Nama kolom dipilih dari daftar tetap, lagi-lagi bukan dari ketikan pengguna.
const KOLOM_KELOMPOK = {
  kategori: "category",
  subkategori: "sub_category",
  wilayah: "region",
  segmen: "segment",
};

export async function ambilPerKelompok(filter, kelompok) {
  const kolom = KOLOM_KELOMPOK[kelompok];
  const { where, nilai } = susunWhere(filter);
  const { rows } = await pool.query(
    `SELECT
       ${kolom} AS nama,
       ROUND(SUM(sales), 2)::float8  AS penjualan,
       ROUND(SUM(profit), 2)::float8 AS laba,
       COUNT(DISTINCT order_id)::int AS jumlah_pesanan
     FROM penjualan
     ${where}
     GROUP BY ${kolom}
     ORDER BY penjualan DESC`,
    nilai,
  );
  return rows;
}

// Produk teratas berdasarkan penjualan atau laba
export async function ambilProdukTeratas(filter, urut, limit) {
  const kolomUrut = urut === "laba" ? "laba" : "penjualan"; // whitelist
  const { where, nilai } = susunWhere(filter);
  nilai.push(limit); // limit menjadi parameter terakhir
  const { rows } = await pool.query(
    `SELECT
       product_name AS nama,
       category     AS kategori,
       ROUND(SUM(sales), 2)::float8  AS penjualan,
       ROUND(SUM(profit), 2)::float8 AS laba,
       SUM(quantity)::int            AS jumlah_terjual
     FROM penjualan
     ${where}
     GROUP BY product_name, category
     ORDER BY ${kolomUrut} DESC
     LIMIT $${nilai.length}`,
    nilai,
  );
  return rows;
}

// Pilihan untuk dropdown filter di frontend
export async function ambilOpsiFilter() {
  // Tiga query independen dijalankan bersamaan, bukan bergantian
  const [tanggal, wilayah, kategori] = await Promise.all([
    pool.query(
      `SELECT to_char(MIN(order_date), 'YYYY-MM-DD') AS paling_awal,
              to_char(MAX(order_date), 'YYYY-MM-DD') AS paling_akhir
       FROM penjualan`,
    ),
    pool.query("SELECT DISTINCT region FROM penjualan ORDER BY region"),
    pool.query("SELECT DISTINCT category FROM penjualan ORDER BY category"),
  ]);
  return {
    tanggal: tanggal.rows[0],
    wilayah: wilayah.rows.map((r) => r.region),
    kategori: kategori.rows.map((r) => r.category),
  };
}
