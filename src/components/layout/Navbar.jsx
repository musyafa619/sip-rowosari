import { Link, useLocation, useNavigate } from 'react-router-dom'
import { LogIn, LogOut, LayoutDashboard } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function Navbar() {
  const location = useLocation()
  const navigate = useNavigate()
  const isAdmin = location.pathname.startsWith('/admin')

  const handleLogout = () => {
    localStorage.removeItem('isAdmin')
    localStorage.removeItem('adminUser')
    navigate('/admin/login')
  }

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-200">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-14">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-7 h-7 bg-primary rounded flex items-center justify-center">
              <span className="text-white text-xs font-bold">RW</span>
            </div>
            <span className="font-semibold text-gray-900 text-sm tracking-tight">
              RW Rowosari
            </span>
          </Link>

          <div className="flex items-center gap-1.5">
            {isAdmin ? (
              <>
                <Link to="/admin/dashboard">
                  <Button variant="ghost" size="sm" className="text-xs">
                    <LayoutDashboard className="w-3.5 h-3.5 mr-1.5" />
                    Dashboard
                  </Button>
                </Link>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-xs text-gray-500 hover:text-red-600"
                  onClick={handleLogout}
                >
                  <LogOut className="w-3.5 h-3.5 mr-1.5" />
                  Keluar
                </Button>
              </>
            ) : (
              <Link to="/admin/login">
                <Button variant="ghost" size="sm" className="text-xs text-gray-500">
                  <LogIn className="w-3.5 h-3.5 mr-1.5" />
                  Admin
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
