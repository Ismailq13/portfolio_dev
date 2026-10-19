# Dashboard Penjualan Superstore

Dashboard fullstack untuk menganalisis penjualan toko: total penjualan, laba,
tren bulanan, kategori, wilayah, dan produk teratas.

**Stack:** React + Vite + Tailwind (frontend), Node.js + Express (backend), PostgreSQL (database)

**Data:** [Superstore Dataset](https://www.kaggle.com/datasets/vivek468/superstore-dataset-final),
9.994 baris pesanan tahun 2014–2017.

## Menjalankan di komputer sendiri

1. Buat database: `CREATE DATABASE dashboard_penjualan;`
2. Di folder `server`, buat file `.env`:
   `DATABASE_URL=postgres://postgres:PASSWORD@localhost:5432/dashboard_penjualan`
3. Download dataset dari Kaggle, simpan sebagai `server/data/superstore.csv`
4. Jalankan dari folder `server`:
   - `npm install`
   - `psql -U postgres -d dashboard_penjualan -f scripts/schema.sql`
   - `npm run import`

## Progres

- [x] Fase 1: data masuk ke PostgreSQL
- [ ] Fase 2: backend API
- [ ] Fase 3: frontend
- [ ] Fase 4: grafik dan filter
- [ ] Fase 5: deploy
