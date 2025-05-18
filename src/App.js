import React, { useState, useEffect } from 'react';
import { getAllItems } from './db';
import AddItemForm from './components/AddItemForm';
import DataControls from './components/DataControls';
import StickyHeadTable from './components/StickyHeadTable';
import { Container, Card, CardContent, Typography } from '@mui/material';

function App() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    const fetchItems = async () => {
      const allItems = await getAllItems();
      setItems(allItems);
    };
    fetchItems();
  }, []);

  return (
    <Container maxWidth="md">
      <Card sx={{ mt: 4, p: 3 }}>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            Gcash Cashout
          </Typography>
          <AddItemForm onAddItem={() => getAllItems().then(setItems)} />
          <DataControls items={items} onImport={() => getAllItems().then(setItems)} />
        </CardContent>
      </Card>
      <StickyHeadTable rows={items} setRows={setItems} sx={{ mt: 4 }} />
    </Container>
  );
}

export default App;