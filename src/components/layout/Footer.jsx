export default function Footer() {
  return (
    <footer className="border-t border-gray-100 bg-white mt-auto">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 bg-gradient-to-br from-primary to-emerald-600 rounded flex items-center justify-center">
              <span className="text-white text-[8px] font-bold">RW</span>
            </div>
            <span className="text-xs font-semibold text-gray-500">Rowosari</span>
          </div>
          <p className="text-[11px] text-gray-400">
            &copy; {new Date().getFullYear()}
          </p>
        </div>
      </div>
    </footer>
  )
}
