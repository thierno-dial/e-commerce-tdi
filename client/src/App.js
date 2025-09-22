import React, { useState } from 'react';
import { ThemeProvider, createTheme, CssBaseline, Container, Typography, Box } from '@mui/material';
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import { NotificationProvider } from './contexts/NotificationContext';
import Header from './components/Header';
import ProductCatalog from './components/ProductCatalog';
import OrdersList from './components/OrdersList';

const theme = createTheme({
  palette: {
    primary: { main: '#1976d2' },
    secondary: { main: '#f50057' }
  }
});

function App() {
  const [currentView, setCurrentView] = useState('products');

  const renderContent = () => {
    switch (currentView) {
      case 'orders':
        return (
          <Box sx={{ mb: 4 }}>
            <Typography variant="h4" component="h1" gutterBottom>
              Mes commandes
            </Typography>
            <OrdersList />
          </Box>
        );
      case 'products':
      default:
        return (
          <>
            <Box sx={{ mb: 4 }}>
              <Typography variant="h4" component="h1" gutterBottom>
                Découvrez nos sneakers
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Collection premium Nike & Adidas
              </Typography>
            </Box>
            <ProductCatalog />
          </>
        );
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <NotificationProvider>
        <AuthProvider>
          <CartProvider>
            <Header 
              onShowOrders={() => setCurrentView('orders')} 
              onShowProducts={() => setCurrentView('products')}
            />
            <Container maxWidth="lg" sx={{ mt: 4 }}>
              {renderContent()}
            </Container>
          </CartProvider>
        </AuthProvider>
      </NotificationProvider>
    </ThemeProvider>
  );
}

export default App;
