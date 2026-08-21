import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronDown, ChevronUp, ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/button'
import StatusBadge from './StatusBadge'
import PhotoLightbox from './PhotoLightbox'
import { formatDate, truncateText } from '@/lib/utils'
import { kategoriLabels } from '@/data/dummy'

const statusAccent = {
  menunggu: 'border-l-amber-400',
  diproses: 'border-l-blue-400',
  selesai: 'border-l-emerald-400',
}

export default function ComplaintCard({ complaint, showNama = false, showAdminActions = false, onDelete }) {
  const navigate = useNavigate()
  const [isExpanded, setIsExpanded] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState(null)

  return (
    <>
      <div className={`bg-white border border-gray-100 border-l-[3px] ${statusAccent[complaint.status] || 'border-l-gray-300'} rounded-lg p-4 card-hover`}>
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-1.5">
              <StatusBadge status={complaint.status} />
              <span className="text-[11px] text-gray-400 font-medium">{kategoriLabels[complaint.kategori]}</span>
            </div>

            <h3 className="text-sm font-semibold text-gray-900 mb-1 leading-snug">{complaint.judul}</h3>

            {showNama && (
              <p className="text-xs text-gray-500 mb-1">{complaint.nama_pelapor}</p>
            )}

            <p className="text-xs text-gray-400">
              {formatDate(complaint.tanggal_laporan)} &middot; {truncateText(complaint.lokasi, 40)}
            </p>
          </div>

          <div className="flex items-center gap-1 shrink-0">
            {showAdminActions && (
              <>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => navigate(`/admin/detail/${complaint.id}`)}
                  className="text-xs h-7 px-2 font-medium"
                >
                  <ExternalLink className="w-3 h-3 mr-1" />
                  Detail
                </Button>
                <button
                  onClick={() => onDelete?.(complaint)}
                  className="text-xs text-red-500 font-semibold hover:underline"
                >
                  Hapus
                </button>
              </>
            )}
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-1 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-colors"
            >
              {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {isExpanded && (
          <div className="mt-3 pt-3 border-t border-gray-50">
            <p className="text-sm text-gray-600 whitespace-pre-wrap leading-relaxed">
              {complaint.deskripsi}
            </p>

            {complaint.foto_urls?.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {complaint.foto_urls.map((url, index) => (
                  <button
                    key={index}
                    onClick={() => setLightboxIndex(index)}
                    className="w-16 h-16 rounded-lg overflow-hidden border border-gray-100 hover:border-gray-200 transition-colors"
                  >
                    <img src={url} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {lightboxIndex !== null && complaint.foto_urls && (
        <PhotoLightbox
          photos={complaint.foto_urls}
          initialIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
        />
      )}
    </>
  )
}
