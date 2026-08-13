import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import Landing from '@/pages/Landing'
import AdminLogin from '@/pages/AdminLogin'
import AdminDashboard from '@/pages/AdminDashboard'
import AdminDetail from '@/pages/AdminDetail'

export default function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/detail/:id" element={<AdminDetail />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  )
}
