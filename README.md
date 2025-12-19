# instaapp

Panduan instalasi backend Laravel + frontend Vite.

## Prasyarat (jika tanpa Docker)
- PHP 8.2+, Composer
- Node.js 18+ dan npm
- PostgreSQL 14+ dengan database `instaapp` (user `instaapp`, password `instaapp_pass`) atau kredensial Anda sendiri
- Git, dan OpenSSL sudah tersedia di sistem

## Menyiapkan file .env
**Backend (`backend/.env`)**
1. Salin contoh: `Copy-Item backend/.env.example backend/.env` (PowerShell) atau `cp backend/.env.example backend/.env`.
2. Sesuaikan isian berikut; kosongkan `APP_KEY` dan `JWT_SECRET` karena akan diisi lewat artisan.

## Instalasi via Docker Compose
1. Siapkan `.env` untuk backend dan frontend seperti di atas.
2. Bangun dan jalankan kontainer:
   - `docker compose up -d --build`
3. Generate APP_KEY dan JWT_SECRET di dalam kontainer backend, dan lakukan perubahan /backend/.env:
   - `docker compose exec backend php artisan key:generate --show`
   - `docker compose exec backend php artisan jwt:secret --show`
4. Migrasi database:
   - `docker compose exec backend php artisan migrate`
5. Akses: backend `http://localhost:8000`, frontend `http://localhost:5173` (pastikan `VITE_API_URL` mengarah ke backend).

## Instalasi manual (tanpa Docker)
### Backend
1. `cd backend`
2. Pastikan PostgreSQL berjalan dan database dibuat (contoh: `createdb instaapp` atau lewat GUI). Gunakan host `127.0.0.1` jika DB lokal.
3. `composer install`
4. Generate kunci:
   - `php artisan key:generate`
   - `php artisan jwt:secret`
5. Migrasi database:
   - `php artisan migrate`
6. Symlink Storage:
   - `php artisan storage:link`
7. Jalankan server dev:
   - `php artisan serve --host=0.0.0.0 --port=8000`

### Frontend
1. `cd frontend`
2. Pastikan `.env` terisi `VITE_API_URL` ke backend.
3. `npm install`
4. Jalankan dev server:
   - `npm run dev -- --host --port 5173`
5. Buka `http://localhost:5173` di browser.

## Perintah penting
- Membersihkan cache konfigurasi (jika perlu): `php artisan config:clear && php artisan cache:clear`
