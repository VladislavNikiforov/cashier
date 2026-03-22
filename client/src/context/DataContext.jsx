import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import * as data from '../utils/dataLayer.js';

const DataContext = createContext(null);

export function DataProvider({ children }) {
  const [accounts, setAccounts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  const reload = useCallback(async () => {
    const [acc, cat, tx] = await Promise.all([
      data.getAccounts(),
      data.getCategories(),
      data.getTransactions(),
    ]);
    setAccounts(acc);
    setCategories(cat);
    setTransactions(tx);
  }, []);

  useEffect(() => {
    (async () => {
      try {
        await data.seedDefaults();
        await reload();
      } catch (err) {
        console.error('Init error:', err);
      } finally {
        setLoading(false);
      }
    })();
  }, [reload]);

  // Auto-sync when online
  useEffect(() => {
    const sync = () => data.syncWithServer().catch(() => {});
    window.addEventListener('online', sync);
    return () => window.removeEventListener('online', sync);
  }, []);

  const addTransaction = async (txData) => {
    await data.createTransaction(txData);
    await reload();
  };

  const removeTransaction = async (id) => {
    await data.deleteTransaction(id);
    await reload();
  };

  const addAccount = async (accData) => {
    await data.createAccount(accData);
    await reload();
  };

  const removeAccount = async (id) => {
    await data.deleteAccount(id);
    await reload();
  };

  const addCategory = async (catData) => {
    await data.createCategory(catData);
    await reload();
  };

  const removeCategory = async (id) => {
    await data.deleteCategory(id);
    await reload();
  };

  const getTransactionsForPeriod = useCallback(async (from, to) => {
    const txns = await data.getTransactions(from, to);
    return txns;
  }, []);

  const getSummaryForPeriod = useCallback(async (from, to) => {
    return data.getSummary(from, to);
  }, []);

  return (
    <DataContext.Provider value={{
      accounts, categories, transactions, loading,
      addTransaction, removeTransaction,
      addAccount, removeAccount,
      addCategory, removeCategory,
      getTransactionsForPeriod, getSummaryForPeriod,
      reload,
    }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error('useData must be inside DataProvider');
  return ctx;
}
