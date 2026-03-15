import { User, Download, Upload, LogOut, ChevronRight } from 'lucide-react'

function SettingsItem({ icon: Icon, label, onClick, danger }) {
  return (
    <button onClick={onClick}
      className={`flex items-center gap-3 w-full p-4 rounded-xl text-left ${danger ? 'text-[var(--danger)]' : ''}`}
      style={{ background: 'var(--bg-card)' }}>
      <Icon size={20} />
      <span className="flex-1 text-sm">{label}</span>
      <ChevronRight size={16} className="text-[var(--text-secondary)]" />
    </button>
  )
}

export default function SettingsPage() {
  return (
    <div className="flex flex-col flex-1 px-4 pt-4 pb-20">
      <h1 className="text-lg font-semibold mb-4">Настройки</h1>

      {/* User card */}
      <div className="flex items-center gap-3 p-4 rounded-2xl mb-4" style={{ background: 'var(--bg-card)' }}>
        <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ background: 'var(--accent)' }}>
          <User size={24} color="white" />
        </div>
        <div>
          <div className="text-sm font-medium">Demo User</div>
          <div className="text-xs text-[var(--text-secondary)]">demo@example.com</div>
        </div>
      </div>

      {/* Settings list */}
      <div className="flex flex-col gap-2">
        <SettingsItem icon={Download} label="Экспорт в Excel" onClick={() => {}} />
        <SettingsItem icon={Upload} label="Импорт данных" onClick={() => {}} />
        <div className="h-2" />
        <SettingsItem icon={LogOut} label="Выйти" onClick={() => {}} danger />
      </div>
    </div>
  )
}
