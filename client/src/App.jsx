import { Routes, Route } from 'react-router-dom'
import { DataProvider } from './context/DataContext'
import BottomNav from './components/BottomNav'
import Categories from './pages/Categories'
import Transactions from './pages/Transactions'
import Accounts from './pages/Accounts'
import SettingsPage from './pages/SettingsPage'

export default function App() {
  return (
    <DataProvider>
      <Routes>
        <Route path="/" element={<Categories />} />
        <Route path="/transactions" element={<Transactions />} />
        <Route path="/accounts" element={<Accounts />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Routes>
      <BottomNav />
    </DataProvider>
  )
}
