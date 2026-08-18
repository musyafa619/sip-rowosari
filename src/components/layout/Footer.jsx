export default function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6">
        <p className="text-xs text-gray-400 text-center">
          &copy; {new Date().getFullYear()} RW Rowosari &middot; Sistem Pengaduan & Informasi Warga
        </p>
      </div>
    </footer>
  )
}
