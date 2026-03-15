import { useState, useMemo } from 'react'
import { X, TrendingDown, TrendingUp } from 'lucide-react'
import { useData } from '../context/DataContext'

export default function AddTransactionModal({ open, onClose }) {
  const { categories, accounts, addTransaction } = useData()
  const [type, setType] = useState('expense')
  const [amount, setAmount] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [accountId, setAccountId] = useState('')
  const [note, setNote] = useState('')
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10))

  const filteredCats = useMemo(() => categories.filter(c => c.type === type), [categories, type])

  // Set default account on first render
  const defaultAccountId = accounts[0]?.id || ''

  if (!open) return null

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!amount || !categoryId) return
    await addTransaction({
      type,
      amount: parseFloat(amount).toFixed(2),
      categoryId,
      accountId: accountId || defaultAccountId,
      currency: 'EUR',
      note,
      date,
    })
    setAmount('')
    setCategoryId('')
    setNote('')
    setDate(new Date().toISOString().slice(0, 10))
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center" onClick={onClose}>
      <div className="absolute inset-0 bg-black/60" />
      <div className="relative w-full max-w-[480px] rounded-t-2xl p-5 pb-8 max-h-[90vh] overflow-y-auto"
        style={{ background: 'var(--bg-secondary)' }}
        onClick={e => e.stopPropagation()}>

        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Новая транзакция</h2>
          <button onClick={onClose} className="p-1 text-[var(--text-secondary)]"><X size={22} /></button>
        </div>

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
          <div>
            <label className="text-xs text-[var(--text-secondary)] mb-1 block">Сумма (EUR)</label>
            <input type="number" step="0.01" value={amount} onChange={e => setAmount(e.target.value)}
              placeholder="0.00" required autoFocus
              className="w-full p-3 rounded-xl text-xl font-semibold text-center outline-none"
              style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }} />
          </div>

          <div>
            <label className="text-xs text-[var(--text-secondary)] mb-2 block">Категория</label>
            <div className="grid grid-cols-5 gap-2">
              {filteredCats.map(cat => (
                <button key={cat.id} type="button" onClick={() => setCategoryId(cat.id)}
                  className={`flex flex-col items-center gap-1 p-2 rounded-xl text-xs transition-colors ${categoryId === cat.id ? 'ring-2 ring-[var(--accent)]' : ''}`}
                  style={{ background: 'var(--bg-card)' }}>
                  <span className="text-lg">{cat.icon || '❓'}</span>
                  <span className="truncate w-full text-center text-[10px]">{cat.name}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs text-[var(--text-secondary)] mb-1 block">Счёт</label>
            <select value={accountId || defaultAccountId} onChange={e => setAccountId(e.target.value)}
              className="w-full p-3 rounded-xl outline-none appearance-none"
              style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
              {accounts.map(acc => (
                <option key={acc.id} value={acc.id}>{acc.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs text-[var(--text-secondary)] mb-1 block">Дата</label>
            <input type="date" value={date} onChange={e => setDate(e.target.value)}
              className="w-full p-3 rounded-xl outline-none"
              style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', colorScheme: 'dark' }} />
          </div>

          <div>
            <label className="text-xs text-[var(--text-secondary)] mb-1 block">Заметка</label>
            <input type="text" value={note} onChange={e => setNote(e.target.value)}
              placeholder="Необязательно"
              className="w-full p-3 rounded-xl outline-none"
              style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }} />
          </div>

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
