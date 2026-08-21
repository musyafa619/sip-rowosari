import { useState, useEffect, useCallback } from 'react'
import { Search, Filter } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import ComplaintCard from './ComplaintCard'
import ConfirmDialog from '@/components/ui/ConfirmDialog'
import { kategoriOptions } from '@/data/dummy'
import { supabase } from '@/lib/supabase'

export default function ComplaintList({ showNama = false, showAdminActions = false, onDeleteSuccess, title = "Daftar Pengaduan" }) {
  const [complaints, setComplaints] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [kategoriFilter, setKategoriFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [counts, setCounts] = useState({ total: 0, menunggu: 0, diproses: 0, selesai: 0 })
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [deleting, setDeleting] = useState(false)

  const fetchComplaints = useCallback(async () => {
    setLoading(true)

    let query = supabase
      .from('complaints')
      .select('*')
      .order('created_at', { ascending: false })

    if (search) {
      query = query.or(`judul.ilike.%${search}%,lokasi.ilike.%${search}%`)
    }

    if (kategoriFilter) {
      query = query.eq('kategori', kategoriFilter)
    }

    if (statusFilter) {
      query = query.eq('status', statusFilter)
    }

    const { data, error } = await query

    if (error) {
      console.error('Fetch error:', error)
    } else {
      setComplaints(data || [])
    }

    setLoading(false)
  }, [search, kategoriFilter, statusFilter])

  const fetchCounts = useCallback(async () => {
    const { data } = await supabase
      .from('complaints')
      .select('status')

    if (data) {
      setCounts({
        total: data.length,
        menunggu: data.filter((c) => c.status === 'menunggu').length,
        diproses: data.filter((c) => c.status === 'diproses').length,
        selesai: data.filter((c) => c.status === 'selesai').length,
      })
    }
  }, [])

  useEffect(() => {
    fetchComplaints()
  }, [fetchComplaints])

  useEffect(() => {
    fetchCounts()
  }, [fetchCounts])

  const handleDeleteRequest = (complaint) => {
    setDeleteTarget(complaint)
  }

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return
    setDeleting(true)

    try {
      if (deleteTarget.foto_urls?.length > 0) {
        const paths = deleteTarget.foto_urls.map((url) => {
          const parts = url.split('/')
          return parts.slice(parts.indexOf('complaint-photos') + 1).join('/')
        })
        await supabase.storage.from('complaint-photos').remove(paths)
      }

      const { error } = await supabase.from('complaints').delete().eq('id', deleteTarget.id)
      if (error) {
        console.error('Delete error:', error)
        alert('Gagal menghapus pengaduan. Cek konsol untuk detail.')
        setDeleting(false)
        setDeleteTarget(null)
        return
      }

      setComplaints((prev) => prev.filter((c) => c.id !== deleteTarget.id))
      fetchCounts()
      onDeleteSuccess?.()
    } catch (err) {
      console.error('Delete error:', err)
      alert('Terjadi kesalahan saat menghapus.')
    } finally {
      setDeleting(false)
      setDeleteTarget(null)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-gray-900">{title}</h2>
        <span className="text-xs text-gray-400">{complaints.length} item</span>
      </div>

      <div className="flex flex-wrap gap-1.5">
        <Badge
          variant={!statusFilter ? 'default' : 'outline'}
          className="cursor-pointer"
          onClick={() => setStatusFilter('')}
        >
          Semua ({counts.total})
        </Badge>
        <Badge
          variant={statusFilter === 'menunggu' ? 'warning' : 'outline'}
          className="cursor-pointer"
          onClick={() => setStatusFilter(statusFilter === 'menunggu' ? '' : 'menunggu')}
        >
          Menunggu ({counts.menunggu})
        </Badge>
        <Badge
          variant={statusFilter === 'diproses' ? 'info' : 'outline'}
          className="cursor-pointer"
          onClick={() => setStatusFilter(statusFilter === 'diproses' ? '' : 'diproses')}
        >
          Diproses ({counts.diproses})
        </Badge>
        <Badge
          variant={statusFilter === 'selesai' ? 'success' : 'outline'}
          className="cursor-pointer"
          onClick={() => setStatusFilter(statusFilter === 'selesai' ? '' : 'selesai')}
        >
          Selesai ({counts.selesai})
        </Badge>
      </div>

      <div className="flex flex-col sm:flex-row gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
          <Input
            placeholder="Cari..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8 h-8 text-sm"
          />
        </div>
        <Select
          value={kategoriFilter}
          onChange={(e) => setKategoriFilter(e.target.value)}
          className="sm:w-40 h-8 text-sm"
        >
          <option value="">Semua Kategori</option>
          {kategoriOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </Select>
      </div>

      {loading ? (
        <div className="text-center py-10">
          <div className="w-5 h-5 border-2 border-gray-300 border-t-primary rounded-full animate-spin mx-auto mb-2" />
          <p className="text-xs text-gray-400">Memuat...</p>
        </div>
      ) : complaints.length === 0 ? (
        <div className="text-center py-10">
          <Filter className="w-8 h-8 text-gray-300 mx-auto mb-2" />
          <p className="text-xs text-gray-400">Tidak ada data</p>
        </div>
      ) : (
        <div className="space-y-2">
          {complaints.map((complaint) => (
            <ComplaintCard
              key={complaint.id}
              complaint={complaint}
              showNama={showNama}
              showAdminActions={showAdminActions}
              onDelete={handleDeleteRequest}
            />
          ))}
        </div>
      )}

      <ConfirmDialog
        open={!!deleteTarget}
        title="Hapus Pengaduan?"
        description={`"${deleteTarget?.judul}" akan dihapus permanen beserta foto terkait. Aksi ini tidak dapat dibatalkan.`}
        loading={deleting}
        onConfirm={handleDeleteConfirm}
        onCancel={() => { if (!deleting) setDeleteTarget(null) }}
      />
    </div>
  )
}
