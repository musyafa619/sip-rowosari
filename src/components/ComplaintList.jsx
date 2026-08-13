import { useState, useEffect, useCallback } from 'react'
import { Search, Filter, ListFilter } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import ComplaintCard from './ComplaintCard'
import { kategoriOptions } from '@/data/dummy'
import { supabase } from '@/lib/supabase'

export default function ComplaintList({ showNama = false, showAdminActions = false, title = "Daftar Pengaduan" }) {
  const [complaints, setComplaints] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [kategoriFilter, setKategoriFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [counts, setCounts] = useState({ total: 0, menunggu: 0, diproses: 0, selesai: 0 })

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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
          <ListFilter className="w-5 h-5 text-primary" />
          {title}
        </h2>
        <Badge variant="outline">{complaints.length} pengaduan</Badge>
      </div>

      <div className="flex flex-wrap gap-2">
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

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Cari berdasarkan judul atau lokasi..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select
          value={kategoriFilter}
          onChange={(e) => setKategoriFilter(e.target.value)}
          className="sm:w-48"
        >
          <option value="">Semua Kategori</option>
          {kategoriOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </Select>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-3" />
          <p className="text-gray-500">Memuat data...</p>
        </div>
      ) : complaints.length === 0 ? (
        <div className="text-center py-12">
          <Filter className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">Tidak ada pengaduan yang ditemukan</p>
        </div>
      ) : (
        <div className="space-y-3">
          {complaints.map((complaint) => (
            <ComplaintCard
              key={complaint.id}
              complaint={complaint}
              showNama={showNama}
              showAdminActions={showAdminActions}
            />
          ))}
        </div>
      )}
    </div>
  )
}
