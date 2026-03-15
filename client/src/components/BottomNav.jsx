import { NavLink } from 'react-router-dom'
import { PieChart, ArrowLeftRight, Wallet, Settings } from 'lucide-react'

const tabs = [
  { to: '/', icon: PieChart, label: 'Categories' },
  { to: '/transactions', icon: ArrowLeftRight, label: 'Transactions' },
  { to: '/accounts', icon: Wallet, label: 'Accounts' },
  { to: '/settings', icon: Settings, label: 'Settings' },
]

export default function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] flex justify-around items-center py-2 pb-[max(0.5rem,env(safe-area-inset-bottom))]"
      style={{ background: 'var(--bg-secondary)', borderTop: '1px solid var(--border)' }}>
      {tabs.map(({ to, icon: Icon, label }) => (
        <NavLink key={to} to={to} end={to === '/'}
          className={({ isActive }) =>
            `flex flex-col items-center gap-0.5 px-3 py-1 text-xs transition-colors ${isActive ? 'text-[var(--accent)]' : 'text-[var(--text-secondary)]'}`
          }>
          <Icon size={22} />
          <span>{label}</span>
        </NavLink>
      ))}
    </nav>
  )
}
