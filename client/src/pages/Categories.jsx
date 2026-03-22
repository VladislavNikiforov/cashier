import { useState, useEffect, useMemo } from 'react'
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts'
import { ChevronLeft, ChevronRight, TrendingDown, TrendingUp } from 'lucide-react'
import TransactionEntry from '../components/TransactionEntry'
import { useData } from '../context/DataContext'

const COLORS = ['#4f8cff', '#ff6b6b', '#ffd93d', '#6bcb77', '#a66cff', '#ff922b', '#20c997', '#e599f7', '#74c0fc', '#f783ac', '#ffe066', '#63e6be']
const MONTHS = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь']

export default function Categories() {
  const { getSummaryForPeriod, categories, accounts, loading } = useData()
  const [mode, setMode] = useState('expense')
  const [month, setMonth] = useState(() => new Date().getMonth())
  const [year, setYear] = useState(() => new Date().getFullYear())
  const [selectedCat, setSelectedCat] = useState(null)
  const [summary, setSummary] = useState([])

  const from = `${year}-${String(month + 1).padStart(2, '0')}-01`
  const to = `${year}-${String(month + 1).padStart(2, '0')}-${new Date(year, month + 1, 0).getDate()}`

  useEffect(() => {
    getSummaryForPeriod(from, to).then(setSummary)
  }, [from, to, getSummaryForPeriod, loading])

  const filteredCats = useMemo(() => categories.filter(c => c.type === mode), [categories, mode])
  const summaryMap = useMemo(() => {
    const m = {}
    for (const s of summary) m[s.categoryId] = s
    return m
  }, [summary])

  const total = useMemo(() => {
    return summary.filter(s => s.type === mode).reduce((s, c) => s + Math.abs(c.total), 0)
  }, [summary, mode])

  const chartData = useMemo(() => {
    return summary.filter(s => s.type === mode).map(c => ({ ...c, value: Math.abs(c.total) }))
  }, [summary, mode])

  const prevMonth = () => {
    if (month === 0) { setMonth(11); setYear(y => y - 1) }
    else setMonth(m => m - 1)
  }
  const nextMonth = () => {
    if (month === 11) { setMonth(0); setYear(y => y + 1) }
    else setMonth(m => m + 1)
  }

  const account = accounts[0]

  // Split categories: top row, left, right, bottom row
  const topCats = filteredCats.slice(0, 4)
  const leftCats = filteredCats.slice(4, 6)
  const rightCats = filteredCats.slice(6, 8)
  const bottomCats = filteredCats.slice(8, 12)

  return (
    <div className="flex flex-col flex-1 pb-20">
      {/* Account bar */}
      <div className="flex items-center justify-between px-4 pt-3 pb-2">
        <div className="w-9 h-9 rounded-full flex items-center justify-center"
          style={{ border: '1.5px solid var(--text-secondary)' }}>
          <span className="text-sm">👤</span>
        </div>
        <div className="text-center">
          <div className="text-xs text-[var(--text-secondary)]">{account?.name || 'Счёт'}</div>
          <div className="text-lg font-bold">€ {parseFloat(account?.balance || 0).toFixed(2)}</div>
        </div>
        <div className="w-9" />
      </div>

      {/* Mode + Month */}
      <div className="flex items-center justify-between px-4 mb-2">
        <button onClick={() => setMode(m => m === 'expense' ? 'income' : 'expense')}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium"
          style={{ background: 'var(--bg-card)' }}>
          {mode === 'expense' ? <TrendingDown size={14} /> : <TrendingUp size={14} />}
          {mode === 'expense' ? 'Расходы' : 'Доходы'}
        </button>
        <div className="flex items-center gap-2">
          <button onClick={prevMonth} className="p-1 text-[var(--text-secondary)]"><ChevronLeft size={18} /></button>
          <span className="text-xs font-medium min-w-[100px] text-center">{MONTHS[month]} {year}</span>
          <button onClick={nextMonth} className="p-1 text-[var(--text-secondary)]"><ChevronRight size={18} /></button>
        </div>
      </div>

      {/* Category grid around donut */}
      <div className="px-2 flex-1">
        {/* Top row: 4 categories */}
        <div className="grid grid-cols-4 gap-1 mb-1">
          {topCats.map((cat, i) => (
            <CatButton key={cat.id} cat={cat} spent={summaryMap[cat.id]?.total} color={cat.color || COLORS[i]}
              onTap={() => setSelectedCat(cat)} />
          ))}
        </div>

        {/* Middle: left cats + donut + right cats */}
        <div className="flex items-center gap-1 mb-1">
          {/* Left column */}
          <div className="flex flex-col gap-1 w-[72px]">
            {leftCats.map((cat, i) => (
              <CatButton key={cat.id} cat={cat} spent={summaryMap[cat.id]?.total} color={cat.color || COLORS[4 + i]}
                onTap={() => setSelectedCat(cat)} />
            ))}
          </div>

          {/* Donut */}
          <div className="flex-1 relative aspect-square">
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={chartData} dataKey="value" cx="50%" cy="50%"
                    innerRadius="55%" outerRadius="80%" paddingAngle={2} strokeWidth={0}>
                    {chartData.map((item, i) => (
                      <Cell key={i} fill={item.categoryColor || COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <div className="w-[75%] aspect-square rounded-full border-4 border-[var(--border)]" />
              </div>
            )}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-[10px] text-[var(--text-secondary)]">
                {mode === 'expense' ? 'Расходы' : 'Доходы'}
              </span>
              <span className="text-xl font-bold">€ {total.toFixed(2)}</span>
            </div>
          </div>

          {/* Right column */}
          <div className="flex flex-col gap-1 w-[72px]">
            {rightCats.map((cat, i) => (
              <CatButton key={cat.id} cat={cat} spent={summaryMap[cat.id]?.total} color={cat.color || COLORS[6 + i]}
                onTap={() => setSelectedCat(cat)} />
            ))}
          </div>
        </div>

        {/* Bottom row: 4 categories */}
        <div className="grid grid-cols-4 gap-1">
          {bottomCats.map((cat, i) => (
            <CatButton key={cat.id} cat={cat} spent={summaryMap[cat.id]?.total} color={cat.color || COLORS[8 + i]}
              onTap={() => setSelectedCat(cat)} />
          ))}
        </div>
      </div>

      <TransactionEntry
        open={!!selectedCat}
        category={selectedCat}
        onClose={() => { setSelectedCat(null); getSummaryForPeriod(from, to).then(setSummary) }}
      />
    </div>
  )
}

function CatButton({ cat, spent, color, onTap }) {
  const amount = spent ? Math.abs(spent) : 0
  return (
    <button onClick={onTap}
      className="flex flex-col items-center gap-0.5 py-2 px-1 rounded-xl active:scale-95 transition-transform">
      <span className="text-[10px] text-[var(--text-secondary)] truncate w-full text-center leading-tight">{cat.name}</span>
      <div className="w-11 h-11 rounded-full flex items-center justify-center text-lg"
        style={{ background: color + '22', border: `2px solid ${color}` }}>
        {cat.icon || '❓'}
      </div>
      <span className="text-[10px] font-semibold" style={{ color }}>
        € {amount > 0 ? amount.toFixed(0) : '0'}
      </span>
    </button>
  )
}
