import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import Landing from '@/pages/Landing'
import InfoDetail from '@/pages/InfoDetail'
import AdminLogin from '@/pages/AdminLogin'
import AdminDashboard from '@/pages/AdminDashboard'
import AdminPengaduan from '@/pages/AdminPengaduan'
import AdminDetail from '@/pages/AdminDetail'
import AdminInfoCenter from '@/pages/AdminInfoCenter'
import AdminInfoForm from '@/pages/AdminInfoForm'
import FileUploadTest from '@/pages/FileUploadTest'

export default function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/test-upload" element={<FileUploadTest />} />
            <Route path="/informasi/:id" element={<InfoDetail />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/pengaduan" element={<AdminPengaduan />} />
            <Route path="/admin/detail/:id" element={<AdminDetail />} />
            <Route path="/admin/informasi" element={<AdminInfoCenter />} />
            <Route path="/admin/informasi/baru" element={<AdminInfoForm />} />
            <Route path="/admin/informasi/edit/:id" element={<AdminInfoForm />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  )
}
