import React, { useState, useEffect } from 'react';
import { addItem, getAllItems, deleteItem } from './db';
import StickyHeadTable from './components/DataTableComponents';
import * as XLSX from 'xlsx';
import Button from '@mui/material/Button';
import AddBoxIcon from '@mui/icons-material/AddBox';
import FileDownloadIcon from '@mui/icons-material/FileDownload';

function App() {
  const [items, setItems] = useState([]);
  const [inputRef, setInputRef] = useState('');
  const [inputAmount, setInputAmount] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchItems = async () => {
      const allItems = await getAllItems();
      setItems(allItems);
    };
    fetchItems();
  }, []);

  const handleAddItem = async () => {
    if (!inputRef || !inputAmount) {
      setError('All fields are required');
      return;
    }
    setError('');  // Clear any existing error
    await addItem(inputRef, inputAmount);
    const allItems = await getAllItems();
    setItems(allItems);
    setInputRef('');
    setInputAmount('');
  };

  const handleDeleteItem = async (id) => {
    const isConfirmed = window.confirm('Are you sure you want to delete this item with id ' + id + '?');
    if (isConfirmed) {
      await deleteItem(id);
      const allItems = await getAllItems();
      setItems(allItems);
    }
  };

  const handleExport = () => {
    // Define the columns in the order you want
    const headers = ['id', 'reference_number', 'amount', 'created'];

    // Map the items to match the column order
    const formattedItems = items.map(item => {
      return {
        id: item.id,
        reference_number: item.reference_number,
        amount: item.amount,
        created: item.created,
      };
    });

    // Create worksheet with the specified columns
    const worksheet = XLSX.utils.json_to_sheet(formattedItems, { header: headers });
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Gcash Cashouts');

    // Generate the Excel file and trigger a download
    XLSX.writeFile(workbook, 'gcash_cashouts.xlsx');
  };

  return (
    <div>
      <h1>Gcash Cashout</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <input
        type="text"
        value={inputRef}
        onChange={(e) => setInputRef(e.target.value)}
        placeholder="Reference Number"
        style={{ marginRight: '10px', marginBottom: '10px' }} // Add space below the input field
      />
      <input
        type="number"
        value={inputAmount}
        onChange={(e) => setInputAmount(e.target.value)}
        placeholder="Amount"
        style={{ marginBottom: '10px' }} // Add space below the input field
      />
      <br />
      <Button
        onClick={handleAddItem}
        size="small"
        variant="contained"
        startIcon={<AddBoxIcon />}
        style={{ marginRight: '10px', marginBottom: '10px' }} // Add space to the right of the button
      >
        Add Item
      </Button>
      <div className="App">
        <Button
          onClick={handleExport}
          size="small"
          variant="contained"
          startIcon={<FileDownloadIcon />}
          style={{ marginRight: '10px' }} // Add space to the right of the button
        >
          Export to Excel
        </Button>
        <StickyHeadTable rows={items} onDelete={handleDeleteItem} />
      </div>
    </div>
  );
}

export default App;
