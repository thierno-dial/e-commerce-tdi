import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Grid,
  Typography,
  Box,
  Alert,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Divider
} from '@mui/material';
import ConfirmDialog from './ConfirmDialog';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { useNotification } from '../contexts/NotificationContext';
import { orderService } from '../services/api';

const CheckoutSimple = ({ open, onClose, onCancel, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [confirmOrderOpen, setConfirmOrderOpen] = useState(false);
  const { cart, fetchCart } = useCart();
  const { user } = useAuth();
  const { showNotification } = useNotification();

  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    address: '',
    city: '',
    postalCode: ''
  });

  const [paymentMethod, setPaymentMethod] = useState('card');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleOrderRequest = () => {
    if (!formData.address || !formData.city || !formData.postalCode) {
      showNotification('Veuillez remplir tous les champs obligatoires', 'warning');
      return;
    }
    setConfirmOrderOpen(true);
  };

  const handleOrderConfirm = async () => {
    setLoading(true);
    try {
      const orderData = {
        shippingAddress: { ...formData, country: 'France' },
        paymentMethod
      };

      const response = await orderService.create(orderData);
      const order = response.data.order;

      showNotification(
        `Commande ${order.orderNumber} confirmée ! 📧 Email de confirmation envoyé à ${user.email}`, 
        'success'
      );
      await fetchCart();
      setConfirmOrderOpen(false);
      onClose();
      if (onSuccess) {
        onSuccess(); // Callback pour fermer le panier après succès
      }
      
    } catch (error) {
      showNotification(error.response?.data?.error || 'Erreur lors de la commande', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    onClose();
    if (onCancel) {
      onCancel(); // Callback pour rouvrir le panier
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={handleCancel} 
      maxWidth="sm" 
      fullWidth
      sx={{
        zIndex: (theme) => theme.zIndex.modal + 2, // Plus élevé que le CartDrawer
        '& .MuiDialog-paper': {
          zIndex: (theme) => theme.zIndex.modal + 2
        },
        '& .MuiBackdrop-root': {
          backgroundColor: 'rgba(0, 0, 0, 0.3)', // Backdrop semi-transparent
          backdropFilter: 'blur(2px)' // Léger flou pour voir le panier derrière
        }
      }}
    >
      <DialogTitle>Finaliser la commande</DialogTitle>
      
      <DialogContent>
        <Box sx={{ mt: 2 }}>
          <Typography variant="h6" gutterBottom>Adresse de livraison</Typography>
          
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <TextField
                fullWidth
                name="firstName"
                label="Prénom *"
                value={formData.firstName}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                name="lastName"
                label="Nom *"
                value={formData.lastName}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                name="address"
                label="Adresse *"
                value={formData.address}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={8}>
              <TextField
                fullWidth
                name="city"
                label="Ville *"
                value={formData.city}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                fullWidth
                name="postalCode"
                label="Code postal *"
                value={formData.postalCode}
                onChange={handleChange}
              />
            </Grid>
          </Grid>

          <Divider sx={{ my: 3 }} />

          <Typography variant="h6" gutterBottom>Mode de paiement</Typography>
          <FormControl component="fieldset" sx={{ mb: 3 }}>
            <FormLabel component="legend">Choisissez votre mode de paiement</FormLabel>
            <RadioGroup
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
            >
              <FormControlLabel 
                value="card" 
                control={<Radio />} 
                label="💳 Carte bancaire (simulation)" 
              />
              <FormControlLabel 
                value="paypal" 
                control={<Radio />} 
                label="🅿️ PayPal (simulation)" 
              />
              <FormControlLabel 
                value="bank" 
                control={<Radio />} 
                label="🏦 Virement bancaire (simulation)" 
              />
            </RadioGroup>
          </FormControl>

          {paymentMethod === 'card' && (
            <Alert severity="info" sx={{ mb: 2 }}>
              💳 Paiement par carte bancaire sécurisé (simulation)
            </Alert>
          )}
          {paymentMethod === 'paypal' && (
            <Alert severity="info" sx={{ mb: 2 }}>
              🅿️ Redirection vers PayPal pour finaliser le paiement (simulation)
            </Alert>
          )}
          {paymentMethod === 'bank' && (
            <Alert severity="info" sx={{ mb: 2 }}>
              🏦 Instructions de virement envoyées par email (simulation)
            </Alert>
          )}

          <Divider sx={{ my: 3 }} />

          <Box sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
            <Typography variant="h6">Récapitulatif de commande</Typography>
            <Typography variant="body2">
              {cart.count} article(s) • Total: {cart.total.toFixed(2)}€
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Paiement: {paymentMethod === 'card' ? 'Carte bancaire' : paymentMethod === 'paypal' ? 'PayPal' : 'Virement bancaire'} (simulation)
            </Typography>
          </Box>
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={handleCancel}>Annuler</Button>
        <Button 
          variant="contained" 
          onClick={handleOrderRequest}
          disabled={loading}
        >
          {loading ? 'Commande en cours...' : 'Confirmer la commande'}
        </Button>
      </DialogActions>

      <ConfirmDialog
        open={confirmOrderOpen}
        onClose={() => setConfirmOrderOpen(false)}
        onConfirm={handleOrderConfirm}
        title="Confirmer la commande"
        message={`Êtes-vous sûr de vouloir passer cette commande de ${cart.total.toFixed(2)}€ ?`}
        confirmText="Oui, commander"
        cancelText="Annuler"
        severity="info"
        loading={loading}
      />
    </Dialog>
  );
};

export default CheckoutSimple;
