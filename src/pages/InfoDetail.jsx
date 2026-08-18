import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, MessageCircle } from 'lucide-react'
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
        <div className="w-5 h-5 border-2 border-gray-300 border-t-primary rounded-full animate-spin" />
      </div>
    )
  }

  const waLink = `https://wa.me/?text=${encodeURIComponent(`Tentang "${info.judul}": Saya ingin bertanya...`)}`

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-6">
        <Button variant="ghost" size="sm" onClick={() => navigate('/')} className="mb-4 -ml-2">
          <ArrowLeft className="w-3.5 h-3.5 mr-1" />
          Kembali
        </Button>

        <Card>
          <CardContent className="p-5">
            <p className="text-xs text-gray-400 mb-2">{formatDate(info.created_at)}</p>

            <h1 className="text-lg font-semibold text-gray-900 mb-4">{info.judul}</h1>

            {info.foto_urls?.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-5">
                {info.foto_urls.map((url, index) => (
                  <button
                    key={index}
                    onClick={() => setLightboxIndex(index)}
                    className="rounded overflow-hidden border border-gray-200"
                  >
                    <img src={url} alt="" className="w-full max-w-xs h-auto object-cover" />
                  </button>
                ))}
              </div>
            )}

            <div
              className="prose prose-sm max-w-none text-gray-600 [&_h2]:text-base [&_h2]:font-semibold [&_h2]:mt-4 [&_h2]:mb-2 [&_h3]:text-sm [&_h3]:font-semibold [&_p]:my-2 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_blockquote]:border-l-2 [&_blockquote]:border-gray-300 [&_blockquote]:pl-3 [&_blockquote]:italic [&_a]:text-primary [&_a]:underline"
              dangerouslySetInnerHTML={{ __html: info.konten }}
            />

            <div className="mt-6 pt-4 border-t border-gray-100">
              <a
                href={waLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 bg-green-600 hover:bg-green-700 text-white text-sm font-medium px-4 py-2 rounded transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                Tanya via WhatsApp
              </a>
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
