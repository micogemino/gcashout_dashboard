// src/App.js
import React, { useState, useEffect } from 'react';
import { addItem, getAllItems, deleteItem } from './db';

function App() {
  const [items, setItems] = useState([]);
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    const fetchItems = async () => {
      const allItems = await getAllItems();
      setItems(allItems);
    };
    fetchItems();
  }, []);

  const handleAddItem = async () => {
    const newItem = { name: inputValue };
    await addItem(newItem);
    const allItems = await getAllItems();
    setItems(allItems);
    setInputValue('');
  };

  const handleDeleteItem = async (id) => {
    await deleteItem(id);
    const allItems = await getAllItems();
    setItems(allItems);
  };

  return (
    <div>
      <h1>PWA with IndexedDB</h1>
      <input 
        type="text" 
        value={inputValue} 
        onChange={(e) => setInputValue(e.target.value)} 
      />
      <button onClick={handleAddItem}>Add Item</button>
      <ul>
        {items.map(item => (
          <li key={item.id}>
            {item.name} <button onClick={() => handleDeleteItem(item.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
