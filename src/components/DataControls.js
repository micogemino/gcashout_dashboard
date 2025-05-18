import React from 'react';
import * as XLSX from 'xlsx';
import { Button, Grid } from '@mui/material';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import { addItem } from '../db';

const DataControls = ({ items, onImport }) => {
  const handleExport = () => {
    const headers = ['id', 'reference_number', 'amount', 'receiver_name', 'created'];
    const formattedItems = items.map((item) => ({
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
      if (!file.name.endsWith('.xlsx') && !file.name.endsWith('.xls')) {
        alert('Please upload a valid Excel file (.xlsx or .xls)');
        return;
      }
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

        onImport();
      };
      reader.readAsArrayBuffer(file);
    }
  };

  return (
    <Grid container spacing={2} sx={{ mt: 2 }}>
      <Grid item>
        <Button
          variant="contained"
          startIcon={<FileDownloadIcon />}
          onClick={handleExport}
        >
          Export to Excel
        </Button>
      </Grid>
      <Grid item>
        <input
          type="file"
          accept=".xlsx, .xls"
          onChange={handleImport}
          style={{ display: 'none' }}
          id="import-button"
        />
        <label htmlFor="import-button">
          <Button
            component="span"
            variant="contained"
            startIcon={<FileUploadIcon />}
          >
            Import from Excel
          </Button>
        </label>
      </Grid>
    </Grid>
  );
};

export default DataControls;