import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Save, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
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
    if (!isAdmin) { navigate('/admin/login'); return }

    if (isEditing) {
      const fetchInfo = async () => {
        const { data, error } = await supabase.from('informations').select('*').eq('id', id).single()
        if (error || !data) { navigate('/admin/informasi'); return }
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
      const { error } = await supabase.storage.from('info-photos').upload(filePath, photo.file)
      if (error) throw error
      const { data: urlData } = supabase.storage.from('info-photos').getPublicUrl(filePath)
      uploadedUrls.push(urlData.publicUrl)
    }
    return uploadedUrls
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (!judul.trim()) { setError('Judul wajib diisi'); return }
    if (!konten.trim() || konten === '<p></p>') { setError('Konten wajib diisi'); return }

    setSaving(true)
    try {
      let newPhotoUrls = photos.length > 0 ? await uploadPhotos() : []
      const fotoUrls = [...existingPhotos, ...newPhotoUrls]

      if (isEditing) {
        const { error } = await supabase.from('informations').update({ judul: judul.trim(), konten, foto_urls: fotoUrls }).eq('id', id)
        if (error) throw error
      } else {
        const { error } = await supabase.from('informations').insert({ judul: judul.trim(), konten, foto_urls: fotoUrls })
        if (error) throw error
      }
      navigate('/admin/informasi')
    } catch (err) {
      console.error('Save error:', err)
      setError('Gagal menyimpan.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface">
        <div className="w-5 h-5 border-2 border-gray-200 border-t-primary rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-surface">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6">
        <Button variant="ghost" size="sm" onClick={() => navigate('/admin/informasi')} className="mb-4 -ml-2 text-xs font-medium">
          <ArrowLeft className="w-3.5 h-3.5 mr-1" />
          Kembali
        </Button>

        <h1 className="text-base font-bold text-gray-900 mb-5">
          {isEditing ? 'Edit Informasi' : 'Buat Informasi'}
        </h1>

        <Card>
          <CardContent className="p-5">
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 text-xs rounded-lg px-3 py-2 font-medium">{error}</div>
              )}

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-700">Judul</label>
                <Input placeholder="Judul informasi" value={judul} onChange={(e) => setJudul(e.target.value)} />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-700">Konten</label>
                <RichTextEditor content={konten} onChange={setKonten} />
              </div>

              {existingPhotos.length > 0 && (
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-700">Foto Saat Ini</label>
                  <div className="flex flex-wrap gap-2">
                    {existingPhotos.map((url, index) => (
                      <div key={index} className="relative group">
                        <div className="w-20 h-20 rounded-lg overflow-hidden border border-gray-100">
                          <img src={url} alt="" className="w-full h-full object-cover" />
                        </div>
                        <button type="button" onClick={() => setExistingPhotos((p) => p.filter((_, i) => i !== index))}
                          className="absolute -top-1.5 -right-1.5 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <InfoImageUpload photos={photos} setPhotos={setPhotos} />

              <div className="flex justify-end gap-2 pt-3 border-t border-gray-100">
                <Button type="button" variant="ghost" size="sm" onClick={() => navigate('/admin/informasi')}>Batal</Button>
                <Button type="submit" size="sm" className="shadow-sm shadow-primary/20" disabled={saving}>
                  {saving ? 'Menyimpan...' : <><Save className="w-3.5 h-3.5 mr-1" />{isEditing ? 'Simpan' : 'Publikasikan'}</>}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
