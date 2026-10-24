// src/components/PesanError.jsx
// Kotak merah berisi pesan error dan tombol untuk mencoba lagi.

export function PesanError({ pesan, onCobaLagi }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
      <p>Gagal memuat data: {pesan}</p>
      <button
        type="button"
        onClick={onCobaLagi}
        className="rounded-md bg-red-600 px-3 py-1.5 font-medium text-white hover:bg-red-700"
      >
        Coba lagi
      </button>
    </div>
  );
}
