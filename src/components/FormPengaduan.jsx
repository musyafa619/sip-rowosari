import { useState, useCallback } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { X, Upload } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select } from '@/components/ui/select'
import { kategoriOptions } from '@/data/dummy'
import { supabase } from '@/lib/supabase'

const complaintSchema = z.object({
  judul: z.string().min(5, 'Judul minimal 5 karakter'),
  nama_pelapor: z.string().min(3, 'Nama minimal 3 karakter'),
  tanggal_laporan: z.string().min(1, 'Tanggal wajib diisi'),
  kategori: z.string().min(1, 'Kategori wajib dipilih'),
  lokasi: z.string().min(5, 'Lokasi minimal 5 karakter'),
  deskripsi: z.string().min(20, 'Deskripsi minimal 20 karakter'),
})

export default function FormPengaduan({ onSubmitSuccess }) {
  const [photos, setPhotos] = useState([])
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [submitError, setSubmitError] = useState('')

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(complaintSchema),
    defaultValues: {
      tanggal_laporan: new Date().toISOString().split('T')[0],
    },
  })

  const handlePhotoUpload = useCallback((e) => {
    const files = Array.from(e.target.files)
    if (files.length === 0) return

    setPhotos((prev) => {
      if (prev.length + files.length > 3) {
        alert('Maksimal 3 foto')
        return prev
      }
      const newPhotos = files.map((file) => ({
        file,
        preview: URL.createObjectURL(file),
      }))
      return [...prev, ...newPhotos]
    })

    e.target.value = ''
  }, [])

  const removePhoto = (index) => {
    setPhotos((prev) => {
      const updated = [...prev]
      URL.revokeObjectURL(updated[index].preview)
      updated.splice(index, 1)
      return updated
    })
  }

  const uploadPhotos = async () => {
    const uploadedUrls = []

    for (const photo of photos) {
      const fileExt = photo.file.name.split('.').pop()
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`
      const filePath = `complaints/${fileName}`

      const { error } = await supabase.storage
        .from('complaint-photos')
        .upload(filePath, photo.file)

      if (error) throw error

      const { data: urlData } = supabase.storage
        .from('complaint-photos')
        .getPublicUrl(filePath)

      uploadedUrls.push(urlData.publicUrl)
    }

    return uploadedUrls
  }

  const onSubmit = async (data) => {
    setSubmitError('')

    try {
      let fotoUrls = []
      if (photos.length > 0) {
        fotoUrls = await uploadPhotos()
      }

      const { error } = await supabase.from('complaints').insert({
        judul: data.judul,
        nama_pelapor: data.nama_pelapor,
        tanggal_laporan: data.tanggal_laporan,
        kategori: data.kategori,
        lokasi: data.lokasi,
        deskripsi: data.deskripsi,
        foto_urls: fotoUrls,
        status: 'menunggu',
      })

      if (error) throw error

      setIsSubmitted(true)
      reset()
      setPhotos([])
      onSubmitSuccess?.()
      setTimeout(() => setIsSubmitted(false), 5000)
    } catch (err) {
      console.error('Submit error:', err)
      setSubmitError('Gagal mengirim pengaduan. Silakan coba lagi.')
    }
  }

  if (isSubmitted) {
    return (
      <div className="border border-primary/20 bg-primary-light rounded-md p-6 text-center">
        <p className="text-sm font-medium text-primary mb-1">Pengaduan terkirim</p>
        <p className="text-xs text-gray-500 mb-4">Terima kasih, laporan Anda akan segera ditindaklanjuti.</p>
        <Button onClick={() => setIsSubmitted(false)} variant="outline" size="sm">
          Kirim Lagi
        </Button>
      </div>
    )
  }

  return (
    <div>
      <h2 className="text-sm font-semibold text-gray-900 mb-4">Buat Pengaduan</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {submitError && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-xs rounded px-3 py-2">
            {submitError}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-gray-600">Judul</label>
            <Input placeholder="Judul pengaduan" {...register('judul')} />
            {errors.judul && <p className="text-xs text-red-500">{errors.judul.message}</p>}
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-gray-600">Nama Pelapor</label>
            <Input placeholder="Nama Anda" {...register('nama_pelapor')} />
            {errors.nama_pelapor && <p className="text-xs text-red-500">{errors.nama_pelapor.message}</p>}
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-gray-600">Tanggal</label>
            <Input type="date" {...register('tanggal_laporan')} />
            {errors.tanggal_laporan && <p className="text-xs text-red-500">{errors.tanggal_laporan.message}</p>}
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-gray-600">Kategori</label>
            <Select {...register('kategori')}>
              <option value="">Pilih</option>
              {kategoriOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </Select>
            {errors.kategori && <p className="text-xs text-red-500">{errors.kategori.message}</p>}
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-medium text-gray-600">Lokasi</label>
          <Input placeholder="Jl. Melati RT 02/RW 05" {...register('lokasi')} />
          {errors.lokasi && <p className="text-xs text-red-500">{errors.lokasi.message}</p>}
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-medium text-gray-600">Deskripsi</label>
          <Textarea placeholder="Jelaskan pengaduan Anda..." rows={3} {...register('deskripsi')} />
          {errors.deskripsi && <p className="text-xs text-red-500">{errors.deskripsi.message}</p>}
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-medium text-gray-600">Foto (opsional, maks. 3)</label>
          <div className="flex flex-wrap gap-2">
            {photos.map((photo, index) => (
              <div key={index} className="relative group">
                <div className="w-20 h-20 rounded overflow-hidden border border-gray-200">
                  <img src={photo.preview} alt="" className="w-full h-full object-cover" />
                </div>
                <button
                  type="button"
                  onClick={() => removePhoto(index)}
                  className="absolute -top-1.5 -right-1.5 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
            {photos.length < 3 && (
              <div className="relative">
                <button
                  type="button"
                  className="w-20 h-20 rounded border border-dashed border-gray-300 flex flex-col items-center justify-center text-gray-400 hover:border-gray-400 transition-colors"
                >
                  <Upload className="w-4 h-4" />
                  <span className="text-[10px] mt-0.5">Upload</span>
                </button>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handlePhotoUpload}
                  style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer' }}
                />
              </div>
            )}
          </div>
        </div>

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? 'Mengirim...' : 'Kirim Pengaduan'}
        </Button>
      </form>
    </div>
  )
}
