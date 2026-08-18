import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Calendar, MessageCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import PhotoLightbox from '@/components/PhotoLightbox'
import { supabase } from '@/lib/supabase'
import { formatDate } from '@/lib/utils'

export default function InfoDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [info, setInfo] = useState(null)
  const [loading, setLoading] = useState(true)
  const [lightboxIndex, setLightboxIndex] = useState(null)

  useEffect(() => {
    const fetchInfo = async () => {
      const { data, error } = await supabase
        .from('informations')
        .select('*')
        .eq('id', id)
        .single()

      if (error || !data) {
        navigate('/')
        return
      }

      setInfo(data)
      setLoading(false)
    }

    fetchInfo()
  }, [id, navigate])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    )
  }

  const waLink = `https://wa.me/?text=${encodeURIComponent(`Tentang "${info.judul}": Saya ingin bertanya...`)}`

  return (
    <div className="min-h-screen bg-surface">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate('/')}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Kembali
        </Button>

        <Card>
          <CardContent className="p-6 sm:p-8">
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
              <Calendar className="w-4 h-4" />
              {formatDate(info.created_at)}
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">
              {info.judul}
            </h1>

            {info.foto_urls?.length > 0 && (
              <div className="flex flex-wrap gap-3 mb-6">
                {info.foto_urls.map((url, index) => (
                  <button
                    key={index}
                    onClick={() => setLightboxIndex(index)}
                    className="rounded-lg overflow-hidden border border-gray-200 hover:opacity-80 transition-opacity"
                  >
                    <img
                      src={url}
                      alt={`Foto ${index + 1}`}
                      className="w-full max-w-sm h-auto object-cover"
                    />
                  </button>
                ))}
              </div>
            )}

            <div
              className="prose prose-sm sm:prose max-w-none text-gray-700 [&_h2]:text-lg [&_h2]:font-semibold [&_h2]:mt-4 [&_h2]:mb-2 [&_h3]:text-base [&_h3]:font-semibold [&_h3]:mt-3 [&_h3]:mb-1.5 [&_p]:my-2 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:my-2 [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:my-2 [&_blockquote]:border-l-4 [&_blockquote]:border-primary/30 [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-gray-600 [&_img]:rounded-lg [&_img]:max-w-full [&_a]:text-primary [&_a]:underline"
              dangerouslySetInnerHTML={{ __html: info.konten }}
            />

            <div className="mt-8 pt-6 border-t border-gray-200">
              <a
                href={waLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white font-medium px-5 py-2.5 rounded-lg transition-colors"
              >
                <MessageCircle className="w-5 h-5" />
                Tanya via WhatsApp
              </a>
              <p className="text-xs text-gray-500 mt-2">
                Punya pertanyaan? Klik tombol di atas untuk langsung chat via WhatsApp.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {lightboxIndex !== null && info.foto_urls && (
        <PhotoLightbox
          photos={info.foto_urls}
          initialIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
        />
      )}
    </div>
  )
}
