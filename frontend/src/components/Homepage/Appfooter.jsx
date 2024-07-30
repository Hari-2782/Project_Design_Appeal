import React from 'react';
import { Container, Box, Typography } from '@mui/material';

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        py: 2,
        px: 2,
        mt: 'auto',
        backgroundColor: (theme) =>
          theme.palette.mode === 'light' ? theme.palette.grey[200] : theme.palette.grey[800],
      }}
    >
      <Container maxWidth="md">

        <Typography variant="body2" color="text.secondary" align="center" mt={2}>
        <Typography variant='body2' color="text.secondary" align="center" mt={2}>
          Unique Creation
        </Typography>
          © {new Date().getFullYear()} T-Shirt Customizer UniqueCreation. All rights reserved.
        </Typography>
              </Container>
    </Box>
  );
};

export default Footer;
