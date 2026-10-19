-- schema.sql: membuat tabel penjualan dari nol.
-- Aman dijalankan berulang kali karena tabel lama dihapus dulu.

DROP TABLE IF EXISTS penjualan;

CREATE TABLE penjualan (
  row_id        INTEGER PRIMARY KEY,   -- nomor baris, unik, jadi kunci utama
  order_id      TEXT NOT NULL,         -- nomor pesanan (boleh berulang)
  order_date    DATE NOT NULL,         -- tanggal pesan
  ship_date     DATE NOT NULL,         -- tanggal kirim
  ship_mode     TEXT NOT NULL,
  customer_id   TEXT NOT NULL,
  customer_name TEXT NOT NULL,
  segment       TEXT NOT NULL,
  country       TEXT NOT NULL,
  city          TEXT NOT NULL,
  state         TEXT NOT NULL,
  postal_code   TEXT,                  -- TEXT, bukan angka: kode pos bisa diawali nol
  region        TEXT NOT NULL,
  product_id    TEXT NOT NULL,
  category      TEXT NOT NULL,
  sub_category  TEXT NOT NULL,
  product_name  TEXT NOT NULL,
  sales         NUMERIC(12, 4) NOT NULL, -- uang: NUMERIC agar tidak ada error pembulatan
  quantity      INTEGER NOT NULL,
  discount      NUMERIC(4, 2) NOT NULL,  -- 0.20 = diskon 20%
  profit        NUMERIC(12, 4) NOT NULL
);

-- Index = "daftar isi" agar pencarian/filter di kolom ini cepat.
-- Dashboard nanti sering memfilter berdasarkan tanggal, wilayah, dan kategori.
CREATE INDEX idx_penjualan_order_date ON penjualan (order_date);
CREATE INDEX idx_penjualan_region     ON penjualan (region);
CREATE INDEX idx_penjualan_category   ON penjualan (category);