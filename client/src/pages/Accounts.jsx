import { useState } from 'react'
import { Plus, CreditCard, Banknote, Bitcoin, TrendingUp, Trash2, X } from 'lucide-react'
import { useData } from '../context/DataContext'

const ACCOUNT_TYPES = {
  card: { icon: CreditCard, label: 'Карта', color: '#4f8cff' },
  cash: { icon: Banknote, label: 'Наличные', color: '#4caf50' },
  crypto: { icon: Bitcoin, label: 'Крипта', color: '#ffb74d' },
  assets: { icon: TrendingUp, label: 'Активы', color: '#a66cff' },
}

export default function Accounts() {
  const { accounts, addAccount, removeAccount } = useData()
  const [showForm, setShowForm] = useState(false)
  const [newName, setNewName] = useState('')
  const [newType, setNewType] = useState('card')

  const total = accounts.reduce((s, a) => s + parseFloat(a.balance || 0), 0)

  const handleAdd = async (e) => {
    e.preventDefault()
    if (!newName.trim()) return
    await addAccount({ name: newName, type: newType, currency: 'EUR' })
    setNewName('')
    setShowForm(false)
  }

  return (
    <div className="flex flex-col flex-1 px-4 pt-4 pb-20">
      <h1 className="text-lg font-semibold mb-4">Счета</h1>

      <div className="p-4 rounded-2xl mb-4" style={{ background: 'var(--bg-card)' }}>
        <div className="text-xs text-[var(--text-secondary)] mb-1">Общий баланс</div>
        <div className="text-2xl font-bold">{total.toFixed(2)} <span className="text-sm font-normal text-[var(--text-secondary)]">EUR</span></div>
      </div>

      <div className="flex flex-col gap-2">
        {accounts.map(acc => {
          const typeInfo = ACCOUNT_TYPES[acc.type] || ACCOUNT_TYPES.card
          const Icon = typeInfo.icon
          return (
            <div key={acc.id} className="flex items-center gap-3 p-4 rounded-xl" style={{ background: 'var(--bg-card)' }}>
              <div className="w-11 h-11 rounded-full flex items-center justify-center"
                style={{ background: typeInfo.color + '22', border: `2px solid ${typeInfo.color}` }}>
                <Icon size={20} style={{ color: typeInfo.color }} />
              </div>
              <div className="flex-1">
                <div className="text-sm font-medium">{acc.name}</div>
                <div className="text-xs text-[var(--text-secondary)]">{typeInfo.label}</div>
              </div>
              <div className="text-sm font-semibold mr-2">{parseFloat(acc.balance || 0).toFixed(2)} €</div>
              <button onClick={() => removeAccount(acc.id)} className="p-1 text-[var(--text-secondary)] opacity-40 hover:opacity-100">
                <Trash2 size={14} />
              </button>
            </div>
          )
        })}
      </div>

      {showForm ? (
        <form onSubmit={handleAdd} className="mt-4 p-4 rounded-xl flex flex-col gap-3" style={{ background: 'var(--bg-card)' }}>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Новый счёт</span>
            <button type="button" onClick={() => setShowForm(false)} className="text-[var(--text-secondary)]"><X size={18} /></button>
          </div>
          <input type="text" value={newName} onChange={e => setNewName(e.target.value)}
            placeholder="Название" autoFocus
            className="w-full p-3 rounded-xl outline-none text-sm"
            style={{ background: 'var(--bg-input)', border: '1px solid var(--border)' }} />
          <div className="grid grid-cols-4 gap-2">
            {Object.entries(ACCOUNT_TYPES).map(([key, info]) => {
              const Icon = info.icon
              return (
                <button key={key} type="button" onClick={() => setNewType(key)}
                  className={`flex flex-col items-center gap-1 p-2 rounded-xl text-xs ${newType === key ? 'ring-2 ring-[var(--accent)]' : ''}`}
                  style={{ background: 'var(--bg-input)' }}>
                  <Icon size={18} style={{ color: info.color }} />
                  {info.label}
                </button>
              )
            })}
          </div>
          <button type="submit" className="w-full py-2.5 rounded-xl text-white text-sm font-medium" style={{ background: 'var(--accent)' }}>
            Добавить
          </button>
        </form>
      ) : (
        <button onClick={() => setShowForm(true)}
          className="flex items-center justify-center gap-2 mt-4 p-3 rounded-xl border-2 border-dashed text-sm text-[var(--text-secondary)]"
          style={{ borderColor: 'var(--border)' }}>
          <Plus size={18} /> Добавить счёт
        </button>
      )}
    </div>
  )
}
