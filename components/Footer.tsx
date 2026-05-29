export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-[#1e1e1e] py-8 px-6">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <span className="font-mono text-xs text-gray-700">
          © {year} Alif Ardezir Zidane
        </span>
        <div className="flex items-center gap-6">
          <a
            href="https://github.com/alifsastro2"
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-xs text-gray-700 hover:text-[#06b6d4] transition-colors"
          >
            GitHub
          </a>
          <a
            href="https://www.linkedin.com/in/alif-ardezir-zidane-5a1b062b8"
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-xs text-gray-700 hover:text-[#06b6d4] transition-colors"
          >
            LinkedIn
          </a>
        </div>
        <span className="font-mono text-[10px] text-gray-800">
          Built with Next.js + Tailwind
        </span>
      </div>
    </footer>
  )
}
