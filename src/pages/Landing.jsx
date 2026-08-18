import { useState } from 'react'
import { Megaphone, Newspaper } from 'lucide-react'
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
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="pt-10 pb-8 sm:pt-14 sm:pb-10">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 text-center">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
            Pengaduan & Informasi Warga
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            Sampaikan keluhan atau lihat informasi terbaru dari pengurus RW Rowosari.
          </p>
        </div>
      </section>

      {/* Tabs */}
      <div className="border-b border-gray-200 bg-white sticky top-14 z-40">
        <div className="max-w-2xl mx-auto px-4 sm:px-6">
          <div className="flex gap-6">
            {tabs.map((tab) => {
              const Icon = tab.icon
              const isActive = activeTab === tab.id
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-1.5 py-3 text-sm font-medium border-b-2 transition-colors -mb-px ${
                    isActive
                      ? 'border-primary text-primary'
                      : 'border-transparent text-gray-400 hover:text-gray-600'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {tab.label}
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
        {activeTab === 'pengaduan' ? (
          <div className="space-y-10">
            <FormPengaduan onSubmitSuccess={() => setRefreshKey((k) => k + 1)} />
            <ComplaintList key={refreshKey} title="Riwayat Pengaduan" />
          </div>
        ) : (
          <InfoList />
        )}
      </div>
    </div>
  )
}
