// src/services/filter.js
// Membaca dan memeriksa query string dari URL, misalnya
// /api/ringkasan?dari=2017-01-01&sampai=2017-12-31&wilayah=West
// Prinsip: jangan percaya input dari luar. Periksa di pintu masuk.

import { HttpError } from "../utils/HttpError.js";

// "2017-01-31" valid, "2017-02-31" tidak (Februari tidak punya tanggal 31)
function tanggalValid(teks) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(teks)) return false;
  const d = new Date(`${teks}T00:00:00Z`);
  return !Number.isNaN(d.getTime()) && d.toISOString().slice(0, 10) === teks;
}

// Teks pendek biasa (nama wilayah/kategori). Batas 50 huruf mencegah input aneh yang sangat panjang.
function teksValid(teks) {
  return typeof teks === "string" && teks.length > 0 && teks.length <= 50;
}

// Filter umum yang dipakai hampir semua endpoint
export function bacaFilter(query) {
  const { dari, sampai, wilayah, kategori } = query;

  if (dari !== undefined && !tanggalValid(dari)) {
    throw new HttpError(
      400,
      'Parameter "dari" harus tanggal valid berformat YYYY-MM-DD',
    );
  }
  if (sampai !== undefined && !tanggalValid(sampai)) {
    throw new HttpError(
      400,
      'Parameter "sampai" harus tanggal valid berformat YYYY-MM-DD',
    );
  }
  // Teks YYYY-MM-DD bisa dibandingkan langsung: "2017-01-01" < "2017-12-31"
  if (dari && sampai && dari > sampai) {
    throw new HttpError(400, '"dari" tidak boleh lebih besar dari "sampai"');
  }
  if (wilayah !== undefined && !teksValid(wilayah)) {
    throw new HttpError(400, 'Parameter "wilayah" tidak valid');
  }
  if (kategori !== undefined && !teksValid(kategori)) {
    throw new HttpError(400, 'Parameter "kategori" tidak valid');
  }

  return { dari, sampai, wilayah, kategori };
}

// Memastikan nilai termasuk salah satu pilihan yang diizinkan (whitelist)
export function bacaPilihan(nilai, pilihan, bawaan, nama) {
  if (nilai === undefined) return bawaan;
  if (!pilihan.includes(nilai)) {
    throw new HttpError(
      400,
      `Parameter "${nama}" harus salah satu dari: ${pilihan.join(", ")}`,
    );
  }
  return nilai;
}

// Angka bulat dengan batas bawah dan atas, misalnya limit=10 (1 sampai 50)
export function bacaAngka(nilai, bawaan, min, max, nama) {
  if (nilai === undefined) return bawaan;
  const angka = Number(nilai);
  if (!Number.isInteger(angka) || angka < min || angka > max) {
    throw new HttpError(
      400,
      `Parameter "${nama}" harus angka bulat ${min} sampai ${max}`,
    );
  }
  return angka;
}
