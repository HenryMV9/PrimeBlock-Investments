import { ReactNode, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import {
  LayoutDashboard,
  Wallet,
  ArrowDownToLine,
  ArrowUpFromLine,
  FileText,
  BarChart3,
  Users,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronRight,
} from 'lucide-react'

interface LayoutProps {
  children: ReactNode
}

const userNavItems = [
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/account', label: 'Account Summary', icon: Wallet },
  { path: '/transactions', label: 'Transactions', icon: FileText },
  { path: '/deposit', label: 'Deposit', icon: ArrowDownToLine },
  { path: '/withdraw', label: 'Withdraw', icon: ArrowUpFromLine },
  { path: '/market', label: 'Market Overview', icon: BarChart3 },
]

const adminNavItems = [
  { path: '/admin', label: 'Admin Panel', icon: Settings },
  { path: '/admin/users', label: 'Manage Users', icon: Users },
]

export default function Layout({ children }: LayoutProps) {
  const { profile, signOut } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const handleSignOut = async () => {
    await signOut()
    navigate('/')
  }

  const navItems = profile?.is_admin
    ? [...userNavItems, ...adminNavItems]
    : userNavItems

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-slate-800 rounded-lg text-white"
      >
        {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-slate-900/95 backdrop-blur-xl border-r border-slate-700/50 transform transition-transform duration-300 lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="p-6 border-b border-slate-700/50">
            <Link to="/dashboard" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-accent-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-lg">PB</span>
              </div>
              <div>
                <h1 className="text-white font-semibold text-lg">Prime Blocks</h1>
                <p className="text-slate-400 text-xs">Investments</p>
              </div>
            </Link>
          </div>

          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path
              const Icon = item.icon
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                    isActive
                      ? 'bg-gradient-to-r from-primary-600/20 to-accent-600/20 text-white border border-primary-500/30'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                  }`}
                >
                  <Icon size={20} className={isActive ? 'text-primary-400' : ''} />
                  <span className="font-medium">{item.label}</span>
                  {isActive && (
                    <ChevronRight size={16} className="ml-auto text-primary-400" />
                  )}
                </Link>
              )
            })}
          </nav>

          <div className="p-4 border-t border-slate-700/50">
            <div className="p-4 bg-slate-800/50 rounded-xl mb-4">
              <p className="text-slate-400 text-sm">Logged in as</p>
              <p className="text-white font-medium truncate">{profile?.full_name || profile?.email}</p>
              {profile?.is_admin && (
                <span className="inline-block mt-2 px-2 py-1 bg-accent-600/20 text-accent-400 text-xs rounded-full">
                  Administrator
                </span>
              )}
            </div>
            <button
              onClick={handleSignOut}
              className="flex items-center gap-3 w-full px-4 py-3 text-slate-400 hover:text-white hover:bg-slate-800/50 rounded-xl transition-all duration-200"
            >
              <LogOut size={20} />
              <span className="font-medium">Sign Out</span>
            </button>
          </div>
        </div>
      </aside>

      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <main className="lg:ml-64 min-h-screen">
        <div className="p-4 lg:p-8">{children}</div>
      </main>
    </div>
  )
}
