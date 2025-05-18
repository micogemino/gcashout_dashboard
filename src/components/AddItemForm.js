import React, { useState } from 'react';
import { addItem } from '../db';
import { TextField, Button, Grid, Typography } from '@mui/material';
import AddBoxIcon from '@mui/icons-material/AddBox';

const AddItemForm = ({ onAddItem }) => {
  const [inputRef, setInputRef] = useState('');
  const [inputAmount, setInputAmount] = useState('');
  const [inputReceiverName, setInputReceiverName] = useState('');
  const [image, setImage] = useState(null);
  const [error, setError] = useState('');

  const handleAddItem = async () => {
    if (!inputRef || !inputAmount || !inputReceiverName) {
      setError('All fields are required');
      return;
    }
    setError('');
    await addItem(inputRef, inputAmount, null, inputReceiverName, image);
    setInputRef('');
    setInputAmount('');
    setInputReceiverName('');
    setImage(null);
    onAddItem();
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setError('Please upload a valid image file');
        return;
      }
      const reader = new FileReader();
      reader.onload = (e) => setImage(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  return (
    <>
      {error && <Typography color="error">{error}</Typography>}
      <Grid container spacing={2}>
        <Grid item xs={12} sm={4}>
          <TextField
            fullWidth
            label="Reference Number"
            value={inputRef}
            onChange={(e) => setInputRef(e.target.value)}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            fullWidth
            type="number"
            label="Amount"
            value={inputAmount}
            onChange={(e) => setInputAmount(e.target.value)}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            fullWidth
            label="Receiver Name"
            value={inputReceiverName}
            onChange={(e) => setInputReceiverName(e.target.value)}
          />
        </Grid>
        <Grid item xs={12}>
          <input type="file" accept="image/*" onChange={handleImageUpload} />
          {image && (
            <img src={image} alt="Preview" style={{ width: '100px', marginTop: '10px' }} />
          )}
        </Grid>
      </Grid>
      <Grid container spacing={2} sx={{ mt: 2 }}>
        <Grid item>
          <Button
            variant="contained"
            startIcon={<AddBoxIcon />}
            onClick={handleAddItem}
          >
            Add Item
          </Button>
        </Grid>
      </Grid>
    </>
  );
};

export default AddItemForm;