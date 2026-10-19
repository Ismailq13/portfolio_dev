// scripts/import.js
// Membaca data/superstore.csv lalu memasukkan setiap barisnya ke tabel penjualan.
// Jalankan dari folder server:  npm run import

import fs from "node:fs";
import { parse } from "csv-parse/sync";
import { pool } from "../src/db.js";

// Mengubah "11/8/2016" (bulan/tanggal/tahun, gaya Amerika) menjadi "2016-11-08"
// (tahun-bulan-tanggal), format yang pasti dipahami PostgreSQL.
function keTanggalIso(teks) {
  const [bulan, tanggal, tahun] = teks.split("/");
  // padStart(2, '0') menambah nol di depan: "8" -> "08"
  return `${tahun}-${bulan.padStart(2, "0")}-${tanggal.padStart(2, "0")}`;
}

// Urutan kolom di tabel. Dipakai untuk menyusun perintah INSERT.
const KOLOM = [
  "row_id",
  "order_id",
  "order_date",
  "ship_date",
  "ship_mode",
  "customer_id",
  "customer_name",
  "segment",
  "country",
  "city",
  "state",
  "postal_code",
  "region",
  "product_id",
  "category",
  "sub_category",
  "product_name",
  "sales",
  "quantity",
  "discount",
  "profit",
];

// Mengubah satu baris CSV (objek dengan nama kolom asli) menjadi array nilai
// yang urutannya sama dengan KOLOM di atas.
function keNilai(r) {
  return [
    Number(r["Row ID"]),
    r["Order ID"],
    keTanggalIso(r["Order Date"]),
    keTanggalIso(r["Ship Date"]),
    r["Ship Mode"],
    r["Customer ID"],
    r["Customer Name"],
    r["Segment"],
    r["Country"],
    r["City"],
    r["State"],
    r["Postal Code"] || null, // kosong -> NULL
    r["Region"],
    r["Product ID"],
    r["Category"],
    r["Sub-Category"],
    r["Product Name"],
    r["Sales"], // angka dibiarkan teks; PostgreSQL yang mengubahnya ke NUMERIC dengan tepat
    Number(r["Quantity"]),
    r["Discount"],
    r["Profit"],
  ];
}

async function main() {
  // File dari Kaggle ini disimpan dengan encoding latin1 (Windows), bukan UTF-8.
  // Kalau dibaca sebagai UTF-8, huruf seperti "é" di nama kota/produk menjadi rusak.
  const isiFile = fs.readFileSync("data/superstore.csv", "latin1");

  // columns: true -> setiap baris menjadi objek, misalnya { 'Row ID': '1', 'Order ID': 'CA-2016-152156', ... }
  // trim: true    -> buang spasi berlebih di awal/akhir isi kolom
  const semuaBaris = parse(isiFile, {
    columns: true,
    skip_empty_lines: true,
    trim: true,
  });
  console.log(`Terbaca ${semuaBaris.length} baris dari CSV`);

  // Menyusun "$1, $2, ... $21". Nilai dikirim terpisah dari perintah SQL
  // (parameterized query), jadi aman dari SQL injection.
  const tandaNilai = KOLOM.map((_, i) => `$${i + 1}`).join(", ");
  const sql = `INSERT INTO penjualan (${KOLOM.join(", ")}) VALUES (${tandaNilai})`;

  // Ambil satu koneksi dari pool agar semua perintah berjalan di koneksi yang sama
  const client = await pool.connect();
  try {
    await client.query("BEGIN"); // mulai: semua masuk, atau tidak sama sekali
    await client.query("TRUNCATE penjualan"); // kosongkan dulu, supaya script aman dijalankan ulang

    for (const [i, r] of semuaBaris.entries()) {
      await client.query(sql, keNilai(r));
      // Tampilkan progres setiap 2.000 baris
      if ((i + 1) % 2000 === 0) console.log(`  ${i + 1} baris masuk...`);
    }

    await client.query("COMMIT"); // simpan permanen
    console.log(
      `Selesai: ${semuaBaris.length} baris tersimpan di tabel penjualan.`,
    );
  } catch (err) {
    await client.query("ROLLBACK"); // ada error: batalkan semua yang tadi
    console.error("Gagal, tidak ada data yang disimpan:", err.message);
    process.exitCode = 1;
  } finally {
    client.release(); // kembalikan koneksi ke pool
    await pool.end(); // tutup pool agar program bisa selesai
  }
}

main();
