import { useState, useCallback } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { X, Upload, CheckCircle2 } from 'lucide-react'
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
      <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-6 text-center">
        <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
        <p className="text-sm font-semibold text-emerald-800 mb-1">Terkirim!</p>
        <p className="text-xs text-emerald-600 mb-4">Laporan Anda akan segera ditindaklanjuti oleh pengurus.</p>
        <Button onClick={() => setIsSubmitted(false)} variant="outline" size="sm" className="border-emerald-300 text-emerald-700 hover:bg-emerald-100">
          Kirim Lagi
        </Button>
      </div>
    )
  }

  return (
    <div>
      <h2 className="text-base font-bold text-gray-900 mb-1">Buat Pengaduan</h2>
      <p className="text-xs text-gray-400 mb-5">Sampaikan keluhan Anda secara anonim</p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {submitError && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-xs rounded-lg px-3 py-2">
            {submitError}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-700">Judul</label>
            <Input placeholder="Ringkasan singkat masalah" {...register('judul')} />
            {errors.judul && <p className="text-[11px] text-red-500">{errors.judul.message}</p>}
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-700">Nama Pelapor</label>
            <Input placeholder="Nama Anda" {...register('nama_pelapor')} />
            {errors.nama_pelapor && <p className="text-[11px] text-red-500">{errors.nama_pelapor.message}</p>}
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-700">Tanggal</label>
            <Input type="date" {...register('tanggal_laporan')} />
            {errors.tanggal_laporan && <p className="text-[11px] text-red-500">{errors.tanggal_laporan.message}</p>}
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-700">Kategori</label>
            <Select {...register('kategori')}>
              <option value="">Pilih kategori</option>
              {kategoriOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </Select>
            {errors.kategori && <p className="text-[11px] text-red-500">{errors.kategori.message}</p>}
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-gray-700">Lokasi</label>
          <Input placeholder="Jl. Melati RT 02/RW 05" {...register('lokasi')} />
          {errors.lokasi && <p className="text-[11px] text-red-500">{errors.lokasi.message}</p>}
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-gray-700">Deskripsi</label>
          <Textarea placeholder="Jelaskan masalah Anda secara detail..." rows={3} {...register('deskripsi')} />
          {errors.deskripsi && <p className="text-[11px] text-red-500">{errors.deskripsi.message}</p>}
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-gray-700">Foto <span className="font-normal text-gray-400">(opsional, maks. 3)</span></label>
          <div className="flex flex-wrap gap-2">
            {photos.map((photo, index) => (
              <div key={index} className="relative group">
                <div className="w-20 h-20 rounded-lg overflow-hidden border border-gray-100 shadow-sm">
                  <img src={photo.preview} alt="" className="w-full h-full object-cover" />
                </div>
                <button
                  type="button"
                  onClick={() => removePhoto(index)}
                  className="absolute -top-1.5 -right-1.5 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
            {photos.length < 3 && (
              <div className="relative">
                <button
                  type="button"
                  className="w-20 h-20 rounded-lg border-2 border-dashed border-gray-200 flex flex-col items-center justify-center text-gray-400 hover:border-primary/40 hover:text-primary/60 transition-colors"
                >
                  <Upload className="w-4 h-4" />
                  <span className="text-[10px] mt-0.5 font-medium">Upload</span>
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

        <Button type="submit" className="w-full shadow-md shadow-primary/20" disabled={isSubmitting}>
          {isSubmitting ? 'Mengirim...' : 'Kirim Pengaduan'}
        </Button>
      </form>
    </div>
  )
}
