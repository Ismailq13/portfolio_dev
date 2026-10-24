// src/hooks/useApi.js
// Custom hook: mengambil data dari API dan mengurus status memuat/error.
// Pemakaian di komponen:
//   const { data, error, loading, muatUlang } = useApi('ringkasan');

import { useEffect, useState } from "react";
import { ambilData } from "../lib/api";

export function useApi(path, params = {}) {
  // Angka ini dinaikkan saat tombol "Coba lagi" diklik, supaya request diulang
  const [percobaan, setPercobaan] = useState(0);

  // params adalah objek baru di setiap render. Kita ubah ke teks supaya
  // React bisa tahu apakah ISINYA berubah (objek {a:1} !== {a:1}, tapi teksnya sama).
  const paramsTeks = JSON.stringify(params);

  // "Kunci" request: kalau salah satu bagiannya berubah, berarti request baru
  const kunci = `${path}|${paramsTeks}|${percobaan}`;

  // Hasil terakhir, beserta kunci request yang menghasilkannya
  const [hasil, setHasil] = useState({ kunci: null, data: null, error: null });

  useEffect(() => {
    // AbortController: untuk membatalkan request kalau komponen hilang
    // atau parameter berubah sebelum jawaban datang
    const controller = new AbortController();

    ambilData(path, JSON.parse(paramsTeks), controller.signal)
      .then((data) => setHasil({ kunci, data, error: null }))
      .catch((err) => {
        if (err.name === "AbortError") return; // dibatalkan sengaja, bukan error
        setHasil({ kunci, data: null, error: err.message });
      });

    // Fungsi cleanup: dijalankan sebelum effect berikutnya atau saat komponen hilang
    return () => controller.abort();
  }, [kunci, path, paramsTeks]);

  // Masih memuat = hasil yang tersimpan belum milik request yang sekarang
  const loading = hasil.kunci !== kunci;

  return {
    data: hasil.data, // data lama tetap ditampilkan sambil menunggu yang baru
    error: loading ? null : hasil.error,
    loading,
    muatUlang: () => setPercobaan((n) => n + 1),
  };
}
