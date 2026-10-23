// src/server.js
// Titik masuk: menyalakan server di port tertentu.

import { app } from "./app.js";

const PORT = process.env.PORT ?? 3000; // ?? = pakai 3000 kalau PORT tidak diisi

app.listen(PORT, () => {
  console.log(`API jalan di http://localhost:${PORT}`);
});
