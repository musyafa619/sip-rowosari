import { Link, useLocation, useNavigate } from 'react-router-dom'
import { LogIn, LogOut, LayoutDashboard } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function Navbar() {
  const location = useLocation()
  const navigate = useNavigate()
  const isAdmin = location.pathname.startsWith('/admin')
  const isLogin = location.pathname === '/admin/login'

  const handleLogout = () => {
    localStorage.removeItem('isAdmin')
    localStorage.removeItem('adminUser')
    navigate('/admin/login')
  }

  return (
    <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-14">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-emerald-600 rounded-lg flex items-center justify-center shadow-sm shadow-primary/20 group-hover:shadow-md group-hover:shadow-primary/30 transition-shadow">
              <span className="text-white text-[11px] font-bold tracking-tight">RW</span>
            </div>
            <span className="font-bold text-gray-900 text-sm tracking-tight">
              Rowosari
            </span>
          </Link>

          <div className="flex items-center gap-1">
            {isAdmin && !isLogin ? (
              <>
                <Link to="/admin/dashboard">
                  <Button variant="ghost" size="sm" className="text-xs font-medium">
                    <LayoutDashboard className="w-3.5 h-3.5 mr-1.5" />
                    Dashboard
                  </Button>
                </Link>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-xs font-medium text-gray-400 hover:text-red-500"
                  onClick={handleLogout}
                >
                  <LogOut className="w-3.5 h-3.5 mr-1.5" />
                  Keluar
                </Button>
              </>
            ) : !isAdmin ? (
              <Link to="/admin/login">
                <Button variant="ghost" size="sm" className="text-xs font-medium text-gray-400">
                  <LogIn className="w-3.5 h-3.5 mr-1.5" />
                  Admin
                </Button>
              </Link>
            ) : null}
          </div>
        </div>
      </div>
    </nav>
  )
}
