import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { Newspaper, Plus, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import InfoList from '@/components/InfoList'
import { supabase } from '@/lib/supabase'

export default function AdminInfoCenter() {
  const navigate = useNavigate()
  const [total, setTotal] = useState(0)

  useEffect(() => {
    const isAdmin = localStorage.getItem('isAdmin') === 'true'
    if (!isAdmin) navigate('/admin/login')
  }, [navigate])

  const fetchCount = useCallback(async () => {
    const { count } = await supabase
      .from('informations')
      .select('*', { count: 'exact', head: true })
    setTotal(count || 0)
  }, [])

  useEffect(() => {
    fetchCount()
  }, [fetchCount])

  const handleEdit = (info) => {
    navigate(`/admin/informasi/edit/${info.id}`)
  }

  const handleDelete = async (info) => {
    if (!confirm(`Hapus "${info.judul}"?`)) return

    if (info.foto_urls?.length > 0) {
      const paths = info.foto_urls.map((url) => {
        const parts = url.split('/')
        return parts.slice(parts.indexOf('info-photos') + 1).join('/')
      })
      await supabase.storage.from('info-photos').remove(paths)
    }

    const { error } = await supabase.from('informations').delete().eq('id', info.id)
    if (error) {
      alert('Gagal menghapus.')
      return
    }

    fetchCount()
    window.location.reload()
  }

  return (
    <div className="min-h-screen bg-surface">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={() => navigate('/admin/dashboard')} className="-ml-2">
              <ArrowLeft className="w-3.5 h-3.5 mr-1" />
            </Button>
            <Newspaper className="w-4 h-4 text-gray-600" />
            <h1 className="text-lg font-semibold text-gray-900">Informasi</h1>
            <span className="text-xs text-gray-400">{total}</span>
          </div>

          <Button size="sm" onClick={() => navigate('/admin/informasi/baru')}>
            <Plus className="w-3.5 h-3.5 mr-1" />
            Buat Baru
          </Button>
        </div>

        <Card>
          <CardContent className="p-4">
            <InfoList
              showAdminActions={true}
              onEdit={handleEdit}
              onDelete={handleDelete}
              title="Semua Informasi"
            />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
