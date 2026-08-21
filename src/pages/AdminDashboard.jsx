import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { FileText, Newspaper, ArrowRight } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { supabase } from '@/lib/supabase'

export default function AdminDashboard() {
  const navigate = useNavigate()
  const [complaintCount, setComplaintCount] = useState(0)
  const [infoCount, setInfoCount] = useState(0)

  useEffect(() => {
    const isAdmin = localStorage.getItem('isAdmin') === 'true'
    if (!isAdmin) navigate('/admin/login')
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
      <div className="max-w-xl mx-auto px-4 sm:px-6 py-8">
        <h1 className="text-lg font-bold text-gray-900 mb-1">Dashboard</h1>
        <p className="text-xs text-gray-400 mb-6">Kelola pengaduan dan informasi warga</p>

        <div className="space-y-3">
          <Card
            className="cursor-pointer card-hover border-l-[3px] border-l-primary"
            onClick={() => navigate('/admin/pengaduan')}
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                    <FileText className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900">Pusat Pengaduan</p>
                    <p className="text-xs text-gray-400">{complaintCount} pengaduan</p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-gray-300" />
              </div>
            </CardContent>
          </Card>

          <Card
            className="cursor-pointer card-hover border-l-[3px] border-l-amber-400"
            onClick={() => navigate('/admin/informasi')}
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-amber-50 rounded-lg flex items-center justify-center">
                    <Newspaper className="w-5 h-5 text-amber-600" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900">Pusat Informasi</p>
                    <p className="text-xs text-gray-400">{infoCount} informasi</p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-gray-300" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
