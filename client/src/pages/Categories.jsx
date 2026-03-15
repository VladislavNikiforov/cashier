import { useState, useMemo } from 'react'
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts'
import { Plus, ChevronLeft, ChevronRight, TrendingDown, TrendingUp } from 'lucide-react'
import AddTransactionModal from '../components/AddTransactionModal'

const COLORS = ['#4f8cff', '#ff6b6b', '#ffd93d', '#6bcb77', '#a66cff', '#ff922b', '#20c997', '#e599f7', '#74c0fc', '#f783ac', '#ffe066', '#63e6be']

const MONTHS = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь']

const demoCategories = [
  { id: 1, name: 'Кафе', icon: '☕', amount: 156.30 },
  { id: 2, name: 'Продукты', icon: '🛒', amount: 89.45 },
  { id: 3, name: 'Транспорт', icon: '🚌', amount: 45.00 },
  { id: 4, name: 'Bad Досуг', icon: '🍺', amount: 72.80 },
  { id: 5, name: 'Подарки', icon: '🎁', amount: 54.88 },
  { id: 6, name: 'Инвестиции', icon: '📈', amount: 217.45 },
  { id: 7, name: 'Good досуг', icon: '🎬', amount: 36.00 },
  { id: 8, name: 'Путешествия', icon: '✈️', amount: 84.45 },
]

export default function Categories() {
  const [mode, setMode] = useState('expense')
  const [month, setMonth] = useState(() => new Date().getMonth())
  const [year, setYear] = useState(() => new Date().getFullYear())
  const [showModal, setShowModal] = useState(false)

  const total = useMemo(() => demoCategories.reduce((s, c) => s + c.amount, 0), [])

  const prevMonth = () => {
    if (month === 0) { setMonth(11); setYear(y => y - 1) }
    else setMonth(m => m - 1)
  }
  const nextMonth = () => {
    if (month === 11) { setMonth(0); setYear(y => y + 1) }
    else setMonth(m => m + 1)
  }

  return (
    <div className="flex flex-col flex-1 px-4 pt-4 pb-20">
      {/* Mode toggle */}
      <div className="flex gap-2 mb-4">
        <button onClick={() => setMode('expense')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-colors ${mode === 'expense' ? 'bg-[var(--accent)] text-white' : 'bg-[var(--bg-card)] text-[var(--text-secondary)]'}`}>
          <TrendingDown size={16} /> Расходы
        </button>
        <button onClick={() => setMode('income')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-colors ${mode === 'income' ? 'bg-[var(--success)] text-white' : 'bg-[var(--bg-card)] text-[var(--text-secondary)]'}`}>
          <TrendingUp size={16} /> Доходы
        </button>
      </div>

      {/* Month selector */}
      <div className="flex items-center justify-between mb-4">
        <button onClick={prevMonth} className="p-2 text-[var(--text-secondary)]"><ChevronLeft size={20} /></button>
        <span className="text-sm font-medium">{MONTHS[month]} {year}</span>
        <button onClick={nextMonth} className="p-2 text-[var(--text-secondary)]"><ChevronRight size={20} /></button>
      </div>

      {/* Donut chart */}
      <div className="relative mx-auto w-56 h-56 mb-6">
        <ResponsiveContainer>
          <PieChart>
            <Pie data={demoCategories} dataKey="amount" cx="50%" cy="50%"
              innerRadius={65} outerRadius={90} paddingAngle={2} strokeWidth={0}>
              {demoCategories.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-bold">{total.toFixed(2)}</span>
          <span className="text-xs text-[var(--text-secondary)]">EUR</span>
        </div>
      </div>

      {/* Category list */}
      <div className="flex flex-col gap-2">
        {demoCategories.map((cat, i) => (
          <div key={cat.id} className="flex items-center gap-3 p-3 rounded-xl" style={{ background: 'var(--bg-card)' }}>
            <div className="w-10 h-10 rounded-full flex items-center justify-center text-lg"
              style={{ background: COLORS[i % COLORS.length] + '22', border: `2px solid ${COLORS[i % COLORS.length]}` }}>
              {cat.icon}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium">{cat.name}</div>
              <div className="h-1.5 mt-1 rounded-full overflow-hidden" style={{ background: 'var(--bg-input)' }}>
                <div className="h-full rounded-full transition-all" style={{ width: `${(cat.amount / total * 100)}%`, background: COLORS[i % COLORS.length] }} />
              </div>
            </div>
            <div className="text-sm font-medium whitespace-nowrap">{cat.amount.toFixed(2)} €</div>
          </div>
        ))}
      </div>

      {/* FAB */}
      <button onClick={() => setShowModal(true)}
        className="fixed bottom-20 right-4 max-w-[480px]:right-auto w-14 h-14 rounded-full flex items-center justify-center shadow-lg"
        style={{ background: 'var(--accent)' }}>
        <Plus size={28} color="white" />
      </button>

      <AddTransactionModal open={showModal} onClose={() => setShowModal(false)} />
    </div>
  )
}
