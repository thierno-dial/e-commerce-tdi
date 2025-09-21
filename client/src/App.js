import React, { useState } from 'react';
import { ThemeProvider, createTheme, CssBaseline, AppBar, Toolbar, Typography, Container, Button, Box } from '@mui/material';
import { AuthProvider } from './contexts/AuthContext';
import ProductCatalog from './components/ProductCatalog';
import AuthDialog from './components/AuthDialog';

const theme = createTheme({
  palette: {
    primary: { main: '#1976d2' },
    secondary: { main: '#f50057' }
  }
});

function App() {
  const [authOpen, setAuthOpen] = useState(false);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" sx={{ flexGrow: 1 }}>
              Sneakers Store
            </Typography>
            <Button color="inherit" onClick={() => setAuthOpen(true)}>
              Login
            </Button>
          </Toolbar>
        </AppBar>
        
        <Container maxWidth="lg" sx={{ mt: 4 }}>
          <Box sx={{ mb: 4 }}>
            <Typography variant="h4" component="h1" gutterBottom>
              Découvrez nos sneakers
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Collection premium Nike & Adidas
            </Typography>
          </Box>
          <ProductCatalog />
        </Container>

        <AuthDialog open={authOpen} onClose={() => setAuthOpen(false)} />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
