import { useState } from 'react'

export default function FileUploadTest() {
  const [files, setFiles] = useState([])

  return (
    <div className="p-8 space-y-4">
      <h1 className="text-xl font-bold">File Upload Test</h1>

      <div className="space-y-2">
        <p className="text-sm text-gray-600">Test 1: Plain input</p>
        <input type="file" accept="image/*" multiple onChange={(e) => console.log('Test 1:', e.target.files)} />
      </div>

      <div className="space-y-2">
        <p className="text-sm text-gray-600">Test 2: Button + ref + rAF delay</p>
        <TestButton />
      </div>

      <div className="space-y-2">
        <p className="text-sm text-gray-600">Test 3: Form with plain input</p>
        <form onSubmit={(e) => e.preventDefault()}>
          <input type="file" accept="image/*" multiple onChange={(e) => console.log('Test 3:', e.target.files)} />
        </form>
      </div>
    </div>
  )
}

function TestButton() {
  const [ref, setRef] = useState(null)

  return (
    <div>
      <button
        type="button"
        onClick={() => {
          if (ref) {
            requestAnimationFrame(() => ref.click())
          }
        }}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Click to upload
      </button>
      <input
        ref={(el) => setRef(el)}
        type="file"
        accept="image/*"
        multiple
        onChange={(e) => console.log('Test 2:', e.target.files)}
        style={{ display: 'none' }}
      />
    </div>
  )
}
