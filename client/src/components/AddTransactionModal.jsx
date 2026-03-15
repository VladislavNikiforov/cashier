import { useState } from 'react'
import { X, TrendingDown, TrendingUp } from 'lucide-react'

const DEMO_CATEGORIES = {
  expense: [
    { id: '1', name: 'Продукты', icon: '🛒' },
    { id: '2', name: 'Кафе', icon: '☕' },
    { id: '3', name: 'Транспорт', icon: '🚌' },
    { id: '4', name: 'Bad Досуг', icon: '🍺' },
    { id: '5', name: 'Подарки', icon: '🎁' },
    { id: '6', name: 'Инвестиции', icon: '📈' },
    { id: '7', name: 'Good досуг', icon: '🎬' },
    { id: '8', name: 'Путешествия', icon: '✈️' },
    { id: '9', name: 'Здоровье', icon: '💊' },
    { id: '10', name: 'Покупки', icon: '🛍️' },
  ],
  income: [
    { id: '11', name: 'GastroTech', icon: '💼' },
    { id: '12', name: 'Долги', icon: '🤝' },
    { id: '13', name: 'Подарки', icon: '🎁' },
    { id: '14', name: 'Чаевые', icon: '💰' },
  ],
}

const DEMO_ACCOUNTS = [
  { id: '1', name: 'Карта' },
  { id: '2', name: 'Наличные' },
  { id: '3', name: 'Крипта' },
  { id: '4', name: 'Активы' },
]

export default function AddTransactionModal({ open, onClose }) {
  const [type, setType] = useState('expense')
  const [amount, setAmount] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [accountId, setAccountId] = useState(DEMO_ACCOUNTS[0].id)
  const [note, setNote] = useState('')
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10))

  if (!open) return null

  const categories = DEMO_CATEGORIES[type] || []

  const handleSubmit = (e) => {
    e.preventDefault()
    // TODO: API call
    console.log({ type, amount, categoryId, accountId, note, date })
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center" onClick={onClose}>
      <div className="absolute inset-0 bg-black/60" />
      <div className="relative w-full max-w-[480px] rounded-t-2xl p-5 pb-8 max-h-[90vh] overflow-y-auto"
        style={{ background: 'var(--bg-secondary)' }}
        onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Новая транзакция</h2>
          <button onClick={onClose} className="p-1 text-[var(--text-secondary)]"><X size={22} /></button>
        </div>

        {/* Type toggle */}
        <div className="flex gap-2 mb-4">
          <button onClick={() => { setType('expense'); setCategoryId('') }}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-sm font-medium transition-colors ${type === 'expense' ? 'bg-[var(--danger)] text-white' : 'bg-[var(--bg-card)] text-[var(--text-secondary)]'}`}>
            <TrendingDown size={16} /> Расход
          </button>
          <button onClick={() => { setType('income'); setCategoryId('') }}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-sm font-medium transition-colors ${type === 'income' ? 'bg-[var(--success)] text-white' : 'bg-[var(--bg-card)] text-[var(--text-secondary)]'}`}>
            <TrendingUp size={16} /> Доход
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          {/* Amount */}
          <div>
            <label className="text-xs text-[var(--text-secondary)] mb-1 block">Сумма (EUR)</label>
            <input type="number" step="0.01" value={amount} onChange={e => setAmount(e.target.value)}
              placeholder="0.00" required autoFocus
              className="w-full p-3 rounded-xl text-xl font-semibold text-center outline-none"
              style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }} />
          </div>

          {/* Category grid */}
          <div>
            <label className="text-xs text-[var(--text-secondary)] mb-2 block">Категория</label>
            <div className="grid grid-cols-5 gap-2">
              {categories.map(cat => (
                <button key={cat.id} type="button" onClick={() => setCategoryId(cat.id)}
                  className={`flex flex-col items-center gap-1 p-2 rounded-xl text-xs transition-colors ${categoryId === cat.id ? 'ring-2 ring-[var(--accent)]' : ''}`}
                  style={{ background: 'var(--bg-card)' }}>
                  <span className="text-lg">{cat.icon}</span>
                  <span className="truncate w-full text-center text-[10px]">{cat.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Account */}
          <div>
            <label className="text-xs text-[var(--text-secondary)] mb-1 block">Счёт</label>
            <select value={accountId} onChange={e => setAccountId(e.target.value)}
              className="w-full p-3 rounded-xl outline-none appearance-none"
              style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
              {DEMO_ACCOUNTS.map(acc => (
                <option key={acc.id} value={acc.id}>{acc.name}</option>
              ))}
            </select>
          </div>

          {/* Date */}
          <div>
            <label className="text-xs text-[var(--text-secondary)] mb-1 block">Дата</label>
            <input type="date" value={date} onChange={e => setDate(e.target.value)}
              className="w-full p-3 rounded-xl outline-none"
              style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', colorScheme: 'dark' }} />
          </div>

          {/* Note */}
          <div>
            <label className="text-xs text-[var(--text-secondary)] mb-1 block">Заметка</label>
            <input type="text" value={note} onChange={e => setNote(e.target.value)}
              placeholder="Необязательно"
              className="w-full p-3 rounded-xl outline-none"
              style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }} />
          </div>

          {/* Submit */}
          <button type="submit"
            className="w-full py-3 rounded-xl text-white font-medium mt-2 transition-colors"
            style={{ background: type === 'expense' ? 'var(--danger)' : 'var(--success)' }}>
            {type === 'expense' ? 'Добавить расход' : 'Добавить доход'}
          </button>
        </form>
      </div>
    </div>
  )
}
