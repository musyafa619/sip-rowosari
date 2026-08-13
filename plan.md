# Plan: Pengaduan Warga RW Rowosari

## Overview

A complaint management app for RW Rowosari where villagers can submit complaints directly without logging in, and admin/management can view and manage all complaints.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + Vite |
| Styling | Tailwind CSS |
| UI Components | shadcn/ui |
| Routing | React Router v6 |
| Forms | React Hook Form + Zod |
| Icons | Lucide React |
| Backend | Supabase (Database + Storage) |

---

## Implementation Steps

### Step 1: Build Frontend with Dummy Data

Build the entire React app with mock data so all screens are visible and testable before connecting to Supabase.

**Project setup:**
- Vite + React + Tailwind CSS + shadcn/ui
- React Router v6
- React Hook Form + Zod
- Lucide React icons

**Pages:**
- `/` — Landing page (Form Pengaduan + Public Complaint List)
- `/admin/login` — Admin login page
- `/admin/dashboard` — Admin dashboard with all complaints
- `/admin/detail/:id` — Admin complaint detail + status update

**Components:**
- `components/layout/Navbar.jsx` — Top nav with app title + Login Admin link
- `components/layout/Footer.jsx`
- `components/FormPengaduan.jsx` — Complaint form with validation
- `components/ComplaintList.jsx` — Public complaint list (anonymous, nama_pelapor hidden)
- `components/ComplaintCard.jsx` — Single complaint card
- `components/StatusBadge.jsx` — Colored status indicator
- `components/PhotoLightbox.jsx` — Image viewer modal

**Dummy data:** `src/data/dummy.js` with ~10 sample complaints

**Color theme (Green + White + Blue):**
```css
--color-primary: #16A34A;      /* Green - main actions */
--color-primary-hover: #15803D;
--color-secondary: #0EA5E9;    /* Blue - accents */
--color-bg: #FFFFFF;
--color-bg-alt: #F0FDF4;       /* Light green tint */
--color-surface: #F8FAFC;
--color-text: #1E293B;
--color-text-muted: #64748B;
--color-border: #E2E8F0;

/* Status colors */
--status-menunggu: #F59E0B;    /* Amber */
--status-diproses: #3B82F6;    /* Blue */
--status-selesai: #10B981;     /* Green */
```

**After Step 1:**
- `npm run dev` works
- All pages visible and navigable
- Forms work with local state
- No Supabase dependency yet

---

### Step 2: User Sets Up Supabase

1. Create Supabase project at supabase.com
2. Go to SQL Editor
3. Paste & run the provided SQL script (see below)
4. Copy **Project URL** and **Anon Key** (Settings → API)
5. Create `.env` file:
   ```
   VITE_SUPABASE_URL=your_url_here
   VITE_SUPABASE_ANON_KEY=your_key_here
   ```

---

### Step 3: Integrate Supabase

Replace all dummy data with real Supabase calls.

**Files to modify:**
- `src/lib/supabase.js` — new file (client init)
- `src/components/FormPengaduan.jsx` — Supabase insert + photo upload
- `src/components/ComplaintList.jsx` — fetch from Supabase
- `src/pages/AdminLogin.jsx` — real auth check
- `src/pages/AdminDashboard.jsx` — real fetch + status update
- `src/pages/AdminDetail.jsx` — real fetch + update
- `src/data/dummy.js` — delete this file

**Feature mapping:**

| Feature | Dummy → Real |
|---------|-------------|
| Submit complaint | `alert()` → `supabase.from('complaints').insert()` |
| Upload photos | disabled → `supabase.storage.from('complaint-photos').upload()` |
| Public complaint list | `dummyComplaints` → `supabase.from('complaints').select()` |
| Search & filter | JS filter → Supabase `.ilike()`, `.eq()` |
| Admin login | `if/else` → `supabase.from('admin_users').select()` + bcrypt check |
| Admin update status | `alert()` → `supabase.from('complaints').update()` |

---

## Supabase Database Schema

### Table: `complaints`

| Column | Type | Default | Notes |
|--------|------|---------|-------|
| `id` | uuid | gen_random_uuid() | PK |
| `created_at` | timestamptz | now() | |
| `judul` | text | | NOT NULL |
| `nama_pelapor` | text | | NOT NULL (hidden from public list) |
| `tanggal_laporan` | date | | NOT NULL |
| `kategori` | text | | NOT NULL |
| `lokasi` | text | | NOT NULL |
| `deskripsi` | text | | NOT NULL |
| `foto_urls` | text[] | '{}' | Array of storage URLs |
| `status` | text | 'menunggu' | menunggu/diproses/selesai |

### Table: `admin_users`

