import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, FileText } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
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
        <Button variant="ghost" size="sm" onClick={() => navigate('/admin/dashboard')} className="mb-4 -ml-2">
          <ArrowLeft className="w-3.5 h-3.5 mr-1" />
          Dashboard
        </Button>

        <div className="flex items-center gap-2 mb-5">
          <FileText className="w-4 h-4 text-gray-600" />
          <h1 className="text-lg font-semibold text-gray-900">Pengaduan</h1>
        </div>

        <div className="flex gap-2 mb-5">
          <Badge variant="secondary">Total {stats.total}</Badge>
          <Badge variant="warning">Menunggu {stats.menunggu}</Badge>
          <Badge variant="info">Diproses {stats.diproses}</Badge>
          <Badge variant="success">Selesai {stats.selesai}</Badge>
        </div>

        <Card>
          <CardContent className="p-4">
            <ComplaintList showNama={true} showAdminActions={true} title="Semua Pengaduan" />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
