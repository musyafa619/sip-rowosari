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
    if (!isAdmin) {
      navigate('/admin/login')
    }
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
    if (!confirm(`Hapus informasi "${info.judul}"? Tindakan ini tidak dapat dibatalkan.`)) {
      return
    }

    if (info.foto_urls?.length > 0) {
      const paths = info.foto_urls.map((url) => {
        const parts = url.split('/')
        return parts.slice(parts.indexOf('info-photos') + 1).join('/')
      })

      await supabase.storage.from('info-photos').remove(paths)
    }

    const { error } = await supabase
      .from('informations')
      .delete()
      .eq('id', info.id)

    if (error) {
      alert('Gagal menghapus informasi.')
      return
    }

    fetchCount()
    window.location.reload()
  }

  return (
    <div className="min-h-screen bg-surface">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/admin/dashboard')}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Dashboard
            </Button>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-secondary rounded-lg flex items-center justify-center">
                <Newspaper className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Pusat Informasi</h1>
                <p className="text-sm text-gray-500">Kelola informasi untuk warga</p>
              </div>
            </div>
          </div>

          <Button onClick={() => navigate('/admin/informasi/baru')}>
            <Plus className="w-4 h-4 mr-2" />
            Buat Informasi
          </Button>
        </div>

        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-secondary/10 rounded-lg flex items-center justify-center">
                <Newspaper className="w-5 h-5 text-secondary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{total}</p>
                <p className="text-xs text-gray-500">Total Informasi</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
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
