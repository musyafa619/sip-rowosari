import { Megaphone, Heart } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Megaphone className="w-5 h-5 text-white" />
            </div>
            <span className="font-semibold text-gray-900">
              Pengaduan RW Rowosari
            </span>
          </div>
          <p className="text-sm text-gray-500 text-center">
            Sistem pengaduan warga untuk lingkungan yang lebih baik
          </p>
          <div className="flex items-center gap-1 text-sm text-gray-400">
            <span>Dibuat dengan</span>
            <Heart className="w-3 h-3 fill-red-400 text-red-400" />
            <span>untuk warga RW Rowosari</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
