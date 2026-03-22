import { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight, Search, Trash2, Plus } from 'lucide-react'
import AddTransactionModal from '../components/AddTransactionModal'
import { useData } from '../context/DataContext'

const MONTHS = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь']
const WEEKDAYS = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб']

function groupByDate(txns) {
  const groups = {}
  for (const tx of txns) {
    const dateKey = tx.date.slice(0, 10)
    if (!groups[dateKey]) groups[dateKey] = []
    groups[dateKey].push(tx)
  }
  return Object.entries(groups).sort(([a], [b]) => b.localeCompare(a))
}

function formatDate(dateStr) {
  const d = new Date(dateStr + 'T00:00:00')
  return `${d.getDate()} ${MONTHS[d.getMonth()]}, ${WEEKDAYS[d.getDay()]}`
}

export default function Transactions() {
  const { getTransactionsForPeriod, categories, removeTransaction, loading } = useData()
  const [month, setMonth] = useState(() => new Date().getMonth())
  const [year, setYear] = useState(() => new Date().getFullYear())
  const [txns, setTxns] = useState([])
  const [search, setSearch] = useState('')
  const [showSearch, setShowSearch] = useState(false)
  const [showModal, setShowModal] = useState(false)

  const from = `${year}-${String(month + 1).padStart(2, '0')}-01`
  const to = `${year}-${String(month + 1).padStart(2, '0')}-${new Date(year, month + 1, 0).getDate()}`

  useEffect(() => {
    getTransactionsForPeriod(from, to).then(setTxns)
  }, [from, to, getTransactionsForPeriod, loading])

  const catMap = Object.fromEntries(categories.map(c => [c.id, c]))

  const filtered = search
    ? txns.filter(t => (t.note || '').toLowerCase().includes(search.toLowerCase()) || (catMap[t.categoryId]?.name || '').toLowerCase().includes(search.toLowerCase()))
    : txns

  const grouped = groupByDate(filtered)

  const prevMonth = () => { if (month === 0) { setMonth(11); setYear(y => y - 1) } else setMonth(m => m - 1) }
  const nextMonth = () => { if (month === 11) { setMonth(0); setYear(y => y + 1) } else setMonth(m => m + 1) }

  const handleDelete = async (id) => {
    await removeTransaction(id)
    getTransactionsForPeriod(from, to).then(setTxns)
  }

  return (
    <div className="flex flex-col flex-1 px-4 pt-4 pb-20">
      <div className="flex items-center justify-between mb-3">
        <h1 className="text-lg font-semibold">Транзакции</h1>
        <button onClick={() => setShowSearch(s => !s)} className="p-2 rounded-lg text-[var(--text-secondary)]">
          <Search size={20} />
        </button>
      </div>

      {showSearch && (
        <input type="text" value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Поиск по заметке или категории..."
          className="w-full p-3 rounded-xl mb-3 outline-none text-sm"
          style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }} autoFocus />
      )}

      <div className="flex items-center justify-between mb-4 py-2 px-3 rounded-xl" style={{ background: 'var(--bg-card)' }}>
        <button onClick={prevMonth} className="p-1 text-[var(--text-secondary)]"><ChevronLeft size={20} /></button>
        <span className="text-sm font-medium">{MONTHS[month]} {year}</span>
        <button onClick={nextMonth} className="p-1 text-[var(--text-secondary)]"><ChevronRight size={20} /></button>
      </div>

      {grouped.length === 0 && (
        <div className="flex-1 flex items-center justify-center text-sm text-[var(--text-secondary)]">
          Нет транзакций за этот период
        </div>
      )}

      <div className="flex flex-col gap-4">
        {grouped.map(([date, dayTxns]) => {
          const dayTotal = dayTxns.reduce((s, t) => s + (t.type === 'income' ? 1 : -1) * parseFloat(t.amount), 0)
          return (
            <div key={date}>
              <div className="flex items-center justify-between mb-2 px-1">
                <span className="text-xs font-medium text-[var(--text-secondary)]">{formatDate(date)}</span>
                <span className={`text-xs font-medium ${dayTotal < 0 ? 'text-[var(--danger)]' : 'text-[var(--success)]'}`}>
                  {dayTotal > 0 ? '+' : ''}{dayTotal.toFixed(2)} €
                </span>
              </div>
              <div className="flex flex-col gap-1.5">
                {dayTxns.map(tx => {
                  const cat = catMap[tx.categoryId]
                  return (
                    <div key={tx.id} className="flex items-center gap-3 p-3 rounded-xl" style={{ background: 'var(--bg-card)' }}>
                      <div className="w-10 h-10 rounded-full flex items-center justify-center text-lg" style={{ background: 'var(--bg-input)' }}>
                        {cat?.icon || '❓'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium">{cat?.name || 'Без категории'}</div>
                        <div className="text-xs text-[var(--text-secondary)] truncate">{tx.note || ''}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`text-sm font-medium ${tx.type === 'income' ? 'text-[var(--success)]' : 'text-[var(--danger)]'}`}>
                          {tx.type === 'income' ? '+' : '-'}{parseFloat(tx.amount).toFixed(2)} €
                        </span>
                        <button onClick={() => handleDelete(tx.id)} className="p-1 text-[var(--text-secondary)] opacity-40 hover:opacity-100">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>

      <button onClick={() => setShowModal(true)}
        className="fixed bottom-20 right-4 w-14 h-14 rounded-full flex items-center justify-center shadow-lg z-40"
        style={{ background: 'var(--accent)' }}>
        <Plus size={28} color="white" />
      </button>

      <AddTransactionModal open={showModal} onClose={() => { setShowModal(false); getTransactionsForPeriod(from, to).then(setTxns) }} />
    </div>
  )
}
