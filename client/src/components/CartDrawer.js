import React from 'react';
import {
  Drawer,
  Box,
  Typography,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Button,
  Divider,
  Avatar,
  TextField,
  Alert
} from '@mui/material';
import { Close, Add, Remove, Delete } from '@mui/icons-material';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { useNotification } from '../contexts/NotificationContext';

const CartDrawer = ({ open, onClose }) => {
  const { cart, updateCart, removeFromCart, loading } = useCart();
  const { user } = useAuth();
  const { showNotification } = useNotification();

  const handleQuantityChange = async (itemId, newQuantity) => {
    if (newQuantity < 1) return;
    
    if (user) {
      const result = await updateCart(itemId, newQuantity);
      if (!result.success) {
        showNotification(result.error, 'error');
      }
    } else {
      // Gestion panier anonyme
      const currentCart = JSON.parse(localStorage.getItem('anonymousCart') || '{"items":[],"total":0,"count":0}');
      const itemIndex = currentCart.items.findIndex(item => item.id === itemId);
      
      if (itemIndex >= 0) {
        currentCart.items[itemIndex].quantity = newQuantity;
        
        // Recalculer totaux
        currentCart.count = currentCart.items.reduce((sum, item) => sum + item.quantity, 0);
        currentCart.total = currentCart.items.reduce((sum, item) => {
          const price = item.productInfo?.basePrice || 0;
          return sum + (item.quantity * price);
        }, 0);
        
        localStorage.setItem('anonymousCart', JSON.stringify(currentCart));
        window.location.reload(); // Force refresh pour mettre à jour le context
      }
    }
  };

  const handleRemoveItem = async (itemId) => {
    if (user) {
      const result = await removeFromCart(itemId);
      if (result.success) {
        showNotification('Article supprimé du panier', 'success');
      } else {
        showNotification(result.error, 'error');
      }
    } else {
      // Gestion panier anonyme
      const currentCart = JSON.parse(localStorage.getItem('anonymousCart') || '{"items":[],"total":0,"count":0}');
      currentCart.items = currentCart.items.filter(item => item.id !== itemId);
      
      // Recalculer totaux
      currentCart.count = currentCart.items.reduce((sum, item) => sum + item.quantity, 0);
      currentCart.total = currentCart.items.reduce((sum, item) => {
        const price = item.productInfo?.basePrice || 0;
        return sum + (item.quantity * price);
      }, 0);
      
      localStorage.setItem('anonymousCart', JSON.stringify(currentCart));
      showNotification('Article supprimé du panier', 'success');
      window.location.reload(); // Force refresh pour mettre à jour le context
    }
  };

  const getItemInfo = (item) => {
    if (user) {
      // Panier serveur
      return {
        name: item.ProductVariant?.Product?.name || 'Produit',
        brand: item.ProductVariant?.Product?.brand || '',
        size: item.ProductVariant?.size || '',
        price: item.ProductVariant?.Product?.basePrice || 0,
        image: item.ProductVariant?.Product?.images?.[0] || null
      };
    } else {
      // Panier anonyme
      return {
        name: item.productInfo?.name || 'Produit',
        brand: item.productInfo?.brand || '',
        size: item.productInfo?.variant?.size || '',
        price: item.productInfo?.basePrice || 0,
        image: null
      };
    }
  };

  return (
    <Drawer anchor="right" open={open} onClose={onClose}>
      <Box sx={{ width: 400, p: 2 }}>
        {/* Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="h6">Mon Panier ({cart.count})</Typography>
          <IconButton onClick={onClose}>
            <Close />
          </IconButton>
        </Box>

        <Divider sx={{ mb: 2 }} />

        {/* Articles */}
        {cart.items.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="body1" color="text.secondary">
              Votre panier est vide
            </Typography>
          </Box>
        ) : (
          <>
            <List sx={{ flexGrow: 1 }}>
              {cart.items.map((item) => {
                const info = getItemInfo(item);
                return (
                  <ListItem key={item.id} sx={{ px: 0, py: 2 }}>
                    <Avatar
                      src={info.image}
                      sx={{ mr: 2, bgcolor: 'grey.200' }}
                      variant="rounded"
                    >
                      👟
                    </Avatar>
                    
                    <ListItemText
                      primary={
                        <Box>
                          <Typography variant="subtitle2">{info.name}</Typography>
                          <Typography variant="body2" color="text.secondary">
                            {info.brand} • Taille {info.size}
                          </Typography>
                          <Typography variant="h6" color="primary">
                            {info.price}€
                          </Typography>
                        </Box>
                      }
                    />
                    
                    <ListItemSecondaryAction>
                      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
                        {/* Contrôles quantité */}
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <IconButton 
                            size="small" 
                            onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                          >
                            <Remove />
                          </IconButton>
                          <TextField
                            size="small"
                            value={item.quantity}
                            onChange={(e) => {
                              const value = parseInt(e.target.value);
                              if (!isNaN(value) && value > 0) {
                                handleQuantityChange(item.id, value);
                              }
                            }}
                            sx={{ width: 60 }}
                            inputProps={{ style: { textAlign: 'center' } }}
                          />
                          <IconButton 
                            size="small" 
                            onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                          >
                            <Add />
                          </IconButton>
                        </Box>
                        
                        {/* Bouton supprimer */}
                        <IconButton 
                          size="small" 
                          color="error"
                          onClick={() => handleRemoveItem(item.id)}
                        >
                          <Delete />
                        </IconButton>
                      </Box>
                    </ListItemSecondaryAction>
                  </ListItem>
                );
              })}
            </List>

            <Divider sx={{ my: 2 }} />

            {/* Total */}
            <Box sx={{ mb: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h6">Total:</Typography>
                <Typography variant="h6" color="primary">
                  {cart.total.toFixed(2)}€
                </Typography>
              </Box>
            </Box>

            {/* Actions */}
            {!user && (
              <Alert severity="info" sx={{ mb: 2 }}>
                Connectez-vous pour finaliser votre commande
              </Alert>
            )}
            
            <Button
              variant="contained"
              fullWidth
              size="large"
              disabled={loading}
              onClick={() => {
                if (!user) {
                  showNotification('Veuillez vous connecter pour commander', 'warning');
                } else {
                  showNotification('Redirection vers le checkout...', 'info');
                  // TODO: Redirection vers checkout
                }
              }}
            >
              {user ? 'Commander' : 'Se connecter pour commander'}
            </Button>
          </>
        )}
      </Box>
    </Drawer>
  );
};

export default CartDrawer;
