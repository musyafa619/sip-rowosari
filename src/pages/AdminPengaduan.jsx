import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, FileText } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import ComplaintList from '@/components/ComplaintList'
import { supabase } from '@/lib/supabase'

export default function AdminPengaduan() {
  const navigate = useNavigate()
  const [stats, setStats] = useState({ total: 0, menunggu: 0, diproses: 0, selesai: 0 })

  useEffect(() => {
    const isAdmin = localStorage.getItem('isAdmin') === 'true'
    if (!isAdmin) navigate('/admin/login')
  }, [navigate])

  const fetchStats = useCallback(async () => {
    const { data } = await supabase.from('complaints').select('status')
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
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6">
        <Button variant="ghost" size="sm" onClick={() => navigate('/admin/dashboard')} className="mb-4 -ml-2 text-xs font-medium">
          <ArrowLeft className="w-3.5 h-3.5 mr-1" />
          Dashboard
        </Button>

        <div className="flex items-center gap-2 mb-5">
          <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
            <FileText className="w-4 h-4 text-primary" />
          </div>
          <div>
            <h1 className="text-base font-bold text-gray-900">Pengaduan</h1>
            <p className="text-[11px] text-gray-400">{stats.total} total</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-1.5 mb-5">
          <Badge variant="secondary">Total {stats.total}</Badge>
          <Badge variant="warning">Menunggu {stats.menunggu}</Badge>
          <Badge variant="info">Diproses {stats.diproses}</Badge>
          <Badge variant="success">Selesai {stats.selesai}</Badge>
        </div>

        <ComplaintList showNama={true} showAdminActions={true} onDeleteSuccess={fetchStats} title="Semua Pengaduan" />
      </div>
    </div>
  )
}
