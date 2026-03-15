const DB_NAME = 'cashier';
const DB_VERSION = 1;

const STORES = {
  accounts: { keyPath: 'id' },
  categories: { keyPath: 'id' },
  transactions: { keyPath: 'id', indexes: [{ name: 'date', keyPath: 'date' }, { name: 'categoryId', keyPath: 'categoryId' }] },
  syncQueue: { keyPath: 'id', autoIncrement: true },
};

function open() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = (e) => {
      const db = e.target.result;
      for (const [name, config] of Object.entries(STORES)) {
        if (!db.objectStoreNames.contains(name)) {
          const store = db.createObjectStore(name, { keyPath: config.keyPath, autoIncrement: config.autoIncrement });
          if (config.indexes) {
            for (const idx of config.indexes) {
              store.createIndex(idx.name, idx.keyPath, { unique: false });
            }
          }
        }
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

let dbPromise = null;
function getDb() {
  if (!dbPromise) dbPromise = open();
  return dbPromise;
}

function tx(storeName, mode = 'readonly') {
  return getDb().then(db => {
    const t = db.transaction(storeName, mode);
    return t.objectStore(storeName);
  });
}

function promisify(req) {
  return new Promise((resolve, reject) => {
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

export const localDb = {
  async getAll(storeName) {
    const store = await tx(storeName);
    return promisify(store.getAll());
  },

  async get(storeName, id) {
    const store = await tx(storeName);
    return promisify(store.get(id));
  },

  async put(storeName, item) {
    const store = await tx(storeName, 'readwrite');
    return promisify(store.put(item));
  },

  async delete(storeName, id) {
    const store = await tx(storeName, 'readwrite');
    return promisify(store.delete(id));
  },

  async clear(storeName) {
    const store = await tx(storeName, 'readwrite');
    return promisify(store.clear());
  },

  async bulkPut(storeName, items) {
    const db = await getDb();
    const t = db.transaction(storeName, 'readwrite');
    const store = t.objectStore(storeName);
    for (const item of items) {
      store.put(item);
    }
    return new Promise((resolve, reject) => {
      t.oncomplete = () => resolve();
      t.onerror = () => reject(t.error);
    });
  },

  // Sync queue operations
  async addToSyncQueue(action) {
    const store = await tx('syncQueue', 'readwrite');
    return promisify(store.add({ ...action, timestamp: Date.now() }));
  },

  async getSyncQueue() {
    return this.getAll('syncQueue');
  },

  async clearSyncQueue() {
    return this.clear('syncQueue');
  },

  async removeSyncItem(id) {
    return this.delete('syncQueue', id);
  },
};
