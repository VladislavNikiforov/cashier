import { useState, useEffect, useMemo } from 'react'
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts'
import { Plus, ChevronLeft, ChevronRight, TrendingDown, TrendingUp } from 'lucide-react'
import AddTransactionModal from '../components/AddTransactionModal'
import { useData } from '../context/DataContext'

const COLORS = ['#4f8cff', '#ff6b6b', '#ffd93d', '#6bcb77', '#a66cff', '#ff922b', '#20c997', '#e599f7', '#74c0fc', '#f783ac', '#ffe066', '#63e6be']
const MONTHS = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь']

export default function Categories() {
  const { getSummaryForPeriod, loading } = useData()
  const [mode, setMode] = useState('expense')
  const [month, setMonth] = useState(() => new Date().getMonth())
  const [year, setYear] = useState(() => new Date().getFullYear())
  const [showModal, setShowModal] = useState(false)
  const [summary, setSummary] = useState([])

  const from = `${year}-${String(month + 1).padStart(2, '0')}-01`
  const to = `${year}-${String(month + 1).padStart(2, '0')}-${new Date(year, month + 1, 0).getDate()}`

  useEffect(() => {
    getSummaryForPeriod(from, to).then(setSummary)
  }, [from, to, getSummaryForPeriod, loading])

  const filtered = useMemo(() => summary.filter(s => s.type === mode), [summary, mode])
  const total = useMemo(() => filtered.reduce((s, c) => s + Math.abs(c.total), 0), [filtered])

  const prevMonth = () => {
    if (month === 0) { setMonth(11); setYear(y => y - 1) }
    else setMonth(m => m - 1)
  }
  const nextMonth = () => {
    if (month === 11) { setMonth(0); setYear(y => y + 1) }
    else setMonth(m => m + 1)
  }

  const chartData = filtered.map(c => ({ ...c, value: Math.abs(c.total) }))

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
        {chartData.length > 0 ? (
          <ResponsiveContainer>
            <PieChart>
              <Pie data={chartData} dataKey="value" cx="50%" cy="50%"
                innerRadius={65} outerRadius={90} paddingAngle={2} strokeWidth={0}>
                {chartData.map((item, i) => (
                  <Cell key={i} fill={item.categoryColor || COLORS[i % COLORS.length]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="w-[180px] h-[180px] rounded-full border-4 border-[var(--border)] flex items-center justify-center">
              <span className="text-sm text-[var(--text-secondary)]">Нет данных</span>
            </div>
          </div>
        )}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-2xl font-bold">{total.toFixed(2)}</span>
          <span className="text-xs text-[var(--text-secondary)]">EUR</span>
        </div>
      </div>

      {/* Category list */}
      <div className="flex flex-col gap-2">
        {filtered.map((cat, i) => (
          <div key={cat.categoryId} className="flex items-center gap-3 p-3 rounded-xl" style={{ background: 'var(--bg-card)' }}>
            <div className="w-10 h-10 rounded-full flex items-center justify-center text-lg"
              style={{ background: (cat.categoryColor || COLORS[i % COLORS.length]) + '22', border: `2px solid ${cat.categoryColor || COLORS[i % COLORS.length]}` }}>
              {cat.categoryIcon || '❓'}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium">{cat.categoryName}</div>
              {total > 0 && (
                <div className="h-1.5 mt-1 rounded-full overflow-hidden" style={{ background: 'var(--bg-input)' }}>
                  <div className="h-full rounded-full transition-all" style={{ width: `${(Math.abs(cat.total) / total * 100)}%`, background: cat.categoryColor || COLORS[i % COLORS.length] }} />
                </div>
              )}
            </div>
            <div className="text-sm font-medium whitespace-nowrap">{Math.abs(cat.total).toFixed(2)} €</div>
          </div>
        ))}
      </div>

      {/* FAB */}
      <button onClick={() => setShowModal(true)}
        className="fixed bottom-20 right-4 w-14 h-14 rounded-full flex items-center justify-center shadow-lg z-40"
        style={{ background: 'var(--accent)' }}>
        <Plus size={28} color="white" />
      </button>

      <AddTransactionModal open={showModal} onClose={() => setShowModal(false)} />
    </div>
  )
}
