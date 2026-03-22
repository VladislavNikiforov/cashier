import { Calendar, Moon, Sun } from 'lucide-react'

const MONTHS_SHORT = ['Янв','Фев','Мар','Апр','Май','Июн','Июл','Авг','Сен','Окт','Ноя','Дек']

export default function DatePickerSheet({ open, date, onSelect, onClose }) {
  if (!open) return null

  const today = new Date().toISOString().slice(0, 10)
  const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10)

  const todayDate = new Date()
  const yesterdayDate = new Date(Date.now() - 86400000)

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center" onClick={onClose}>
      <div className="absolute inset-0 bg-black/40" />
      <div className="relative w-full max-w-[480px] rounded-t-2xl p-5 pb-8"
        style={{ background: 'var(--bg-secondary)' }}
        onClick={e => e.stopPropagation()}>

        <div className="text-center text-sm font-semibold mb-4">Дата</div>

        {/* Select day */}
        <button onClick={() => {
            const input = document.createElement('input')
            input.type = 'date'
            input.value = date
            input.style.position = 'fixed'
            input.style.opacity = '0'
            document.body.appendChild(input)
            input.addEventListener('change', (e) => {
              onSelect(e.target.value)
              input.remove()
            })
            input.showPicker?.()
            setTimeout(() => input.remove(), 10000)
          }}
          className="w-full p-4 rounded-xl flex flex-col items-center gap-2 mb-3"
          style={{ background: 'var(--bg-card)' }}>
          <Calendar size={24} className="text-[var(--text-secondary)]" />
          <span className="text-sm">Выбрать день</span>
        </button>

        {/* Quick picks */}
        <div className="grid grid-cols-2 gap-3 mb-3">
          <button onClick={() => onSelect(yesterday)}
            className={`p-4 rounded-xl flex flex-col items-center gap-2 ${date === yesterday ? 'ring-2 ring-[var(--accent)]' : ''}`}
            style={{ background: 'var(--bg-card)' }}>
            <Moon size={22} className="text-[var(--text-secondary)]" />
            <div className="text-sm font-medium">Вчера</div>
            <div className="text-xs text-[var(--text-secondary)]">{yesterdayDate.getDate()} {MONTHS_SHORT[yesterdayDate.getMonth()]}</div>
          </button>

          <button onClick={() => onSelect(today)}
            className={`p-4 rounded-xl flex flex-col items-center gap-2 ${date === today ? 'ring-2 ring-[var(--accent)]' : ''}`}
            style={{ background: 'var(--bg-card)' }}>
            <Sun size={22} className="text-[var(--text-secondary)]" />
            <div className="text-sm font-medium">Сегодня</div>
            <div className="text-xs text-[var(--text-secondary)]">{todayDate.getDate()} {MONTHS_SHORT[todayDate.getMonth()]}</div>
          </button>
        </div>
      </div>
    </div>
  )
}
