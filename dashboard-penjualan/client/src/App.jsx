// src/App.jsx
// Halaman utama: menyusun semua bagian dashboard.

import { Layout } from "./components/Layout";
import { BarisKpi } from "./components/BarisKpi";
import { TabelProduk } from "./components/TabelProduk";

export default function App() {
  return (
    <Layout>
      {/* id dipakai oleh link di sidebar (#ringkasan, #produk) */}
      <section id="ringkasan" className="space-y-4">
        <div>
          <h1 className="text-2xl font-semibold">Ringkasan penjualan</h1>
          <p className="text-sm text-slate-500">
            Seluruh data, Januari 2014 sampai Desember 2017
          </p>
        </div>
        <BarisKpi />
      </section>

      <section id="produk" className="space-y-4">
        <h2 className="text-lg font-semibold">
          10 produk dengan penjualan tertinggi
        </h2>
        <TabelProduk />
      </section>
    </Layout>
  );
}
