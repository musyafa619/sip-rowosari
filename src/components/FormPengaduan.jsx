import { useState, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Send, Upload, X, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
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

export default function FormPengaduan() {
  const [photos, setPhotos] = useState([])
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const fileInputRef = useRef(null)

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

  const handlePhotoUpload = (e) => {
    const files = Array.from(e.target.files)
    if (photos.length + files.length > 3) {
      alert('Maksimal 3 foto')
      return
    }

    const newPhotos = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }))

    setPhotos((prev) => [...prev, ...newPhotos])
  }

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

      const { data, error } = await supabase.storage
        .from('complaint-photos')
        .upload(filePath, photo.file)

      if (error) {
        console.error('Upload error:', error)
        throw error
      }

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
      setTimeout(() => setIsSubmitted(false), 5000)
    } catch (err) {
      console.error('Submit error:', err)
      setSubmitError('Gagal mengirim pengaduan. Silakan coba lagi.')
    }
  }

  if (isSubmitted) {
    return (
      <Card className="border-primary/20 bg-primary-light/30">
        <CardContent className="pt-6">
          <div className="flex flex-col items-center gap-4 text-center py-8">
            <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center">
              <CheckCircle className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900">
              Pengaduan Berhasil Dikirim!
            </h3>
            <p className="text-gray-600 max-w-md">
              Terima kasih atas laporan Anda. Pengaduan akan segera ditindaklanjuti oleh pengurus RW Rowosari.
            </p>
            <Button onClick={() => setIsSubmitted(false)} variant="outline">
              Kirim Pengaduan Baru
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Send className="w-5 h-5 text-primary" />
          Form Pengaduan
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {submitError && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg px-4 py-3">
              {submitError}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Judul Pengaduan <span className="text-red-500">*</span>
              </label>
              <Input
                placeholder="Contoh: Sampah menumpuk di Jl. Melati"
                {...register('judul')}
              />
              {errors.judul && (
                <p className="text-sm text-red-500">{errors.judul.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Nama Pelapor <span className="text-red-500">*</span>
              </label>
              <Input
                placeholder="Nama lengkap Anda"
                {...register('nama_pelapor')}
              />
              {errors.nama_pelapor && (
                <p className="text-sm text-red-500">{errors.nama_pelapor.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Tanggal Laporan <span className="text-red-500">*</span>
              </label>
              <Input
                type="date"
                {...register('tanggal_laporan')}
              />
              {errors.tanggal_laporan && (
                <p className="text-sm text-red-500">{errors.tanggal_laporan.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Kategori <span className="text-red-500">*</span>
              </label>
              <Select {...register('kategori')}>
                <option value="">Pilih kategori</option>
                {kategoriOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </Select>
              {errors.kategori && (
                <p className="text-sm text-red-500">{errors.kategori.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Lokasi Kejadian <span className="text-red-500">*</span>
            </label>
            <Input
              placeholder="Contoh: Jl. Melati RT 02/RW 05"
              {...register('lokasi')}
            />
            {errors.lokasi && (
              <p className="text-sm text-red-500">{errors.lokasi.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Deskripsi <span className="text-red-500">*</span>
            </label>
            <Textarea
              placeholder="Jelaskan secara detail pengaduan Anda..."
              rows={4}
              {...register('deskripsi')}
            />
            {errors.deskripsi && (
              <p className="text-sm text-red-500">{errors.deskripsi.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Foto (Opsional, maks. 3)
            </label>
            <div className="flex flex-wrap gap-3">
              {photos.map((photo, index) => (
                <div key={index} className="relative group">
                  <div className="w-24 h-24 rounded-lg overflow-hidden border border-gray-200">
                    <img
                      src={photo.preview}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => removePhoto(index)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
              {photos.length < 3 && (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-24 h-24 rounded-lg border-2 border-dashed border-gray-300 hover:border-primary flex flex-col items-center justify-center cursor-pointer transition-colors"
                >
                  <Upload className="w-6 h-6 text-gray-400" />
                  <span className="text-xs text-gray-400 mt-1">Upload</span>
                </button>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={handlePhotoUpload}
              />
            </div>
          </div>

          <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                Mengirim...
              </>
            ) : (
              <>
                <Send className="w-4 h-4 mr-2" />
                Kirim Pengaduan
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