| Column | Type | Notes |
|--------|------|-------|
| `id` | uuid | PK |
| `username` | text | UNIQUE |
| `password_hash` | text | bcrypt hash |
| `created_at` | timestamptz | |

### Storage
- Bucket: `complaint-photos` (public)
- Max 3 photos per complaint

### RLS Policies

**complaints:**
- `anon` → INSERT (villagers submit)
- `anon` → SELECT (public list & cek status)
- `authenticated` → UPDATE (admin changes status)

**storage.objects:**
- `anon` → INSERT on `complaint-photos`
- Public → SELECT on `complaint-photos`

---

## SQL Migration Script

```sql
-- 1. Enable required extensions
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- 2. Create tables
CREATE TABLE complaints (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT now(),
  judul TEXT NOT NULL,
  nama_pelapor TEXT NOT NULL,
  tanggal_laporan DATE NOT NULL,
  kategori TEXT NOT NULL,
  lokasi TEXT NOT NULL,
  deskripsi TEXT NOT NULL,
  foto_urls TEXT[] DEFAULT '{}',
  status TEXT DEFAULT 'menunggu' CHECK (status IN ('menunggu', 'diproses', 'selesai'))
);

CREATE TABLE admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Enable RLS
ALTER TABLE complaints ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- 4. RLS Policies for complaints
CREATE POLICY "anon_insert_complaints" ON complaints
  FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "anon_select_complaints" ON complaints
  FOR SELECT TO anon USING (true);

CREATE POLICY "authenticated_update_complaints" ON complaints
  FOR UPDATE TO authenticated USING (true);

-- 5. RLS Policies for admin_users
CREATE POLICY "authenticated_select_admin" ON admin_users
  FOR SELECT TO authenticated USING (true);

-- 6. Seed admin account
INSERT INTO admin_users (username, password_hash)
VALUES ('rwrowosari', crypt('rahasia123!', gen_salt('bf')));

-- 7. Create storage bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('complaint-photos', 'complaint-photos', true);

-- 8. Storage policies
CREATE POLICY "anon_upload_photos" ON storage.objects
  FOR INSERT TO anon WITH CHECK (bucket_id = 'complaint-photos');

CREATE POLICY "public_read_photos" ON storage.objects
  FOR SELECT USING (bucket_id = 'complaint-photos');

-- 9. Admin login function (RPC)
CREATE OR REPLACE FUNCTION verify_admin_login(input_username TEXT, input_password TEXT)
RETURNS BOOLEAN AS $$
DECLARE
  stored_hash TEXT;
BEGIN
  SELECT password_hash INTO stored_hash
  FROM admin_users
  WHERE username = input_username;

  IF stored_hash IS NULL THEN
    RETURN FALSE;
  END IF;

  RETURN stored_hash = crypt(input_password, stored_hash);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 10. Allow anon to call verify_admin_login
GRANT EXECUTE ON FUNCTION verify_admin_login(TEXT, TEXT) TO anon;
```

---

## Page Details

### Landing Page (`/`)

**Section 1 — Hero**
- Title: "Pengaduan Warga RW Rowosari"
- Subtitle: "Sampaikan keluhan Anda untuk lingkungan yang lebih baik"

**Section 2 — Form Pengaduan**
- Judul (text)
- Nama Pelapor (text)
- Tanggal Laporan (date, default: today)
- Kategori (dropdown: Sampah, Keamanan, Fasilitas, Jalan, Lingkungan, Lainnya)
- Lokasi Kejadian (text)
- Deskripsi (textarea)
- Upload Foto (file, max 3, image preview)
- Submit → success toast "Pengaduan berhasil dikirim!"

**Section 3 — Daftar Pengaduan**
- Shows all complaints (public, nama_pelapor hidden)
- Display: judul, tanggal, kategori, lokasi (truncated), status badge
- Search by: judul, lokasi
- Filter by: kategori, status
- Click to expand → see full deskripsi + photos

**Navbar**
- App title (left)
- "Login Admin" button (right, subtle)

### Admin Login (`/admin/login`)
- Username + password form
- On success → redirect to `/admin/dashboard`
- On fail → error message
- Session stored in localStorage

### Admin Dashboard (`/admin/dashboard`)
- Navbar with "Logout" button
- Stats cards: Total, Menunggu, Diproses, Selesai (counts)
- Search bar + filters (kategori, status)
- Table: ID (short), Judul, Nama Pelapor, Tanggal, Kategori, Status, Aksi
- Aksi: "Lihat" button → navigate to detail
- Pagination (10 per page)

### Admin Detail (`/admin/detail/:id`)
- Full complaint info (all fields including nama_pelapor)
- Photo gallery with lightbox
- Status update dropdown + "Simpan" button
- Success toast on update
