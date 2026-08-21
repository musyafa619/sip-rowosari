import { useState } from 'react'
import { Megaphone, Newspaper, ArrowRight } from 'lucide-react'
import FormPengaduan from '@/components/FormPengaduan'
import ComplaintList from '@/components/ComplaintList'
import InfoList from '@/components/InfoList'

const tabs = [
  { id: 'pengaduan', label: 'Pengaduan', icon: Megaphone },
  { id: 'informasi', label: 'Informasi', icon: Newspaper },
]

export default function Landing() {
  const [activeTab, setActiveTab] = useState('pengaduan')
  const [refreshKey, setRefreshKey] = useState(0)

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-emerald-600 via-primary to-emerald-700 text-white">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full -translate-y-1/2 translate-x-1/3 blur-3xl" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-300 rounded-full translate-y-1/3 -translate-x-1/4 blur-3xl" />
        </div>
        <div className="relative max-w-2xl mx-auto px-4 sm:px-6 py-12 sm:py-16 text-center">
          <div className="inline-flex items-center gap-1.5 bg-white/15 backdrop-blur-sm rounded-full px-3 py-1 text-xs font-medium mb-4">
            <span className="w-1.5 h-1.5 bg-emerald-300 rounded-full animate-pulse" />
            Aktif
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mb-3">
            Suara Warga, <br className="sm:hidden" />Aksi Nyata
          </h1>
          <p className="text-emerald-100 text-sm max-w-md mx-auto leading-relaxed">
            Sampaikan keluhan, pantau progresnya, dan dapatkan informasi terbaru dari pengurus RW Rowosari.
          </p>
        </div>
      </section>

      {/* Tabs */}
      <div className="bg-white border-b border-gray-100 sticky top-14 z-40">
        <div className="max-w-2xl mx-auto px-4 sm:px-6">
          <div className="flex">
            {tabs.map((tab) => {
              const Icon = tab.icon
              const isActive = activeTab === tab.id
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative flex items-center gap-1.5 px-4 py-3.5 text-sm font-semibold transition-colors ${
                    isActive
                      ? 'text-primary'
                      : 'text-gray-400 hover:text-gray-600'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-2 right-2 h-0.5 bg-primary rounded-full" />
                  )}
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {activeTab === 'pengaduan' ? (
          <div className="space-y-8">
            <FormPengaduan onSubmitSuccess={() => setRefreshKey((k) => k + 1)} />
            <div className="border-t border-gray-100 pt-8">
              <ComplaintList key={refreshKey} title="Riwayat Pengaduan" />
            </div>
          </div>
        ) : (
          <InfoList />
        )}
      </div>
    </div>
  )
}
