import { openDB } from 'idb';

const dbPromise = openDB('gcash-database', 1, {
  upgrade(db) {
    if (!db.objectStoreNames.contains('gcashCashouts')) {
      const store = db.createObjectStore('gcashCashouts', { keyPath: 'id', autoIncrement: true });
      store.createIndex('reference_number', 'reference_number', { unique: true });
      store.createIndex('amount', 'amount', { unique: false });
      store.createIndex('created', 'created', { unique: false });
    }
  },
});

export const addItem = async (ref, amount) => {
  const db = await dbPromise;
  // Get the current date and time in local timezone
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0'); // Months are 0-based
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');

  // Format the date and time as Y-m-d H:i:s
  const created = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  try {
    await db.add('gcashCashouts', { reference_number: ref, amount: amount, created: created });
  } catch (error) {
    if (error.name === 'ConstraintError') {
      console.error('Reference number must be unique.');
      alert('Error: Reference number must be unique.');
    } else {
      throw error;
    }
  }
};

export const getItem = async (id) => {
  const db = await dbPromise;
  return await db.get('gcashCashouts', id);
};

export const getAllItems = async () => {
  const db = await dbPromise;
  return await db.getAll('gcashCashouts');
};

export const deleteItem = async (id) => {
  const db = await dbPromise;
  await db.delete('gcashCashouts', id);
};
