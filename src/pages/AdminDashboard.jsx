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
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
        <h1 className="text-lg font-semibold text-gray-900 mb-1">Dashboard</h1>
        <p className="text-xs text-gray-500 mb-6">Kelola pengaduan dan informasi warga</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Card
            className="cursor-pointer hover:border-gray-300 transition-colors"
            onClick={() => navigate('/admin/pengaduan')}
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center">
                    <FileText className="w-4 h-4 text-gray-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Pengaduan</p>
                    <p className="text-xs text-gray-400">{complaintCount} total</p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-gray-300" />
              </div>
            </CardContent>
          </Card>

          <Card
            className="cursor-pointer hover:border-gray-300 transition-colors"
            onClick={() => navigate('/admin/informasi')}
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center">
                    <Newspaper className="w-4 h-4 text-gray-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Informasi</p>
                    <p className="text-xs text-gray-400">{infoCount} total</p>
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
