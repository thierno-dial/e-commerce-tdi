import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, Button, Menu, MenuItem, Chip, Box, CircularProgress, Badge, IconButton } from '@mui/material';
import { ShoppingCart, Receipt } from '@mui/icons-material';
import ConfirmDialog from './ConfirmDialog';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import AuthDialog from './AuthDialog';
import CartDrawer from './CartDrawer';

const Header = ({ onShowOrders, onShowProducts }) => {
  const { user, logout, loading } = useAuth();
  const { cart } = useCart();
  const [authOpen, setAuthOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [authMessage, setAuthMessage] = useState(null);
  const [confirmLogoutOpen, setConfirmLogoutOpen] = useState(false);

  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  const handleLogoutRequest = () => {
    setConfirmLogoutOpen(true);
    handleMenuClose();
  };

  const handleLogoutConfirm = () => {
    logout();
    setConfirmLogoutOpen(false);
  };

  const getRoleColor = (role) => {
    const colors = { admin: 'error', seller: 'warning', customer: 'info' };
    return colors[role] || 'default';
  };

  const getRoleLabel = (role) => {
    const labels = { admin: 'Admin', seller: 'Vendeur', customer: 'Client' };
    return labels[role] || role;
  };

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography 
            variant="h6" 
            sx={{ flexGrow: 1, cursor: 'pointer' }}
            onClick={onShowProducts}
          >
            Sneakers Store
          </Typography>
          
                 <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                   <IconButton color="inherit" onClick={() => setCartOpen(true)}>
                     <Badge badgeContent={cart.count} color="secondary">
                       <ShoppingCart />
                     </Badge>
                   </IconButton>
                   
                   {user && (
                     <IconButton color="inherit" onClick={onShowOrders}>
                       <Receipt />
                     </IconButton>
                   )}
            
            {loading ? (
              <CircularProgress color="inherit" size={24} />
            ) : user ? (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Chip 
                  label={getRoleLabel(user.role)} 
                  color={getRoleColor(user.role)} 
                  size="small" 
                />
                <Button color="inherit" onClick={handleMenuOpen}>
                  {user.firstName}
                </Button>
                       <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
                         <MenuItem onClick={handleLogoutRequest}>Déconnexion</MenuItem>
                       </Menu>
              </Box>
            ) : (
              <Button color="inherit" onClick={() => setAuthOpen(true)}>
                Connexion
              </Button>
            )}
          </Box>
        </Toolbar>
      </AppBar>

      <AuthDialog 
        open={authOpen} 
        onClose={() => {
          setAuthOpen(false);
          setAuthMessage(null);
        }}
        message={authMessage}
      />
      <CartDrawer 
        open={cartOpen} 
        onClose={() => setCartOpen(false)}
        onLoginRequest={() => {
          setCartOpen(false);
          setAuthMessage("Connectez-vous pour finaliser votre commande");
          setAuthOpen(true);
        }}
             />

             <ConfirmDialog
               open={confirmLogoutOpen}
               onClose={() => setConfirmLogoutOpen(false)}
               onConfirm={handleLogoutConfirm}
               title="Déconnexion"
               message="Êtes-vous sûr de vouloir vous déconnecter ?"
               confirmText="Oui, déconnecter"
               cancelText="Rester connecté"
               severity="warning"
             />
           </>
         );
       };

       export default Header;
