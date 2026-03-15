import { useRef } from 'react'
import { User, Download, Upload, LogOut, ChevronRight, Database } from 'lucide-react'
import { useData } from '../context/DataContext'
import { localDb } from '../utils/db'

function SettingsItem({ icon: Icon, label, onClick, danger, sub }) {
  return (
    <button onClick={onClick}
      className={`flex items-center gap-3 w-full p-4 rounded-xl text-left ${danger ? 'text-[var(--danger)]' : ''}`}
      style={{ background: 'var(--bg-card)' }}>
      <Icon size={20} />
      <div className="flex-1">
        <span className="text-sm">{label}</span>
        {sub && <div className="text-xs text-[var(--text-secondary)]">{sub}</div>}
      </div>
      <ChevronRight size={16} className="text-[var(--text-secondary)]" />
    </button>
  )
}

export default function SettingsPage() {
  const { transactions, categories, accounts } = useData()
  const fileInputRef = useRef(null)

  const handleExportCSV = () => {
    const catMap = Object.fromEntries(categories.map(c => [c.id, c]))
    const accMap = Object.fromEntries(accounts.map(a => [a.id, a]))

    const header = 'DATE,TYPE,FROM ACCOUNT,TO CATEGORY,AMOUNT,CURRENCY,NOTES'
    const rows = transactions.map(t => {
      const cat = catMap[t.categoryId]
      const acc = accMap[t.accountId]
      return [
        t.date.slice(0, 10),
        t.type,
        acc?.name || '',
        cat?.name || '',
        t.amount,
        t.currency || 'EUR',
        (t.note || '').replace(/,/g, ';'),
      ].join(',')
    })

    const csv = [header, ...rows].join('\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `cashier_export_${new Date().toISOString().slice(0, 10)}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleImportCSV = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const text = await file.text()
    const lines = text.trim().split('\n')
    // Skip header
    console.log('Import: parsed', lines.length - 1, 'rows')
    // TODO: parse and import rows
    alert(`Файл загружен: ${lines.length - 1} строк. Валидация будет в v2.`)
  }

  const pendingSync = async () => {
    const queue = await localDb.getSyncQueue()
    return queue.length
  }

  return (
    <div className="flex flex-col flex-1 px-4 pt-4 pb-20">
      <h1 className="text-lg font-semibold mb-4">Настройки</h1>

      <div className="flex items-center gap-3 p-4 rounded-2xl mb-4" style={{ background: 'var(--bg-card)' }}>
        <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ background: 'var(--accent)' }}>
          <User size={24} color="white" />
        </div>
        <div>
          <div className="text-sm font-medium">Локальный режим</div>
          <div className="text-xs text-[var(--text-secondary)]">Данные в IndexedDB на устройстве</div>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <SettingsItem icon={Download} label="Экспорт CSV" sub={`${transactions.length} транзакций`} onClick={handleExportCSV} />
        <SettingsItem icon={Upload} label="Импорт данных" onClick={() => fileInputRef.current?.click()} />
        <SettingsItem icon={Database} label="Статистика" sub={`${accounts.length} счетов · ${categories.length} категорий`} onClick={() => {}} />
      </div>

      <input ref={fileInputRef} type="file" accept=".csv" className="hidden" onChange={handleImportCSV} />
    </div>
  )
}
