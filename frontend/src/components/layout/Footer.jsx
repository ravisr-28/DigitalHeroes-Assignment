export default function Footer() {
  return (
    <footer className="bg-[#080d19] border-t border-white/5 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-green-500/20 rounded flex items-center justify-center">
              <span className="text-green-500 font-black text-[10px]">GCC</span>
            </div>
            <span className="text-gray-300 font-bold tracking-tight">
              Golf<span className="text-green-500/80">Charity Club</span>
            </span>
          </div>
          
          <div className="flex gap-8 text-xs font-medium text-gray-500">
            <a href="#" className="hover:text-green-500 transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-green-500 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-green-500 transition-colors">Cookie Policy</a>
          </div>
          
          <p className="text-[10px] text-gray-600 font-medium tracking-wider uppercase bg-white/5 px-3 py-1 rounded-full">
            &copy; {new Date().getFullYear()} Golf Charity Club — Impactful Competition
          </p>
        </div>
      </div>
    </footer>
  );
}
