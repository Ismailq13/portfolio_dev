// src/components/TabelProduk.jsx
// Tabel 10 produk dengan penjualan tertinggi, dari /api/produk-teratas.

import { useApi } from "../hooks/useApi";
import { formatUang, formatAngka } from "../lib/format";
import { PesanError } from "./PesanError";

export function TabelProduk() {
  const { data, error, loading, muatUlang } = useApi("produk-teratas", {
    limit: 10,
  });

  if (error) return <PesanError pesan={error} onCobaLagi={muatUlang} />;

  // Saat pertama memuat: 10 baris abu-abu sebagai pengganti
  if (loading && !data) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 10 }, (_, i) => (
          <div key={i} className="h-9 animate-pulse rounded bg-slate-200" />
        ))}
      </div>
    );
  }

  return (
    // overflow-x-auto: di HP, tabel bisa digeser ke samping tanpa merusak halaman
    <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white shadow-sm">
      <table className="w-full text-sm">
        <thead className="bg-slate-100 text-left text-slate-600">
          <tr>
            <th className="px-4 py-2 font-medium">#</th>
            <th className="px-4 py-2 font-medium">Produk</th>
            <th className="px-4 py-2 font-medium">Kategori</th>
            <th className="px-4 py-2 text-right font-medium">Penjualan</th>
            <th className="px-4 py-2 text-right font-medium">Laba</th>
            <th className="px-4 py-2 text-right font-medium">Terjual</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {data.map((produk, i) => (
            // Nama produk dipakai sebagai key karena unik di hasil ini
            <tr key={produk.nama} className="hover:bg-slate-50">
              <td className="px-4 py-2 text-slate-400">{i + 1}</td>
              <td className="max-w-xs truncate px-4 py-2" title={produk.nama}>
                {produk.nama}
              </td>
              <td className="px-4 py-2 text-slate-500">{produk.kategori}</td>
              <td className="px-4 py-2 text-right tabular-nums">
                {formatUang(produk.penjualan)}
              </td>
              {/* Laba negatif (rugi) diberi warna merah */}
              <td
                className={`px-4 py-2 text-right tabular-nums ${
                  produk.laba < 0 ? "text-red-600" : "text-emerald-700"
                }`}
              >
                {formatUang(produk.laba)}
              </td>
              <td className="px-4 py-2 text-right tabular-nums">
                {formatAngka(produk.jumlah_terjual)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
