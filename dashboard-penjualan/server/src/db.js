// src/db.js
// satu tempat untuk koneksi ke postgresql. dipakai oleh script import (fase 1)
// dan oleh server express (fase 2)

import "dotenv/config"; // membaca file.env dan memasukkannya ke process.env
import pg from "pg";

// pool = kumpulan koneksi yang bisa dipakai bergantian, lebih hemat daripada membuka koneksi baru untuk setiap query.
export const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
