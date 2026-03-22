import { useState, useEffect } from 'react'
import { X, FileText, Calendar, ChevronDown, Delete } from 'lucide-react'
import { useData } from '../context/DataContext'
import DatePickerSheet from './DatePickerSheet'

export default function TransactionEntry({ open, category, onClose }) {
  const { accounts, addTransaction } = useData()
  const [amount, setAmount] = useState('0')
  const [note, setNote] = useState('')
  const [showNotes, setShowNotes] = useState(false)
  const [showDatePicker, setShowDatePicker] = useState(false)
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10))
  const [accountId, setAccountId] = useState('')

  const account = accounts.find(a => a.id === (accountId || accounts[0]?.id))

  useEffect(() => {
    if (open) {
      setAmount('0')
      setNote('')
      setShowNotes(false)
      setShowDatePicker(false)
      setDate(new Date().toISOString().slice(0, 10))
    }
  }, [open, category])

  if (!open || !category) return null

  const handleKey = (key) => {
    if (key === 'backspace') {
      setAmount(prev => prev.length <= 1 ? '0' : prev.slice(0, -1))
      return
    }
    if (key === '.') {
      if (amount.includes('.')) return
      setAmount(prev => prev + '.')
      return
    }
    if (key === '€') return
    if ('0123456789'.includes(key)) {
      setAmount(prev => prev === '0' ? key : prev + key)
    }
  }

  const handleSubmit = async () => {
    const val = parseFloat(amount)
    if (!val || val === 0) return
    await addTransaction({
      type: category.type,
      amount: val.toFixed(2),
      categoryId: category.id,
      accountId: accountId || accounts[0]?.id,
      currency: 'EUR',
      note,
      date,
    })
    onClose()
  }

  const formatDate = (d) => {
    const today = new Date().toISOString().slice(0, 10)
    const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10)
    if (d === today) return 'Сегодня'
    if (d === yesterday) return 'Вчера'
    const dt = new Date(d + 'T00:00:00')
    return `${dt.getDate()} ${['Янв','Фев','Мар','Апр','Май','Июн','Июл','Авг','Сен','Окт','Ноя','Дек'][dt.getMonth()]}`
  }

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-end justify-center" onClick={onClose}>
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative w-full max-w-[480px] rounded-t-2xl overflow-hidden"
          style={{ background: 'var(--bg-secondary)' }}
          onClick={e => e.stopPropagation()}>

          {/* Header: account + category */}
          <div className="flex">
            <div className="flex-1 p-3 px-4" style={{ background: 'var(--bg-card)' }}>
              <div className="text-[10px] text-[var(--text-secondary)]">Со счёта</div>
              <div className="text-sm font-semibold mt-0.5">{account?.name || 'Счёт'}</div>
            </div>
            <div className="flex-1 p-3 px-4 flex items-center justify-between" style={{ background: 'var(--accent)', color: 'white' }}>
              <div>
                <div className="text-[10px] opacity-80">В категорию</div>
                <div className="text-sm font-semibold mt-0.5">{category.name}</div>
              </div>
              <div className="w-9 h-9 rounded-full flex items-center justify-center text-lg"
                style={{ background: 'rgba(255,255,255,0.2)' }}>
                {category.icon}
              </div>
            </div>
          </div>

          {/* Amount */}
          <div className="text-center py-3">
            <div className="text-xs" style={{ color: category.type === 'expense' ? 'var(--danger)' : 'var(--success)' }}>
              {category.type === 'expense' ? 'Расход' : 'Доход'}
            </div>
            <div className="text-3xl font-bold mt-1">€ {amount}</div>
          </div>

          {/* Notes */}
          {showNotes ? (
            <div className="px-4 pb-2">
              <input type="text" value={note} onChange={e => setNote(e.target.value)}
                placeholder="Заметка..." autoFocus
                className="w-full p-3 rounded-xl text-sm outline-none"
                style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }} />
            </div>
          ) : null}

          {/* Numpad */}
          <div className="grid grid-cols-5 gap-1.5 px-3 pb-3">
            {/* Row 1 */}
            <NumKey k="÷" display="÷" disabled />
            <NumKey k="7" onPress={handleKey} />
            <NumKey k="8" onPress={handleKey} />
            <NumKey k="9" onPress={handleKey} />
            <NumKey k="backspace" onPress={handleKey} icon={<Delete size={20} />} />

            {/* Row 2 */}
            <NumKey k="×" display="×" disabled />
            <NumKey k="4" onPress={handleKey} />
            <NumKey k="5" onPress={handleKey} />
            <NumKey k="6" onPress={handleKey} />
            <NumKey k="calendar" onPress={() => setShowDatePicker(true)} icon={<Calendar size={20} />} />

            {/* Row 3 */}
            <NumKey k="−" display="−" disabled />
            <NumKey k="1" onPress={handleKey} />
            <NumKey k="2" onPress={handleKey} />
            <NumKey k="3" onPress={handleKey} />
            <button onClick={handleSubmit}
              className="row-span-2 rounded-xl flex items-center justify-center"
              style={{ background: '#4fc3f7' }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </button>

            {/* Row 4 */}
            <NumKey k="+" display="+" disabled />
            <NumKey k="€" onPress={handleKey} display="€" />
            <NumKey k="0" onPress={handleKey} />
            <NumKey k="." onPress={handleKey} />
          </div>

          {/* Bottom bar */}
          <div className="flex items-center justify-between px-4 py-2 text-xs text-[var(--text-secondary)]"
            style={{ borderTop: '1px solid var(--border)' }}>
            <button onClick={() => setShowNotes(!showNotes)} className="flex items-center gap-1 p-1">
              <FileText size={14} /> Заметка
            </button>
            <button onClick={() => setShowDatePicker(true)} className="p-1">
              {formatDate(date)}
            </button>
          </div>
        </div>
      </div>

      <DatePickerSheet
        open={showDatePicker}
        date={date}
        onSelect={(d) => { setDate(d); setShowDatePicker(false) }}
        onClose={() => setShowDatePicker(false)}
      />
    </>
  )
}

function NumKey({ k, display, onPress, icon, disabled }) {
  return (
    <button
      onClick={() => !disabled && onPress?.(k)}
      className="h-14 rounded-xl flex items-center justify-center text-xl font-medium"
      style={{
        background: 'var(--bg-card)',
        opacity: disabled ? 0.3 : 1,
      }}>
      {icon || display || k}
    </button>
  )
}
