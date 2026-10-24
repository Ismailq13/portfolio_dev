// src/components/Sidebar.jsx
// Menu di kiri layar. Hanya tampil di layar lebar (md = minimal 768px).

const MENU = [
  { label: "Ringkasan", href: "#ringkasan" },
  { label: "Produk teratas", href: "#produk" },
];

export function Sidebar() {
  return (
    <aside className="hidden md:flex md:w-60 md:flex-col md:shrink-0 bg-slate-900 text-slate-100">
      <div className="px-6 py-5 border-b border-slate-800">
        <p className="text-lg font-semibold">Superstore</p>
        <p className="text-xs text-slate-400">Dashboard penjualan</p>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        {/* key wajib saat membuat daftar dengan .map(), agar React bisa membedakan tiap item */}
        {MENU.map((item) => (
          <a
            key={item.href}
            href={item.href}
            className="block rounded-md px-3 py-2 text-sm text-slate-300 hover:bg-slate-800 hover:text-white"
          >
            {item.label}
          </a>
        ))}
      </nav>

      <p className="px-6 py-4 text-xs text-slate-500">
        Data: Superstore 2014–2017
      </p>
    </aside>
  );
}
