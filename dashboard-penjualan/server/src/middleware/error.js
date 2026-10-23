// src/middleware/error.js

// dipanggil kalau tidak ada route yang cocok
export function tidakDitemukan(req, res) {
  res
    .status(404)
    .json({ error: `Endpoint ${req.method} ${req.originalUrl} tidak ada` });
}

// penangan error terakhir. express mengenalnya dari 4 parameter (err, req, res, next),
// jadi "next" wajib ditulis walaupun tidak dipakai.
// eslint-disable-next-line no-unused-vars
export function tanganiError(err, req, res, next) {
  const status = err.status ?? 500;
  if (status >= 500) {
    console.error(err); // detail lengkap hanya di terminal server
  }
  res.status(status).json({
    // error 500 tidak boleh membocorkan (nama tabel, isi query) ke pengguna
    error: status >= 500 ? "Terjadi kesalahan di server" : err.message,
  });
}
