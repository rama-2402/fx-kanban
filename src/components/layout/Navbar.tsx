import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'

export default function Navbar() {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()

  function handleLogout() {
    signOut()
    navigate('/login', { replace: true })
  }

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `px-4 py-2 rounded-md text-sm font-medium transition-colors ${
      isActive
        ? 'text-indigo-400 bg-indigo-500/20 underline decoration-indigo-400 decoration-2 underline-offset-4'
        : 'text-slate-300 hover:text-white hover:bg-slate-700'
    }`

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between h-[60px] px-6"
      style={{ backgroundColor: '#1E293B' }}
    >
      <NavLink to="/dashboard" className="text-lg font-bold text-[#6366F1] hover:text-indigo-400 transition-colors">
        FX Design Tracker
      </NavLink>

      <div className="flex items-center gap-2">
        <NavLink to="/dashboard" end className={navLinkClass}>
          Dashboard
        </NavLink>
        <NavLink to="/submit" className={navLinkClass}>
          Submit Task
        </NavLink>
      </div>

      <div className="flex items-center gap-4">
        {user?.email && (
          <span className="text-sm text-slate-400 max-w-[200px] truncate" title={user.email}>
            {user.email}
          </span>
        )}
        <button
          type="button"
          onClick={handleLogout}
          className="px-3 py-1.5 text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-600 rounded-md transition-colors"
        >
          Logout
        </button>
      </div>
    </nav>
  )
}
