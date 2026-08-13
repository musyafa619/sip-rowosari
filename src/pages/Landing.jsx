import { Megaphone, Shield, FileText, MapPin } from 'lucide-react'
import FormPengaduan from '@/components/FormPengaduan'
import ComplaintList from '@/components/ComplaintList'

export default function Landing() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/10 via-bg-alt to-secondary/10 py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Megaphone className="w-4 h-4" />
              Sistem Pengaduan Warga
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Pengaduan Warga{' '}
              <span className="text-primary">RW Rowosari</span>
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              Sampaikan keluhan Anda untuk lingkungan yang lebih baik.
              Tanpa perlu login, langsung laporkan masalah di sekitar Anda.
            </p>
            <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <FileText className="w-5 h-5 text-primary" />
                </div>
                <span>Mudah & Cepat</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-secondary/10 rounded-lg flex items-center justify-center">
                  <Shield className="w-5 h-5 text-secondary" />
                </div>
                <span>Tanpa Login</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-primary" />
                </div>
                <span>Lacak Status</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Form Section */}
      <section className="py-12 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <FormPengaduan />
        </div>
      </section>

      {/* Complaint List Section */}
      <section className="py-12 bg-surface">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <ComplaintList title="Riwayat Pengaduan" />
        </div>
      </section>
    </div>
  )
}
