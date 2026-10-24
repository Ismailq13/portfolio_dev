// src/lib/api.js
// Satu-satunya tempat yang tahu alamat backend dan cara memanggilnya.
// Komponen tidak memanggil fetch() langsung, tapi lewat fungsi di sini.

// Alamat backend diambil dari file .env (VITE_API_URL).
// Kalau tidak diisi, pakai alamat backend di laptop.
const BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3000";

// Contoh: ambilData('produk-teratas', { limit: 10 })
//   -> GET http://localhost:3000/api/produk-teratas?limit=10
export async function ambilData(path, params = {}, signal) {
  // Buang parameter yang kosong supaya URL tetap bersih
  const isi = Object.entries(params).filter(
    ([, nilai]) => nilai !== undefined && nilai !== "",
  );
  const qs = new URLSearchParams(isi).toString();
  const url = `${BASE_URL}/api/${path}${qs ? `?${qs}` : ""}`;

  // signal dipakai untuk membatalkan request yang sudah tidak dibutuhkan
  const res = await fetch(url, { signal });

  // Backend kita selalu menjawab JSON, termasuk saat error ({ error: "..." }).
  // .catch(() => null) berjaga-jaga kalau jawabannya bukan JSON.
  const body = await res.json().catch(() => null);

  // res.ok = true kalau status 200-299
  if (!res.ok) {
    throw new Error(body?.error ?? `Gagal memuat data (status ${res.status})`);
  }
  return body;
}
