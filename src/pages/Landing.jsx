import { useState } from 'react'
import { Megaphone, Shield, FileText, MapPin, Newspaper } from 'lucide-react'
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
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/10 via-bg-alt to-secondary/10 py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Megaphone className="w-4 h-4" />
              Sistem Pengaduan & Informasi Warga
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              RW Rowosari{' '}
              <span className="text-primary">Connected</span>
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              Sampaikan keluhan Anda dan dapatkan informasi terbaru dari lingkungan RW Rowosari.
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

      {/* Tab Navigation */}
      <section className="bg-white border-b border-gray-200 sticky top-16 z-40">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex">
            {tabs.map((tab) => {
              const Icon = tab.icon
              const isActive = activeTab === tab.id
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                    isActive
                      ? 'border-primary text-primary'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              )
            })}
          </div>
        </div>
      </section>

      {/* Tab Content */}
      {activeTab === 'pengaduan' ? (
        <>
          {/* Form Section */}
          <section className="py-12 bg-white">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
              <FormPengaduan onSubmitSuccess={() => setRefreshKey((k) => k + 1)} />
            </div>
          </section>

          {/* Complaint List Section */}
          <section className="py-12 bg-surface">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              <ComplaintList key={refreshKey} title="Riwayat Pengaduan" />
            </div>
          </section>
        </>
      ) : (
        <section className="py-12 bg-surface">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <InfoList />
          </div>
        </section>
      )}
    </div>
  )
}
