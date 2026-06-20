import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Film, Menu, X, Moon, Sun } from 'lucide-react'
import { useState, useEffect } from 'react'

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth()
  const location = useLocation()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isDark, setIsDark] = useState(true)

  useEffect(() => {
    const theme = localStorage.getItem('theme')
    if (theme === 'light') {
      setIsDark(false)
      document.documentElement.classList.remove('dark')
    } else {
      setIsDark(true)
      document.documentElement.classList.add('dark')
    }
  }, [])

  const toggleDark = () => {
    setIsDark(!isDark)
    document.documentElement.classList.toggle('dark')
    localStorage.setItem('theme', isDark ? 'light' : 'dark')
  }

  const navLinks = isAuthenticated
    ? [
        { name: 'Dashboard', path: '/dashboard' },
        { name: 'Generate', path: '/generate' },
        { name: 'History', path: '/history' },
        { name: 'Profile', path: '/profile' },
        ...(user?.isAdmin ? [{ name: 'Admin', path: '/admin' }] : []),
      ]
    : [{ name: 'Home', path: '/' }, { name: 'Features', path: '#features' }, { name: 'Pricing', path: '#pricing' }]

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-gray-950/80 backdrop-blur-xl border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to={isAuthenticated ? '/dashboard' : '/'} className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-violet-600 to-indigo-600 rounded-xl flex items-center justify-center glow">
              <Film className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-gradient">AliveFrame AI</span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-sm font-medium transition-colors ${
                  location.pathname === link.path
                    ? 'text-violet-400'
                    : 'text-gray-300 hover:text-violet-400'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <button onClick={toggleDark} className="p-2 rounded-lg hover:bg-white/5 border border-white/10">
              {isDark ? <Sun className="w-5 h-5 text-violet-400" /> : <Moon className="w-5 h-5 text-gray-300" />}
            </button>

            {isAuthenticated ? (
              <div className="flex items-center gap-4">
                <div className="hidden md:flex items-center gap-2 bg-violet-500/10 border border-violet-500/20 px-3 py-1.5 rounded-full">
                  <Film className="w-4 h-4 text-violet-400" />
                  <span className="text-sm font-semibold text-violet-400">{user?.credits} Credits</span>
                </div>
                <button onClick={logout} className="text-sm font-medium text-gray-300 hover:text-violet-400">
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link to="/login" className="text-sm font-medium text-gray-300 hover:text-violet-400">
                  Login
                </Link>
                <Link to="/register" className="btn-primary !py-2 !px-4 text-sm">
                  Get Started
                </Link>
              </div>
            )}

            <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <div className="md:hidden bg-gray-950/95 backdrop-blur-xl border-b border-white/10">
          <div className="px-4 py-4 space-y-3">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsMenuOpen(false)}
                className="block text-sm font-medium text-gray-300 hover:text-violet-400"
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  )
}

export default Navbar
