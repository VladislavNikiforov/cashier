import { Plus, CreditCard, Banknote, Bitcoin, TrendingUp } from 'lucide-react'

const ACCOUNT_TYPES = {
  card: { icon: CreditCard, label: 'Карта', color: '#4f8cff' },
  cash: { icon: Banknote, label: 'Наличные', color: '#4caf50' },
  crypto: { icon: Bitcoin, label: 'Крипта', color: '#ffb74d' },
  assets: { icon: TrendingUp, label: 'Активы', color: '#a66cff' },
}

const demoAccounts = [
  { id: 1, name: 'Карта', type: 'card', balance: 1243.67, currency: 'EUR' },
  { id: 2, name: 'Наличные', type: 'cash', balance: 85.00, currency: 'EUR' },
  { id: 3, name: 'Крипта', type: 'crypto', balance: 320.50, currency: 'EUR' },
  { id: 4, name: 'Активы', type: 'assets', balance: 1500.00, currency: 'EUR' },
]

export default function Accounts() {
  const total = demoAccounts.reduce((s, a) => s + a.balance, 0)

  return (
    <div className="flex flex-col flex-1 px-4 pt-4 pb-20">
      <h1 className="text-lg font-semibold mb-4">Счета</h1>

      {/* Total */}
      <div className="p-4 rounded-2xl mb-4" style={{ background: 'var(--bg-card)' }}>
        <div className="text-xs text-[var(--text-secondary)] mb-1">Общий баланс</div>
        <div className="text-2xl font-bold">{total.toFixed(2)} <span className="text-sm font-normal text-[var(--text-secondary)]">EUR</span></div>
      </div>

      {/* Accounts list */}
      <div className="flex flex-col gap-2">
        {demoAccounts.map(acc => {
          const typeInfo = ACCOUNT_TYPES[acc.type]
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
              <div className="text-sm font-semibold">{acc.balance.toFixed(2)} €</div>
            </div>
          )
        })}
      </div>

      {/* Add account button */}
      <button className="flex items-center justify-center gap-2 mt-4 p-3 rounded-xl border-2 border-dashed text-sm text-[var(--text-secondary)]"
        style={{ borderColor: 'var(--border)' }}>
        <Plus size={18} /> Добавить счёт
      </button>
    </div>
  )
}
