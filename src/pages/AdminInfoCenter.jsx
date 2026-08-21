import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { Newspaper, Plus, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
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

  const handleEdit = (info) => navigate(`/admin/informasi/edit/${info.id}`)

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
    if (error) { alert('Gagal menghapus.'); return }

    fetchCount()
    window.location.reload()
  }

  return (
    <div className="min-h-screen bg-surface">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={() => navigate('/admin/dashboard')} className="-ml-2 text-xs font-medium">
              <ArrowLeft className="w-3.5 h-3.5 mr-1" />
            </Button>
            <div className="w-8 h-8 bg-amber-50 rounded-lg flex items-center justify-center">
              <Newspaper className="w-4 h-4 text-amber-600" />
            </div>
            <div>
              <h1 className="text-base font-bold text-gray-900">Informasi</h1>
              <p className="text-[11px] text-gray-400">{total} total</p>
            </div>
          </div>

          <Button size="sm" className="shadow-sm shadow-primary/20" onClick={() => navigate('/admin/informasi/baru')}>
            <Plus className="w-3.5 h-3.5 mr-1" />
            Buat Baru
          </Button>
        </div>

        <InfoList
          showAdminActions={true}
          onEdit={handleEdit}
          onDelete={handleDelete}
          title="Semua Informasi"
        />
      </div>
    </div>
  )
}
