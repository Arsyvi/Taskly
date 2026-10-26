<p align="center">
  <img src="frontend/public/logo.webp" width="80" alt="Logo Taskly">
</p>

<h1 align="center">Taskly</h1>

<p align="center">Aplikasi manajemen tugas dengan autentikasi token. Frontend React, API Laravel Sanctum.</p>

## Tentang

Taskly mencatat tugas milik tiap user: tambah, edit, tandai selesai, hapus, cari, dan filter berdasarkan status. Setiap request ke API membawa token dari Sanctum, dan backend hanya mengembalikan task milik user yang sedang login.

Repo ini berisi dua bagian:

- `frontend/`: React 19 + Vite 8, di-deploy sebagai static site.
- `backend/`: Laravel 11 + Sanctum 4, butuh PHP 8.3+ dan database.

## Fitur

- Register dan login pakai nama atau email.
- Sesi dicek ulang setiap halaman dibuka. Token tidak valid akan dihapus dan user diarahkan ke `/login`.
- Dashboard berisi ringkasan total, in progress, dan completed.
- CRUD tugas dengan judul, deskripsi opsional, dan status selesai.
- Pencarian judul/deskripsi, plus filter `All`, `Active`, `Completed`.
- Loading skeleton, empty state, error state, dan toast untuk hasil aksi.
- Di layar kecil, navigasi pindah ke bottom bar dan form tambah tugas jadi bottom sheet.

## Stack

| Bagian | Teknologi |
| --- | --- |
| Frontend | React 19, Vite 8, React Router 7, Axios, react-hot-toast, lucide-react |
| Backend | Laravel 11, Laravel Sanctum 4, PHP 8.3 |
| Database | SQLite (default), bisa diganti MySQL atau PostgreSQL lewat `.env` |
| Deploy | Vercel atau Netlify untuk frontend, Railway untuk backend |

## Alur autentikasi

1. `POST /api/register` atau `POST /api/login` mengembalikan data `user` dan `token`.
2. Token disimpan di `localStorage`.
3. Interceptor Axios menambahkan header `Authorization: Bearer <token>` ke setiap request.
4. Saat halaman di-refresh, `AuthProvider` memanggil `GET /api/user`. Selama proses ini, `ProtectedRoute` menampilkan layar "Memeriksa sesi kamu".
5. Kalau token kedaluwarsa atau ditolak, token dihapus dan user diarahkan ke `/login`.

## Struktur

```text
Taskly/
├── backend/
│   ├── app/Http/Controllers/AuthController.php
│   ├── app/Http/Controllers/TaskController.php
│   ├── app/Models/
│   ├── database/migrations/
│   └── routes/api.php
└── frontend/
    ├── public/_redirects
    ├── src/context/AuthProvider.jsx
    ├── src/routes/ProtectedRoute.jsx
    ├── src/services/api.js
    └── vercel.json
```

## Menjalankan di lokal

Kebutuhan: Node.js 20+, PHP 8.3+, dan Composer.

### Backend

```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
touch database/database.sqlite
php artisan migrate
php artisan serve
```

Di Windows, ganti `cp` dengan `copy` dan `touch` dengan `type nul > database\database.sqlite`.

API berjalan di `http://127.0.0.1:8000`. Secara default `.env.example` memakai SQLite. Kalau mau pakai MySQL, ubah `DB_CONNECTION` dan variabel `DB_*` sebelum migrate.

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Vite biasanya membuka `http://localhost:5173`.

Untuk memakai backend lokal, buat `frontend/.env.local`:

```env
VITE_API_URL=http://127.0.0.1:8000/api
```

Restart dev server setelah mengubah env. Tanpa file ini, frontend memakai URL API Railway yang terpasang sebagai default.

## Endpoint API

Semua endpoint di bawah ini memakai prefix `/api`. Endpoint dengan tanda auth butuh header `Authorization: Bearer <token>`.

| Method | Endpoint | Auth | Keterangan |
| --- | --- | --- | --- |
| POST | `/register` | Tidak | Daftar akun, balas `user` dan `token` |
| POST | `/login` | Tidak | Login pakai nama atau email |
| GET | `/user` | Ya | Data user yang sedang login |
| POST | `/logout` | Ya | Hapus token yang sedang dipakai |
| GET | `/tasks` | Ya | Semua task milik user |
| POST | `/tasks` | Ya | Buat task baru |
| GET | `/tasks/{id}` | Ya | Detail satu task |
| PATCH | `/tasks/{id}` | Ya | Update judul, deskripsi, atau status |
| DELETE | `/tasks/{id}` | Ya | Hapus task |

Task yang bukan milik user yang login akan dibalas 404, termasuk untuk detail, update, dan delete.

## Script

| Perintah | Lokasi | Fungsi |
| --- | --- | --- |
| `npm run dev` | `frontend/` | Development server |
| `npm run build` | `frontend/` | Build produksi ke `dist/` |
| `npm run preview` | `frontend/` | Cek hasil build secara lokal |
| `npm test` | `frontend/` | Unit test untuk helper state task |
| `php artisan serve` | `backend/` | Jalankan API lokal |
| `php artisan migrate` | `backend/` | Jalankan migrasi database |

## Deploy

Frontend ini SPA, jadi host harus mengarahkan semua rute ke `index.html`. Tanpa aturan itu, refresh di `/dashboard` akan menghasilkan 404 dari host sebelum React sempat jalan.

**Vercel**

- Root Directory: `frontend`
- Framework Preset: Vite
- Build Command: `npm run build`
- Output Directory: `dist`

`frontend/vercel.json` berisi rewrite ke `index.html`.

**Netlify**

- Base directory: `frontend`
- Build command: `npm run build`
- Publish directory: `dist`

`frontend/public/_redirects` menangani fallback SPA dan ikut tersalin ke `dist` saat build.

**Backend**

Deploy Laravel ke host yang mendukung PHP, misalnya Railway. Isi `.env` produksi, jalankan `php artisan key:generate` dan `php artisan migrate`, lalu set `APP_URL` sesuai domain API. Setelah API hidup, isi `VITE_API_URL` di environment frontend dengan URL API produksi dan deploy ulang, karena Vite menanam nilai env saat build.

## Catatan

- Token disimpan di `localStorage`, jadi keamanannya bergantung pada tidak adanya XSS di aplikasi.
- Pengecekan pemilik task dilakukan di backend lewat `user_id`, bukan hanya disembunyikan di tampilan.
