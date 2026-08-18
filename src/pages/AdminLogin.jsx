import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { supabase } from '@/lib/supabase'

export default function AdminLogin() {
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      const { data, error: rpcError } = await supabase.rpc('verify_admin_login', {
        input_username: username,
        input_password: password,
      })

      if (rpcError || !data) {
        setError('Username atau password salah')
        setIsLoading(false)
        return
      }

      localStorage.setItem('isAdmin', 'true')
      localStorage.setItem('adminUser', username)
      navigate('/admin/dashboard')
    } catch (err) {
      console.error('Login error:', err)
      setError('Terjadi kesalahan.')
    }

    setIsLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface px-4">
      <div className="w-full max-w-xs">
        <h1 className="text-lg font-semibold text-gray-900 text-center mb-1">Admin</h1>
        <p className="text-xs text-gray-400 text-center mb-6">Masuk ke dashboard pengelola</p>

        <Card>
          <CardContent className="p-5">
            <form onSubmit={handleLogin} className="space-y-3">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 text-xs rounded px-3 py-2">
                  {error}
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-gray-600">Username</label>
                <Input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-gray-600">Password</label>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <Button type="submit" className="w-full" size="sm" disabled={isLoading}>
                {isLoading ? 'Masuk...' : 'Masuk'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
