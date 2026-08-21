import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Save, CheckCircle, FileText } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
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
    if (!isAdmin) navigate('/admin/login')
  }, [navigate])

  useEffect(() => {
    const fetchComplaint = async () => {
      setLoading(true)
      const { data } = await supabase.from('complaints').select('*').eq('id', id).single()
      if (!data) { setComplaint(null) } else { setComplaint(data); setStatus(data.status) }
      setLoading(false)
    }
    fetchComplaint()
  }, [id])

  const handleSave = async () => {
    setIsSaving(true)
    const { error } = await supabase.from('complaints').update({ status }).eq('id', id)
    if (!error) {
      setComplaint((prev) => ({ ...prev, status }))
      setShowSuccess(true)
      setTimeout(() => setShowSuccess(false), 3000)
    }
    setIsSaving(false)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface">
        <div className="w-5 h-5 border-2 border-gray-200 border-t-primary rounded-full animate-spin" />
      </div>
    )
  }

  if (!complaint) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface">
        <div className="text-center">
          <FileText className="w-10 h-10 text-gray-300 mx-auto mb-3" />
          <p className="text-sm text-gray-500 mb-3">Pengaduan tidak ditemukan</p>
          <Button size="sm" onClick={() => navigate('/admin/pengaduan')}>Kembali</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-surface">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6">
        <Button variant="ghost" size="sm" onClick={() => navigate('/admin/pengaduan')} className="mb-4 -ml-2 text-xs font-medium">
          <ArrowLeft className="w-3.5 h-3.5 mr-1" />
          Kembali
        </Button>

        {showSuccess && (
          <div className="mb-4 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs rounded-lg px-3 py-2 flex items-center gap-1.5 font-medium">
            <CheckCircle className="w-3.5 h-3.5" />
            Status diperbarui
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2">
            <Card>
              <CardContent className="p-5 space-y-4">
                <div className="flex flex-wrap items-center gap-2">
                  <StatusBadge status={complaint.status} />
                  <span className="text-[11px] text-gray-400 font-medium">{kategoriLabels[complaint.kategori]}</span>
                </div>

                <h1 className="text-base font-bold text-gray-900 leading-snug">{complaint.judul}</h1>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <p className="text-gray-400 font-medium mb-0.5">Pelapor</p>
                    <p className="text-gray-800 font-semibold">{complaint.nama_pelapor}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 font-medium mb-0.5">Tanggal</p>
                    <p className="text-gray-800 font-semibold">{formatDate(complaint.tanggal_laporan)}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 font-medium mb-0.5">Lokasi</p>
                    <p className="text-gray-800 font-semibold">{complaint.lokasi}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 font-medium mb-0.5">ID</p>
                    <p className="text-gray-800 font-mono text-[11px]">{complaint.id.substring(0, 8)}</p>
                  </div>
                </div>

                <div>
                  <p className="text-xs text-gray-400 font-medium mb-1">Deskripsi</p>
                  <p className="text-sm text-gray-600 whitespace-pre-wrap bg-gray-50 rounded-lg p-3 leading-relaxed">
                    {complaint.deskripsi}
                  </p>
                </div>

                {complaint.foto_urls?.length > 0 && (
                  <div>
                    <p className="text-xs text-gray-400 font-medium mb-1.5">Foto</p>
                    <div className="flex flex-wrap gap-2">
                      {complaint.foto_urls.map((url, index) => (
                        <button key={index} onClick={() => setLightboxIndex(index)}
                          className="w-20 h-20 rounded-lg overflow-hidden border border-gray-100 hover:border-gray-200 transition-colors">
                          <img src={url} alt="" className="w-full h-full object-cover" />
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div>
            <Card className="sticky top-20">
              <CardContent className="p-5 space-y-3">
                <p className="text-xs font-semibold text-gray-700">Update Status</p>
                <Select value={status} onChange={(e) => setStatus(e.target.value)}>
                  {statusOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </Select>
                <Button onClick={handleSave} className="w-full shadow-sm shadow-primary/20" size="sm"
                  disabled={isSaving || status === complaint.status}>
                  {isSaving ? 'Menyimpan...' : <><Save className="w-3.5 h-3.5 mr-1" />Simpan</>}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {lightboxIndex !== null && complaint.foto_urls && (
        <PhotoLightbox photos={complaint.foto_urls} initialIndex={lightboxIndex} onClose={() => setLightboxIndex(null)} />
      )}
    </div>
  )
}
