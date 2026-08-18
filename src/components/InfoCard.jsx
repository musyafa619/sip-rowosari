import { useNavigate } from 'react-router-dom'
import { Calendar, ArrowRight } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { formatDate, truncateText } from '@/lib/utils'

export default function InfoCard({ info, showAdminActions = false, onEdit, onDelete }) {
  const navigate = useNavigate()
  const coverImage = info.foto_urls?.[0]
  const plainText = info.konten?.replace(/<[^>]*>/g, '') || ''

  return (
    <Card className="hover:shadow-md transition-shadow overflow-hidden">
      <div className="flex flex-col sm:flex-row">
        {coverImage && (
          <div className="sm:w-48 sm:h-auto h-48 shrink-0">
            <img
              src={coverImage}
              alt={info.judul}
              className="w-full h-full object-cover"
            />
          </div>
        )}
        <CardContent className={`p-4 sm:p-5 flex-1 ${!coverImage ? 'pt-5' : ''}`}>
          <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
            <Calendar className="w-3.5 h-3.5" />
            {formatDate(info.created_at)}
          </div>

          <h3 className="font-semibold text-gray-900 mb-1.5">
            {info.judul}
          </h3>

          <p className="text-sm text-gray-600 mb-3">
            {truncateText(plainText, 150)}
          </p>

          <div className="flex items-center gap-2">
            {showAdminActions ? (
              <>
                <button
                  onClick={() => onEdit?.(info)}
                  className="text-sm text-primary hover:text-primary-hover font-medium transition-colors"
                >
                  Edit
                </button>
                <span className="text-gray-300">|</span>
                <button
                  onClick={() => onDelete?.(info)}
                  className="text-sm text-red-500 hover:text-red-600 font-medium transition-colors"
                >
                  Hapus
                </button>
              </>
            ) : (
              <button
                onClick={() => navigate(`/informasi/${info.id}`)}
                className="flex items-center gap-1 text-sm text-primary hover:text-primary-hover font-medium transition-colors"
              >
                Baca selengkapnya <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </CardContent>
      </div>
    </Card>
  )
}
