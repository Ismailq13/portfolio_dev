// src/components/BarisKpi.jsx
// Mengambil /api/ringkasan lalu menampilkan 5 kartu KPI.

import { useApi } from "../hooks/useApi";
import { formatUangRingkas, formatAngka, formatPersen } from "../lib/format";
import { KartuKpi } from "./KartuKpi";
import { PesanError } from "./PesanError";

export function BarisKpi() {
  const { data, error, loading, muatUlang } = useApi("ringkasan");

  if (error) return <PesanError pesan={error} onCobaLagi={muatUlang} />;

  // Saat pertama memuat, data masih null, jadi data?.total_laba bernilai undefined.
  // Fungsi ini mengembalikan teks kosong dalam kasus itu, bukan error.
  const tampilkan = (fungsiFormat, nilai) =>
    nilai === undefined ? "" : fungsiFormat(nilai);

  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
      <KartuKpi
        label="Total penjualan"
        nilai={tampilkan(formatUangRingkas, data?.total_penjualan)}
        loading={loading && !data}
      />
      <KartuKpi
        label="Total laba"
        nilai={tampilkan(formatUangRingkas, data?.total_laba)}
        loading={loading && !data}
      />
      <KartuKpi
        label="Margin laba"
        nilai={tampilkan(formatPersen, data?.margin_laba_persen)}
        keterangan="laba ÷ penjualan"
        loading={loading && !data}
      />
      <KartuKpi
        label="Jumlah pesanan"
        nilai={tampilkan(formatAngka, data?.jumlah_pesanan)}
        loading={loading && !data}
      />
      <KartuKpi
        label="Jumlah pelanggan"
        nilai={tampilkan(formatAngka, data?.jumlah_pelanggan)}
        loading={loading && !data}
      />
    </div>
  );
}
