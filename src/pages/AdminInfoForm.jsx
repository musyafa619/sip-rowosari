import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Save, Newspaper } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import RichTextEditor from '@/components/RichTextEditor'
import InfoImageUpload from '@/components/InfoImageUpload'
import { supabase } from '@/lib/supabase'

export default function AdminInfoForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEditing = Boolean(id)

  const [judul, setJudul] = useState('')
  const [konten, setKonten] = useState('')
  const [photos, setPhotos] = useState([])
  const [existingPhotos, setExistingPhotos] = useState([])
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(isEditing)

  useEffect(() => {
    const isAdmin = localStorage.getItem('isAdmin') === 'true'
    if (!isAdmin) {
      navigate('/admin/login')
      return
    }

    if (isEditing) {
      const fetchInfo = async () => {
        const { data, error } = await supabase
          .from('informations')
          .select('*')
          .eq('id', id)
          .single()

        if (error || !data) {
          navigate('/admin/informasi')
          return
        }

        setJudul(data.judul)
        setKonten(data.konten)
        setExistingPhotos(data.foto_urls || [])
        setLoading(false)
      }

      fetchInfo()
    }
  }, [id, isEditing, navigate])

  const uploadPhotos = async () => {
    const uploadedUrls = []

    for (const photo of photos) {
      const fileExt = photo.file.name.split('.').pop()
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`
      const filePath = `informations/${fileName}`

      const { data, error } = await supabase.storage
        .from('info-photos')
        .upload(filePath, photo.file)

      if (error) {
        console.error('Upload error:', error)
        throw error
      }

      const { data: urlData } = supabase.storage
        .from('info-photos')
        .getPublicUrl(filePath)

      uploadedUrls.push(urlData.publicUrl)
    }

    return uploadedUrls
  }

  const removeExistingPhoto = (index) => {
    setExistingPhotos((prev) => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!judul.trim()) {
      setError('Judul wajib diisi')
      return
    }
    if (!konten.trim() || konten === '<p></p>') {
      setError('Konten wajib diisi')
      return
    }

    setSaving(true)

    try {
      let newPhotoUrls = []
      if (photos.length > 0) {
        newPhotoUrls = await uploadPhotos()
      }

      const fotoUrls = [...existingPhotos, ...newPhotoUrls]

      if (isEditing) {
        const { error: updateError } = await supabase
          .from('informations')
          .update({
            judul: judul.trim(),
            konten,
            foto_urls: fotoUrls,
          })
          .eq('id', id)

        if (updateError) throw updateError
      } else {
        const { error: insertError } = await supabase
          .from('informations')
          .insert({
            judul: judul.trim(),
            konten,
            foto_urls: fotoUrls,
          })

        if (insertError) throw insertError
      }

      navigate('/admin/informasi')
    } catch (err) {
      console.error('Save error:', err)
      setError('Gagal menyimpan informasi. Silakan coba lagi.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-surface">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate('/admin/informasi')}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Kembali
        </Button>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Newspaper className="w-5 h-5 text-primary" />
              {isEditing ? 'Edit Informasi' : 'Buat Informasi Baru'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg px-4 py-3">
                  {error}
                </div>
              )}

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Judul <span className="text-red-500">*</span>
                </label>
                <Input
                  placeholder="Judul informasi"
                  value={judul}
                  onChange={(e) => setJudul(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Konten <span className="text-red-500">*</span>
                </label>
                <RichTextEditor
                  content={konten}
                  onChange={setKonten}
                  placeholder="Tulis konten informasi di sini..."
                />
              </div>

              {existingPhotos.length > 0 && (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Foto Saat Ini
                  </label>
                  <div className="flex flex-wrap gap-3">
                    {existingPhotos.map((url, index) => (
                      <div key={index} className="relative group">
                        <div className="w-24 h-24 rounded-lg overflow-hidden border border-gray-200">
                          <img
                            src={url}
                            alt={`Foto ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => removeExistingPhoto(index)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <InfoImageUpload photos={photos} setPhotos={setPhotos} />

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate('/admin/informasi')}
                >
                  Batal
                </Button>
                <Button type="submit" disabled={saving}>
                  {saving ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                      Menyimpan...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      {isEditing ? 'Simpan Perubahan' : 'Publikasikan'}
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
