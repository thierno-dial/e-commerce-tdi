import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, Button, Menu, MenuItem, Chip, Box, CircularProgress } from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import AuthDialog from './AuthDialog';

const Header = () => {
  const { user, logout, loading } = useAuth();
  const [authOpen, setAuthOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  const handleLogout = () => {
    logout();
    handleMenuClose();
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
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Sneakers Store
          </Typography>
          
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
                <MenuItem onClick={handleLogout}>Déconnexion</MenuItem>
              </Menu>
            </Box>
          ) : (
            <Button color="inherit" onClick={() => setAuthOpen(true)}>
              Connexion
            </Button>
          )}
        </Toolbar>
      </AppBar>

      <AuthDialog open={authOpen} onClose={() => setAuthOpen(false)} />
    </>
  );
};

export default Header;
