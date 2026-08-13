import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Calendar, MapPin, Tag, ChevronDown, ChevronUp, ExternalLink } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import StatusBadge from './StatusBadge'
import PhotoLightbox from './PhotoLightbox'
import { formatDate, truncateText } from '@/lib/utils'
import { kategoriLabels } from '@/data/dummy'

export default function ComplaintCard({ complaint, showNama = false, showAdminActions = false }) {
  const navigate = useNavigate()
  const [isExpanded, setIsExpanded] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState(null)

  return (
    <>
      <Card className="hover:shadow-md transition-shadow">
        <CardContent className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <StatusBadge status={complaint.status} />
                <span className="inline-flex items-center gap-1 text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                  <Tag className="w-3 h-3" />
                  {kategoriLabels[complaint.kategori]}
                </span>
              </div>

              <h3 className="font-semibold text-gray-900 mb-1">
                {complaint.judul}
              </h3>

              {showNama && (
                <p className="text-sm text-gray-600 mb-1">
                  Oleh: {complaint.nama_pelapor}
                </p>
              )}

              <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  {formatDate(complaint.tanggal_laporan)}
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5" />
                  {truncateText(complaint.lokasi, 40)}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {showAdminActions && (
                <Button
                  size="sm"
                  onClick={() => navigate(`/admin/detail/${complaint.id}`)}
                >
                  <ExternalLink className="w-4 h-4 mr-1" />
                  Lihat
                </Button>
              )}
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="flex items-center gap-1 text-sm text-primary hover:text-primary-hover transition-colors"
              >
                {isExpanded ? (
                  <>
                    Tutup <ChevronUp className="w-4 h-4" />
                  </>
                ) : (
                  <>
                    Detail <ChevronDown className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </div>

          {isExpanded && (
            <div className="mt-4 pt-4 border-t border-gray-100">
              <p className="text-gray-700 whitespace-pre-wrap">
                {complaint.deskripsi}
              </p>

              {complaint.foto_urls && complaint.foto_urls.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-4">
                  {complaint.foto_urls.map((url, index) => (
                    <button
                      key={index}
                      onClick={() => setLightboxIndex(index)}
                      className="w-20 h-20 rounded-lg overflow-hidden border border-gray-200 hover:opacity-80 transition-opacity"
                    >
                      <img
                        src={url}
                        alt={`Foto ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

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
