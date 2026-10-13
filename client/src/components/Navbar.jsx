import { LogOut } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

function Navbar() {
  const { isAuthenticated, logout, user } = useAuth()

  return (
    <header className="border-b border-gray-200 bg-white">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link
          className="text-xl font-bold tracking-tight text-indigo-600"
          to="/"
        >
          Trackr
        </Link>
        {isAuthenticated && (
          <div className="flex items-center gap-3 sm:gap-5">
            <span className="max-w-32 truncate text-sm font-medium text-gray-700 sm:max-w-none">
              {user?.name || 'Your account'}
            </span>
            <button
              className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-gray-600 transition hover:bg-gray-100 hover:text-gray-900"
              onClick={logout}
              type="button"
            >
              <LogOut aria-hidden="true" size={16} />
              <span>Log out</span>
            </button>
          </div>
        )}
      </nav>
    </header>
  )
}

export default Navbar
