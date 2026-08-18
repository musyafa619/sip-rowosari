import { useState, useEffect, useCallback } from 'react'
import { Search, Newspaper } from 'lucide-react'
import { Input } from '@/components/ui/input'
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
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-gray-900">{title}</h2>
        <span className="text-xs text-gray-400">{infos.length} item</span>
      </div>

      <div className="relative">
        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
        <Input
          placeholder="Cari..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-8 h-8 text-sm"
        />
      </div>

      {loading ? (
        <div className="text-center py-10">
          <div className="w-5 h-5 border-2 border-gray-300 border-t-primary rounded-full animate-spin mx-auto mb-2" />
          <p className="text-xs text-gray-400">Memuat...</p>
        </div>
      ) : infos.length === 0 ? (
        <div className="text-center py-10">
          <Newspaper className="w-8 h-8 text-gray-300 mx-auto mb-2" />
          <p className="text-xs text-gray-400">Belum ada informasi</p>
        </div>
      ) : (
        <div className="space-y-2">
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
