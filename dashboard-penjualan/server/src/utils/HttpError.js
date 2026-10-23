// src/utils/HttpError.js
// error yang membawa kode status HTTP, misalnya 400 (input salah) atau 404 (tidak ada)
export class HttpError extends Error {
  constructor(status, message) {
    super(message); // isi pesan error bawaan js
    this.status = status;
  }
}
