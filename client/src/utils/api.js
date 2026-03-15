const BASE = '/api';

async function request(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error || 'Request failed');
  }
  if (res.headers.get('content-type')?.includes('json')) {
    return res.json();
  }
  return res;
}

export const api = {
  accounts: {
    list: () => request('/accounts'),
    create: (data) => request('/accounts', { method: 'POST', body: JSON.stringify(data) }),
    update: (id, data) => request(`/accounts/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id) => request(`/accounts/${id}`, { method: 'DELETE' }),
  },
  categories: {
    list: () => request('/categories'),
    create: (data) => request('/categories', { method: 'POST', body: JSON.stringify(data) }),
    update: (id, data) => request(`/categories/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id) => request(`/categories/${id}`, { method: 'DELETE' }),
  },
  transactions: {
    list: (params) => request(`/transactions?${new URLSearchParams(params)}`),
    summary: (params) => request(`/transactions/summary?${new URLSearchParams(params)}`),
    create: (data) => request('/transactions', { method: 'POST', body: JSON.stringify(data) }),
    delete: (id) => request(`/transactions/${id}`, { method: 'DELETE' }),
  },
  export: {
    excel: () => fetch(`${BASE}/export/excel`).then(r => r.blob()),
  },
};
