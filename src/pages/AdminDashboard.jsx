import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { LayoutDashboard, Clock, Loader2, CheckCircle2, FileText } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import ComplaintList from '@/components/ComplaintList'
import { supabase } from '@/lib/supabase'

export default function AdminDashboard() {
  const navigate = useNavigate()
  const [stats, setStats] = useState({ total: 0, menunggu: 0, diproses: 0, selesai: 0 })

  useEffect(() => {
    const isAdmin = localStorage.getItem('isAdmin') === 'true'
    if (!isAdmin) {
      navigate('/admin/login')
    }
  }, [navigate])

  const fetchStats = useCallback(async () => {
    const { data } = await supabase
      .from('complaints')
      .select('status')

    if (data) {
      setStats({
        total: data.length,
        menunggu: data.filter((c) => c.status === 'menunggu').length,
        diproses: data.filter((c) => c.status === 'diproses').length,
        selesai: data.filter((c) => c.status === 'selesai').length,
      })
    }
  }, [])

  useEffect(() => {
    fetchStats()
  }, [fetchStats])

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
              <p className="text-sm text-gray-500">Kelola pengaduan warga RW Rowosari</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                  <FileText className="w-5 h-5 text-gray-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                  <p className="text-xs text-gray-500">Total Pengaduan</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                  <Clock className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{stats.menunggu}</p>
                  <p className="text-xs text-gray-500">Menunggu</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Loader2 className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{stats.diproses}</p>
                  <p className="text-xs text-gray-500">Diproses</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{stats.selesai}</p>
                  <p className="text-xs text-gray-500">Selesai</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardContent className="p-6">
            <ComplaintList showNama={true} showAdminActions={true} title="Semua Pengaduan" />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
