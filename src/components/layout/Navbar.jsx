import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Megaphone, LogIn, LogOut, LayoutDashboard } from 'lucide-react'
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
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Megaphone className="w-5 h-5 text-white" />
            </div>
            <span className="font-semibold text-gray-900 hidden sm:block">
              RW Rowosari
            </span>
            <span className="font-semibold text-gray-900 sm:hidden">
              RW Rowosari
            </span>
          </Link>

          <div className="flex items-center gap-2">
            {isAdmin ? (
              <>
                <Link to="/admin/dashboard">
                  <Button variant="ghost" size="sm">
                    <LayoutDashboard className="w-4 h-4 mr-2" />
                    Dashboard
                  </Button>
                </Link>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-red-500 hover:text-red-600 hover:bg-red-50"
                  onClick={handleLogout}
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </Button>
              </>
            ) : (
              <Link to="/admin/login">
                <Button variant="outline" size="sm">
                  <LogIn className="w-4 h-4 mr-2" />
                  Login Admin
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
