// src/db.js
import { openDB } from 'idb';

const dbPromise = openDB('my-database', 1, {
  upgrade(db) {
    if (!db.objectStoreNames.contains('storeName')) {
      db.createObjectStore('storeName', { keyPath: 'id', autoIncrement: true });
    }
  },
});

export const addItem = async (item) => {
  const db = await dbPromise;
  await db.add('storeName', item);
};

export const getItem = async (id) => {
  const db = await dbPromise;
  return await db.get('storeName', id);
};

export const getAllItems = async () => {
  const db = await dbPromise;
  return await db.getAll('storeName');
};

export const deleteItem = async (id) => {
  const db = await dbPromise;
  await db.delete('storeName', id);
};
