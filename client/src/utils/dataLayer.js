import { localDb } from './db.js';
import { api } from './api.js';

function generateId() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID();
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = Math.random() * 16 | 0;
    return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
  });
}

async function queueSync(action, entity, data) {
  await localDb.addToSyncQueue({ action, entity, data });
}

// ---- ACCOUNTS ----
export async function getAccounts() {
  return localDb.getAll('accounts');
}

export async function createAccount(data) {
  const account = { id: generateId(), ...data, balance: data.balance || '0', createdAt: new Date().toISOString() };
  await localDb.put('accounts', account);
  await queueSync('create', 'accounts', account);
  return account;
}

export async function updateAccount(id, data) {
  const existing = await localDb.get('accounts', id);
  if (!existing) return null;
  const updated = { ...existing, ...data };
  await localDb.put('accounts', updated);
  await queueSync('update', 'accounts', updated);
  return updated;
}

export async function deleteAccount(id) {
  await localDb.delete('accounts', id);
  await queueSync('delete', 'accounts', { id });
}

// ---- CATEGORIES ----
export async function getCategories() {
  return localDb.getAll('categories');
}

export async function createCategory(data) {
  const category = { id: generateId(), ...data, sortOrder: 0, createdAt: new Date().toISOString() };
  await localDb.put('categories', category);
  await queueSync('create', 'categories', category);
  return category;
}

export async function updateCategory(id, data) {
  const existing = await localDb.get('categories', id);
  if (!existing) return null;
  const updated = { ...existing, ...data };
  await localDb.put('categories', updated);
  await queueSync('update', 'categories', updated);
  return updated;
}

export async function deleteCategory(id) {
  await localDb.delete('categories', id);
  await queueSync('delete', 'categories', { id });
}

// ---- TRANSACTIONS ----
export async function getTransactions(from, to) {
  const all = await localDb.getAll('transactions');
  return all
    .filter(t => {
      if (from && t.date < from) return false;
      if (to && t.date > to + 'T23:59:59') return false;
      return true;
    })
    .sort((a, b) => b.date.localeCompare(a.date));
}

export async function createTransaction(data) {
  const tx = {
    id: generateId(),
    ...data,
    date: data.date || new Date().toISOString().slice(0, 10),
    createdAt: new Date().toISOString(),
  };
  await localDb.put('transactions', tx);

  // Update account balance locally
  const account = await localDb.get('accounts', tx.accountId);
  if (account) {
    const sign = tx.type === 'income' ? 1 : -1;
    account.balance = String(parseFloat(account.balance || 0) + sign * parseFloat(tx.amount));
    await localDb.put('accounts', account);
  }

  await queueSync('create', 'transactions', tx);
  return tx;
}

export async function deleteTransaction(id) {
  const tx = await localDb.get('transactions', id);
  if (tx) {
    const account = await localDb.get('accounts', tx.accountId);
    if (account) {
      const sign = tx.type === 'income' ? -1 : 1;
      account.balance = String(parseFloat(account.balance || 0) + sign * parseFloat(tx.amount));
      await localDb.put('accounts', account);
    }
  }
  await localDb.delete('transactions', id);
  await queueSync('delete', 'transactions', { id });
}

// ---- SUMMARY ----
export async function getSummary(from, to) {
  const txns = await getTransactions(from, to);
  const categories = await getCategories();
  const catMap = Object.fromEntries(categories.map(c => [c.id, c]));

  const summary = {};
  for (const tx of txns) {
    const key = tx.categoryId || 'uncategorized';
    if (!summary[key]) {
      const cat = catMap[key] || { name: 'Без категории', icon: '❓', color: '#888' };
      summary[key] = { categoryId: key, categoryName: cat.name, categoryIcon: cat.icon, categoryColor: cat.color, type: tx.type, total: 0 };
    }
    summary[key].total += parseFloat(tx.amount);
  }
  return Object.values(summary);
}

// ---- SYNC ----
export async function syncWithServer() {
  if (!navigator.onLine) return { synced: 0 };

  const queue = await localDb.getSyncQueue();
  let synced = 0;

  for (const item of queue) {
    try {
      const apiGroup = api[item.entity];
      if (!apiGroup) continue;

      if (item.action === 'create') await apiGroup.create(item.data);
      else if (item.action === 'update') await apiGroup.update(item.data.id, item.data);
      else if (item.action === 'delete') await apiGroup.delete(item.data.id);

      await localDb.removeSyncItem(item.id);
      synced++;
    } catch (err) {
      console.warn('Sync failed for item:', item, err);
      break;
    }
  }
  return { synced, remaining: queue.length - synced };
}

// ---- SEED DEFAULT DATA ----
export async function seedDefaults() {
  const accounts = await getAccounts();
  if (accounts.length > 0) return;

  const defaultAccounts = [
    { name: 'Карта', type: 'card', currency: 'EUR', icon: '💳', balance: '0' },
    { name: 'Наличные', type: 'cash', currency: 'EUR', icon: '💵', balance: '0' },
    { name: 'Крипта', type: 'crypto', currency: 'EUR', icon: '₿', balance: '0' },
    { name: 'Активы', type: 'assets', currency: 'EUR', icon: '📊', balance: '0' },
  ];

  const defaultCategories = [
    { name: 'Продукты', type: 'expense', icon: '🛒', color: '#4f8cff' },
    { name: 'Кафе', type: 'expense', icon: '☕', color: '#ff6b6b' },
    { name: 'Транспорт', type: 'expense', icon: '🚌', color: '#ffd93d' },
    { name: 'Bad Досуг', type: 'expense', icon: '🍺', color: '#6bcb77' },
    { name: 'Подарки', type: 'expense', icon: '🎁', color: '#a66cff' },
    { name: 'Инвестиции', type: 'expense', icon: '📈', color: '#ff922b' },
    { name: 'Good досуг', type: 'expense', icon: '🎬', color: '#20c997' },
    { name: 'Путешествия', type: 'expense', icon: '✈️', color: '#e599f7' },
    { name: 'Здоровье', type: 'expense', icon: '💊', color: '#74c0fc' },
    { name: 'Покупки', type: 'expense', icon: '🛍️', color: '#f783ac' },
    { name: 'Долги', type: 'expense', icon: '📝', color: '#ffe066' },
    { name: 'Соло', type: 'expense', icon: '🎯', color: '#63e6be' },
    { name: 'GastroTech', type: 'income', icon: '💼', color: '#4caf50' },
    { name: 'Долги', type: 'income', icon: '🤝', color: '#20c997' },
    { name: 'Подарки', type: 'income', icon: '🎁', color: '#a66cff' },
    { name: 'Чаевые', type: 'income', icon: '💰', color: '#ffd93d' },
    { name: 'Темки', type: 'income', icon: '💡', color: '#ff922b' },
  ];

  for (const acc of defaultAccounts) await createAccount(acc);
  for (const cat of defaultCategories) await createCategory(cat);
}
