// src/lib/format.js
// Mengubah angka mentah dari API menjadi teks yang enak dibaca, gaya Indonesia.
// Formatter dibuat sekali di luar fungsi supaya tidak dibuat ulang setiap dipanggil.

// 2297200.86 -> "US$2,3 jt" (ringkas, untuk kartu KPI)
const uangRingkas = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "USD", // datanya toko di Amerika, jadi dolar
  notation: "compact",
  maximumFractionDigits: 1,
});

// 61599.82 -> "US$61.600" (lengkap tanpa sen, untuk tabel)
const uangLengkap = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

// 5009 -> "5.009"
const angka = new Intl.NumberFormat("id-ID");

export const formatUangRingkas = (n) => uangRingkas.format(n);
export const formatUang = (n) => uangLengkap.format(n);
export const formatAngka = (n) => angka.format(n);

// 12.47 -> "12,5%"
export const formatPersen = (n) =>
  `${n.toLocaleString("id-ID", { maximumFractionDigits: 1 })}%`;
