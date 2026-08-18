import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { LayoutDashboard, FileText, Newspaper, ArrowRight } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { supabase } from '@/lib/supabase'

export default function AdminDashboard() {
  const navigate = useNavigate()
  const [complaintCount, setComplaintCount] = useState(0)
  const [infoCount, setInfoCount] = useState(0)

  useEffect(() => {
    const isAdmin = localStorage.getItem('isAdmin') === 'true'
    if (!isAdmin) {
      navigate('/admin/login')
    }
  }, [navigate])

  const fetchCounts = useCallback(async () => {
    const [complaints, infos] = await Promise.all([
      supabase.from('complaints').select('*', { count: 'exact', head: true }),
      supabase.from('informations').select('*', { count: 'exact', head: true }),
    ])

    setComplaintCount(complaints.count || 0)
    setInfoCount(infos.count || 0)
  }, [])

  useEffect(() => {
    fetchCounts()
  }, [fetchCounts])

  return (
    <div className="min-h-screen bg-surface">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <LayoutDashboard className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Dashboard Admin</h1>
              <p className="text-sm text-gray-500">Kelola pengaduan dan informasi warga RW Rowosari</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Pengaduan Card */}
          <Card
            className="hover:shadow-lg transition-shadow cursor-pointer group"
            onClick={() => navigate('/admin/pengaduan')}
          >
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center">
                    <FileText className="w-7 h-7 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">Pusat Pengaduan</h2>
                    <p className="text-sm text-gray-500 mt-1">Kelola pengaduan warga</p>
                    <p className="text-2xl font-bold text-primary mt-2">{complaintCount}</p>
                    <p className="text-xs text-gray-400">total pengaduan</p>
                  </div>
                </div>
                <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-primary transition-colors" />
              </div>
            </CardContent>
          </Card>

          {/* Informasi Card */}
          <Card
            className="hover:shadow-lg transition-shadow cursor-pointer group"
            onClick={() => navigate('/admin/informasi')}
          >
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-secondary/10 rounded-xl flex items-center justify-center">
                    <Newspaper className="w-7 h-7 text-secondary" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">Pusat Informasi</h2>
                    <p className="text-sm text-gray-500 mt-1">Kelola informasi untuk warga</p>
                    <p className="text-2xl font-bold text-secondary mt-2">{infoCount}</p>
                    <p className="text-xs text-gray-400">total informasi</p>
                  </div>
                </div>
                <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-secondary transition-colors" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
