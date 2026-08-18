import { useState, useEffect, useCallback } from 'react'
import { Search, Newspaper } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import InfoCard from './InfoCard'
import { supabase } from '@/lib/supabase'

export default function InfoList({ showAdminActions = false, onEdit, onDelete, title = "Informasi Terbaru" }) {
  const [infos, setInfos] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  const fetchInfos = useCallback(async () => {
    setLoading(true)

    let query = supabase
      .from('informations')
      .select('*')
      .order('created_at', { ascending: false })

    if (search) {
      query = query.ilike('judul', `%${search}%`)
    }

    const { data, error } = await query

    if (error) {
      console.error('Fetch infos error:', error)
    } else {
      setInfos(data || [])
    }

    setLoading(false)
  }, [search])

  useEffect(() => {
    fetchInfos()
  }, [fetchInfos])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
          <Newspaper className="w-5 h-5 text-primary" />
          {title}
        </h2>
        <Badge variant="outline">{infos.length} informasi</Badge>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <Input
          placeholder="Cari informasi..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-3" />
          <p className="text-gray-500">Memuat data...</p>
        </div>
      ) : infos.length === 0 ? (
        <div className="text-center py-12">
          <Newspaper className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">Belum ada informasi</p>
        </div>
      ) : (
        <div className="space-y-3">
          {infos.map((info) => (
            <InfoCard
              key={info.id}
              info={info}
              showAdminActions={showAdminActions}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </div>
  )
}
