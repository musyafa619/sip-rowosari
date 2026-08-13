import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  Calendar,
  MapPin,
  Tag,
  User,
  FileText,
  Save,
  CheckCircle,
  Image,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select } from '@/components/ui/select'
import StatusBadge from '@/components/StatusBadge'
import PhotoLightbox from '@/components/PhotoLightbox'
import { kategoriLabels, statusOptions } from '@/data/dummy'
import { formatDate } from '@/lib/utils'
import { supabase } from '@/lib/supabase'

export default function AdminDetail() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [complaint, setComplaint] = useState(null)
  const [loading, setLoading] = useState(true)
  const [status, setStatus] = useState('menunggu')
  const [isSaving, setIsSaving] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState(null)

  useEffect(() => {
    const isAdmin = localStorage.getItem('isAdmin') === 'true'
    if (!isAdmin) {
      navigate('/admin/login')
    }
  }, [navigate])

  useEffect(() => {
    const fetchComplaint = async () => {
      setLoading(true)
      const { data, error } = await supabase
        .from('complaints')
        .select('*')
        .eq('id', id)
        .single()

      if (error || !data) {
        setComplaint(null)
      } else {
        setComplaint(data)
        setStatus(data.status)
      }
      setLoading(false)
    }

    fetchComplaint()
  }, [id])

  const handleSave = async () => {
    setIsSaving(true)

    const { error } = await supabase
      .from('complaints')
      .update({ status })
      .eq('id', id)

    if (error) {
      console.error('Update error:', error)
    } else {
      setComplaint((prev) => ({ ...prev, status }))
      setShowSuccess(true)
      setTimeout(() => setShowSuccess(false), 3000)
    }

    setIsSaving(false)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    )
  }

  if (!complaint) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <div className="text-center">
          <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Pengaduan Tidak Ditemukan
          </h2>
          <p className="text-gray-500 mb-4">
            Pengaduan dengan ID tersebut tidak ada
          </p>
          <Button onClick={() => navigate('/admin/dashboard')}>
            Kembali ke Dashboard
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-surface">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Button
          variant="ghost"
          onClick={() => navigate('/admin/dashboard')}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Kembali ke Dashboard
        </Button>

        {showSuccess && (
          <div className="mb-6 bg-green-50 border border-green-200 text-green-700 rounded-lg px-4 py-3 flex items-center gap-2">
            <CheckCircle className="w-5 h-5" />
            Status berhasil diperbarui!
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <StatusBadge status={complaint.status} />
                  <span className="inline-flex items-center gap-1 text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                    <Tag className="w-3 h-3" />
                    {kategoriLabels[complaint.kategori]}
                  </span>
                </div>
                <CardTitle className="text-xl">{complaint.judul}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex items-start gap-3">
                    <User className="w-5 h-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-500">Nama Pelapor</p>
                      <p className="font-medium text-gray-900">
                        {complaint.nama_pelapor}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Calendar className="w-5 h-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-500">Tanggal Laporan</p>
                      <p className="font-medium text-gray-900">
                        {formatDate(complaint.tanggal_laporan)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-500">Lokasi Kejadian</p>
                      <p className="font-medium text-gray-900">
                        {complaint.lokasi}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <FileText className="w-5 h-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-500">ID Pengaduan</p>
                      <p className="font-mono text-sm text-gray-700">
                        {complaint.id.substring(0, 8)}...
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-2">
                    Deskripsi
                  </h4>
                  <p className="text-gray-700 whitespace-pre-wrap bg-gray-50 rounded-lg p-4">
                    {complaint.deskripsi}
                  </p>
                </div>

                {complaint.foto_urls && complaint.foto_urls.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-2">
                      Foto Pendukung
                    </h4>
                    <div className="flex flex-wrap gap-3">
                      {complaint.foto_urls.map((url, index) => (
                        <button
                          key={index}
                          onClick={() => setLightboxIndex(index)}
                          className="w-24 h-24 rounded-lg border border-gray-200 overflow-hidden hover:opacity-80 transition-opacity"
                        >
                          <img
                            src={url}
                            alt={`Foto ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div>
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle className="text-lg">Update Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Status Pengaduan
                  </label>
                  <Select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                  >
                    {statusOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </Select>
                </div>

                <Button
                  onClick={handleSave}
                  className="w-full"
                  disabled={isSaving || status === complaint.status}
                >
                  {isSaving ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                      Menyimpan...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Simpan Perubahan
                    </>
                  )}
                </Button>

                {status !== complaint.status && (
                  <p className="text-xs text-amber-600 bg-amber-50 rounded-lg p-3">
                    Status akan diubah dari{' '}
                    <strong>{complaint.status}</strong> menjadi{' '}
                    <strong>{status}</strong>
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {lightboxIndex !== null && complaint.foto_urls && (
        <PhotoLightbox
          photos={complaint.foto_urls}
          initialIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
        />
      )}
    </div>
  )
}
