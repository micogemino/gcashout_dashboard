import React, { useState, useEffect } from 'react';
import CameraCapture from './CameraCapture';
import { openDB } from 'idb';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import Button from '@mui/material/Button';

const StickyHeadTable = ({ rows, setRows }) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [openCamera, setOpenCamera] = useState(false);

  useEffect(() => {
    const fetchRows = async () => {
      const db = await openDB('gcash-database', 1);
      const allRows = await db.getAll('gcashCashouts');
      setRows(allRows);
    };
    fetchRows();
  }, [setRows]);

  const handleDelete = async (id) => {
    const db = await openDB('gcash-database', 1);
    await db.delete('gcashCashouts', id);
    setRows(rows.filter(row => row.id !== id));
  };

  const handleCapture = async (image) => {
    const newEntry = {
      reference_number: `Ref-${Date.now()}`,
      amount: Math.floor(Math.random() * 1000),
      receiver_name: 'John Doe',
      created: new Date().toISOString(),
      image,
    };

    const db = await openDB('gcash-database', 1);
    const id = await db.add('gcashCashouts', newEntry);
    setRows([...rows, { ...newEntry, id }]);
    setOpenCamera(false);
  };

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
      <Button variant="contained" color="primary" onClick={() => setOpenCamera(true)}>
        Capture Image
      </Button>

      {openCamera && <CameraCapture onCapture={handleCapture} />}

      <TableContainer sx={{ maxHeight: 440 }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Reference Number</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Receiver Name</TableCell>
              <TableCell>Image</TableCell>
              <TableCell>Created</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(row => (
              <TableRow key={row.id}>
                <TableCell>{row.id}</TableCell>
                <TableCell>{row.reference_number}</TableCell>
                <TableCell>{row.amount}</TableCell>
                <TableCell>{row.receiver_name}</TableCell>
                <TableCell>
                  {row.image ? (
                    <img src={row.image} alt="Captured" style={{ width: '50px', height: '50px', borderRadius: '5px' }} />
                  ) : (
                    'No Image'
                  )}
                </TableCell>
                <TableCell>{row.created}</TableCell>
                <TableCell>
                  <IconButton color="error" onClick={() => handleDelete(row.id)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        count={rows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={(event, newPage) => setPage(newPage)}
        onRowsPerPageChange={(event) => setRowsPerPage(+event.target.value)}
      />
    </Paper>
  );
};

export default StickyHeadTable;
