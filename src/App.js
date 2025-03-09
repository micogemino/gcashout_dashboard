import React, { useState, useEffect } from 'react';
import { addItem, getAllItems, deleteItem } from './db';
import StickyHeadTable from './components/StickyHeadTable';
import * as XLSX from 'xlsx';
import { Container, TextField, Button, Grid, Card, CardContent, Typography } from '@mui/material';
import AddBoxIcon from '@mui/icons-material/AddBox';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import FileUploadIcon from '@mui/icons-material/FileUpload';

function App() {
  const [items, setItems] = useState([]);
  const [inputRef, setInputRef] = useState('');
  const [inputAmount, setInputAmount] = useState('');
  const [inputReceiverName, setInputReceiverName] = useState('');
  const [image, setImage] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchItems = async () => {
      const allItems = await getAllItems();
      setItems(allItems);
    };
    fetchItems();
  }, []);

  const handleAddItem = async () => {
    if (!inputRef || !inputAmount || !inputReceiverName) {
      setError('All fields are required');
      return;
    }
    setError('');
    await addItem(inputRef, inputAmount, null, inputReceiverName, image);
    const allItems = await getAllItems();
    setItems(allItems);
    setInputRef('');
    setInputAmount('');
    setInputReceiverName('');
    setImage(null);
  };

  const handleDeleteItem = async (id) => {
    const isConfirmed = window.confirm('Are you sure you want to delete this item?');
    if (isConfirmed) {
      await deleteItem(id);
      const allItems = await getAllItems();
      setItems(allItems);
    }
  };

  const handleExport = () => {
    const headers = ['id', 'reference_number', 'amount', 'receiver_name', 'created'];
    const formattedItems = items.map(item => ({
      id: item.id,
      reference_number: item.reference_number,
      amount: item.amount,
      receiver_name: item.receiver_name,
      created: item.created,
    }));

    const worksheet = XLSX.utils.json_to_sheet(formattedItems, { header: headers });
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Gcash Cashouts');
    XLSX.writeFile(workbook, 'gcash_cashouts.xlsx');
  };

  const handleImport = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);

        jsonData.forEach(async (item) => {
          const { reference_number, amount, receiver_name, created } = item;
          await addItem(reference_number, amount, created, receiver_name);
        });

        getAllItems().then(setItems);
      };
      reader.readAsArrayBuffer(file);
    }
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setImage(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleCapture = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      const video = document.createElement('video');
      video.srcObject = stream;
      video.play();
      
      setTimeout(() => {
        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        setImage(canvas.toDataURL('image/png'));
        stream.getTracks().forEach(track => track.stop());
      }, 1000);
    } catch (error) {
      console.error('Error accessing camera:', error);
    }
  };

  return (
    <Container maxWidth="md">
      <Card sx={{ mt: 4, p: 3 }}>
        <CardContent>
          <Typography variant="h5" gutterBottom>Gcash Cashout</Typography>
          {error && <Typography color="error">{error}</Typography>}
          <Grid container spacing={2}>
            <Grid item xs={12} sm={4}>
              <TextField fullWidth label="Reference Number" value={inputRef} onChange={(e) => setInputRef(e.target.value)} />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField fullWidth type="number" label="Amount" value={inputAmount} onChange={(e) => setInputAmount(e.target.value)} />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField fullWidth label="Receiver Name" value={inputReceiverName} onChange={(e) => setInputReceiverName(e.target.value)} />
            </Grid>
            <Grid item xs={12}>
              <input type="file" accept="image/*" onChange={handleImageUpload} />
              <Button variant="contained" onClick={handleCapture} sx={{ ml: 2 }}>Capture Image</Button>
              {image && <img src={image} alt="Preview" style={{ width: '100px', marginTop: '10px' }} />}
            </Grid>
          </Grid>
          <Grid container spacing={2} sx={{ mt: 2 }}>
            <Grid item>
              <Button variant="contained" startIcon={<AddBoxIcon />} onClick={handleAddItem}>Add Item</Button>
            </Grid>
            <Grid item>
              <Button variant="contained" startIcon={<FileDownloadIcon />} onClick={handleExport}>Export to Excel</Button>
            </Grid>
            <Grid item>
              <input type="file" accept=".xlsx, .xls" onChange={handleImport} style={{ display: 'none' }} id="import-button" />
              <label htmlFor="import-button">
                <Button component="span" variant="contained" startIcon={<FileUploadIcon />}>Import from Excel</Button>
              </label>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
      <StickyHeadTable rows={items} setRows={setItems} onDelete={handleDeleteItem} sx={{ mt: 4 }} />
    </Container>
  );
}

export default App;
