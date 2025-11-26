import { NavLink } from 'react-router-dom'

const menuItems = [
  { label: 'Dashboard', to: '/dashboard', icon: '🏠' },
  { label: 'Expenses', to: '/expense/add', icon: '🧾' },
  { label: 'Settings', to: '/profile', icon: '⚙️' },
  { label: 'Help', to: '/help', icon: '❓' },
]

const Sidebar = ({ className = '', onItemClick }) => (
  <aside className={`w-full bg-white border-b border-slate-200 md:w-64 md:min-h-screen md:border-r md:border-b-0 ${className}`}>
    <nav className="space-y-1 px-6 pb-6 pt-6 md:pt-8">
      {menuItems.map((item) => (
        <NavLink
          key={item.label}
          to={item.to}
          end={item.to === '/dashboard'}
          className={({ isActive }) =>
            `flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition-colors ${
              isActive
                ? 'bg-slate-900 text-white shadow-lg'
                : 'text-slate-600 hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-cyan-500 hover:via-blue-500 hover:to-purple-600'
            }`
          }
          onClick={() => onItemClick?.()}
        >
          <span className="text-lg">{item.icon}</span>
          <span>{item.label}</span>
        </NavLink>
      ))}
    </nav>
  </aside>
)

export default Sidebar
