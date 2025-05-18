import React from 'react';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

const ImageModal = ({ open, onClose, imageSrc }) => {
  const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: { xs: 2, sm: 4 },
    width: { xs: '95vw', sm: '90vw', md: '80vw' },
    maxWidth: '800px',
    maxHeight: '90vh',
    overflow: 'auto',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: '8px',
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={modalStyle}>
        <IconButton
          sx={{
            position: 'absolute',
            top: 8,
            right: 8,
            color: 'text.primary',
            bgcolor: 'rgba(0, 0, 0, 0.1)',
            '&:hover': { bgcolor: 'rgba(0, 0, 0, 0.2)' },
          }}
          onClick={onClose}
          aria-label="close"
        >
          <CloseIcon />
        </IconButton>
        {imageSrc && (
          <img
            src={imageSrc}
            alt="Full size"
            style={{
              maxWidth: '100%',
              maxHeight: '80vh',
              objectFit: 'contain',
              width: 'auto',
              height: 'auto',
            }}
          />
        )}
      </Box>
    </Modal>
  );
};

export default ImageModal;