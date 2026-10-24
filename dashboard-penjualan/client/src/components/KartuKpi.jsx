// src/components/KartuKpi.jsx
// Satu kartu angka. Saat loading, angkanya diganti kotak abu-abu yang berkedip.

export function KartuKpi({ label, nilai, keterangan, loading }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <p className="text-sm text-slate-500">{label}</p>

      {/* Kondisi ? A : B -> tampilkan A kalau loading, B kalau tidak */}
      {loading ? (
        <div className="mt-2 h-8 w-24 animate-pulse rounded bg-slate-200" />
      ) : (
        <p className="mt-1 text-2xl font-semibold tabular-nums">{nilai}</p>
      )}

      {/* && -> tampilkan hanya kalau keterangan diisi */}
      {keterangan && (
        <p className="mt-1 text-xs text-slate-400">{keterangan}</p>
      )}
    </div>
  );
}
