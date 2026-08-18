import { useCallback } from 'react'
import { Upload, X } from 'lucide-react'

export default function InfoImageUpload({ photos, setPhotos, maxPhotos = 5 }) {
  const handleUpload = useCallback((e) => {
    const files = Array.from(e.target.files)
    if (files.length === 0) return

    setPhotos((prev) => {
      if (prev.length + files.length > maxPhotos) {
        alert(`Maksimal ${maxPhotos} foto`)
        return prev
      }
      const newPhotos = files.map((file) => ({
        file,
        preview: URL.createObjectURL(file),
      }))
      return [...prev, ...newPhotos]
    })

    e.target.value = ''
  }, [maxPhotos, setPhotos])

  const removePhoto = (index) => {
    setPhotos((prev) => {
      const updated = [...prev]
      URL.revokeObjectURL(updated[index].preview)
      updated.splice(index, 1)
      return updated
    })
  }

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-gray-700">
        Foto (Opsional, maks. {maxPhotos})
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
        {photos.length < maxPhotos && (
          <div className="relative">
            <button
              type="button"
              className="w-24 h-24 rounded-lg border-2 border-dashed border-gray-300 hover:border-primary flex flex-col items-center justify-center cursor-pointer transition-colors"
            >
              <Upload className="w-6 h-6 text-gray-400" />
              <span className="text-xs text-gray-400 mt-1">Upload</span>
            </button>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleUpload}
              style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer' }}
            />
          </div>
        )}
      </div>
    </div>
  )
}
