// src/services/dashboard.service.js
// Lapisan SERVICE: aturan bisnis. Tidak tahu soal HTTP (req/res), tidak menulis SQL.

import * as repo from "../repositories/penjualan.repository.js";

export async function ringkasan(filter) {
  const data = await repo.ambilRingkasan(filter);
  // Margin laba (%) = laba / penjualan x 100. Hindari pembagian dengan nol.
  const margin =
    data.total_penjualan === 0
      ? 0
      : (data.total_laba / data.total_penjualan) * 100;
  return { ...data, margin_laba_persen: Math.round(margin * 100) / 100 };
}

export function tren(filter, satuan) {
  return repo.ambilTren(filter, satuan);
}

export function perKelompok(filter, kelompok) {
  return repo.ambilPerKelompok(filter, kelompok);
}

export function produkTeratas(filter, urut, limit) {
  return repo.ambilProdukTeratas(filter, urut, limit);
}

export function opsiFilter() {
  return repo.ambilOpsiFilter();
}
