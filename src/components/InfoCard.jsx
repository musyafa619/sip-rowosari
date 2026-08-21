import { useNavigate } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { formatDate, truncateText } from '@/lib/utils'

export default function InfoCard({ info, showAdminActions = false, onEdit, onDelete }) {
  const navigate = useNavigate()
  const coverImage = info.foto_urls?.[0]
  const plainText = info.konten?.replace(/<[^>]*>/g, '') || ''

  return (
    <div className="bg-white border border-gray-100 rounded-lg overflow-hidden card-hover">
      <div className="flex">
        {coverImage && (
          <div className="w-28 sm:w-32 shrink-0">
            <img src={coverImage} alt={info.judul} className="w-full h-full object-cover" />
          </div>
        )}
        <div className="p-4 flex-1 min-w-0">
          <p className="text-[11px] text-gray-400 font-medium mb-1">{formatDate(info.created_at)}</p>
          <h3 className="text-sm font-semibold text-gray-900 mb-1 leading-snug">{info.judul}</h3>
          <p className="text-xs text-gray-500 mb-3 line-clamp-2 leading-relaxed">{truncateText(plainText, 120)}</p>

          {showAdminActions ? (
            <div className="flex items-center gap-3">
              <button onClick={() => onEdit?.(info)} className="text-xs text-primary font-semibold hover:underline">Edit</button>
              <button onClick={() => onDelete?.(info)} className="text-xs text-red-500 font-semibold hover:underline">Hapus</button>
            </div>
          ) : (
            <button
              onClick={() => navigate(`/informasi/${info.id}`)}
              className="inline-flex items-center gap-1 text-xs text-primary font-semibold hover:gap-1.5 transition-all"
            >
              Baca selengkapnya <ArrowRight className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
