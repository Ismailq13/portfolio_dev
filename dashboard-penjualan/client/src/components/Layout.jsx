// src/components/Layout.jsx
// Kerangka halaman: sidebar di kiri, isi di kanan.
// "children" = apa pun yang ditulis di antara <Layout> dan </Layout>.

import { Sidebar } from "./Sidebar";

export function Layout({ children }) {
  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900">
      <Sidebar />

      <div className="flex-1 min-w-0">
        {/* Judul atas: hanya di layar kecil, karena di layar lebar sudah ada sidebar */}
        <header className="md:hidden bg-slate-900 px-4 py-3 text-slate-100">
          <p className="font-semibold">Superstore · Dashboard penjualan</p>
        </header>

        <main className="mx-auto max-w-6xl space-y-8 px-4 py-6 md:px-8 md:py-8">
          {children}
        </main>
      </div>
    </div>
  );
}
