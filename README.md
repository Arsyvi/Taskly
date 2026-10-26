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
| Database | MySql |

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

## Kebutuhan

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

### Frontend

```bash
cd frontend
npm install
npm run dev
```

## Script

| Perintah | Lokasi | Fungsi |
| --- | --- | --- |
| `npm run dev` | `frontend/` | Development server |
| `npm run build` | `frontend/` | Build produksi ke `dist/` |
| `npm run preview` | `frontend/` | Cek hasil build secara lokal |
| `npm test` | `frontend/` | Unit test untuk helper state task |
| `php artisan serve` | `backend/` | Jalankan API lokal |
| `php artisan migrate` | `backend/` | Jalankan migrasi database |

