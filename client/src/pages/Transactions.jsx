import { useState } from 'react'
import { ChevronLeft, ChevronRight, Search, SlidersHorizontal } from 'lucide-react'

const MONTHS = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь']

const demoTransactions = [
  { id: 1, date: '2026-03-15', category: 'Кафе', icon: '☕', account: 'Карта', amount: -9.56, note: 'Лидо церковь', currency: 'EUR' },
  { id: 2, date: '2026-03-15', category: 'Продукты', icon: '🛒', account: 'Карта', amount: -1.99, note: 'Вода, бананы', currency: 'EUR' },
  { id: 3, date: '2026-03-15', category: 'Кафе', icon: '☕', account: 'Карта', amount: -7.40, note: 'Кофе, пирожные', currency: 'EUR' },
  { id: 4, date: '2026-03-14', category: 'Продукты', icon: '🛒', account: 'Карта', amount: -1.45, note: 'Вода', currency: 'EUR' },
  { id: 5, date: '2026-03-14', category: 'Bad Досуг', icon: '🍺', account: 'Карта', amount: -6.25, note: 'Мб го', currency: 'EUR' },
  { id: 6, date: '2026-03-13', category: 'Good досуг', icon: '🎬', account: 'Карта', amount: -8.00, note: 'Zakroyyy билет', currency: 'EUR' },
  { id: 7, date: '2026-03-13', category: 'Путешествия', icon: '✈️', account: 'Карта', amount: -16.47, note: 'РигаВильнюсРига', currency: 'EUR' },
  { id: 8, date: '2026-03-12', category: 'Кафе', icon: '☕', account: 'Карта', amount: -8.50, note: 'Кебаб фактори', currency: 'EUR' },
]

function groupByDate(txns) {
  const groups = {}
  for (const tx of txns) {
    if (!groups[tx.date]) groups[tx.date] = []
    groups[tx.date].push(tx)
  }
  return Object.entries(groups).sort(([a], [b]) => b.localeCompare(a))
}

function formatDate(dateStr) {
  const d = new Date(dateStr + 'T00:00:00')
  const day = d.getDate()
  const weekday = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'][d.getDay()]
  const month = MONTHS[d.getMonth()]
  return `${day} ${month}, ${weekday}`
}

export default function Transactions() {
  const [month, setMonth] = useState(() => new Date().getMonth())
  const [year, setYear] = useState(() => new Date().getFullYear())

  const prevMonth = () => { if (month === 0) { setMonth(11); setYear(y => y - 1) } else setMonth(m => m - 1) }
  const nextMonth = () => { if (month === 11) { setMonth(0); setYear(y => y + 1) } else setMonth(m => m + 1) }

  const grouped = groupByDate(demoTransactions)

  return (
    <div className="flex flex-col flex-1 px-4 pt-4 pb-20">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <h1 className="text-lg font-semibold">Транзакции</h1>
        <div className="flex gap-2">
          <button className="p-2 rounded-lg text-[var(--text-secondary)]"><Search size={20} /></button>
          <button className="p-2 rounded-lg text-[var(--text-secondary)]"><SlidersHorizontal size={20} /></button>
        </div>
      </div>

      {/* Month selector */}
      <div className="flex items-center justify-between mb-4 py-2 px-3 rounded-xl" style={{ background: 'var(--bg-card)' }}>
        <button onClick={prevMonth} className="p-1 text-[var(--text-secondary)]"><ChevronLeft size={20} /></button>
        <span className="text-sm font-medium">{MONTHS[month]} {year}</span>
        <button onClick={nextMonth} className="p-1 text-[var(--text-secondary)]"><ChevronRight size={20} /></button>
      </div>

      {/* Transaction groups */}
      <div className="flex flex-col gap-4">
        {grouped.map(([date, txns]) => {
          const dayTotal = txns.reduce((s, t) => s + t.amount, 0)
          return (
            <div key={date}>
              <div className="flex items-center justify-between mb-2 px-1">
                <span className="text-xs font-medium text-[var(--text-secondary)]">{formatDate(date)}</span>
                <span className="text-xs font-medium text-[var(--danger)]">{dayTotal.toFixed(2)} €</span>
              </div>
              <div className="flex flex-col gap-1.5">
                {txns.map(tx => (
                  <div key={tx.id} className="flex items-center gap-3 p-3 rounded-xl" style={{ background: 'var(--bg-card)' }}>
                    <div className="w-10 h-10 rounded-full flex items-center justify-center text-lg" style={{ background: 'var(--bg-input)' }}>
                      {tx.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium">{tx.category}</div>
                      <div className="text-xs text-[var(--text-secondary)] truncate">{tx.account} · {tx.note}</div>
                    </div>
                    <div className={`text-sm font-medium ${tx.amount < 0 ? 'text-[var(--danger)]' : 'text-[var(--success)]'}`}>
                      {tx.amount > 0 ? '+' : ''}{tx.amount.toFixed(2)} €
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
