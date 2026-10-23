// src/middleware/logger.js
// mencatat setiap requestL: metode, alamat, kode status, dan lama prosesnya.
// contoh: GET /api/ringkasan 200 12.3ms

export function catatRequest(req, res, next) {
  const mulai = performance.now();
  // 'finish' terjadi setelah respons selesai dikirim ke browser
  res.on("finish", () => {
    const lama = (performance.now() - mulai).toFixed(1);
    console.log(`${req.method} ${req.originalUrl} ${res.statusCode} ${lama}ms`);
  });
  next(); // lamjut ke middleware/route berikutnya
}
