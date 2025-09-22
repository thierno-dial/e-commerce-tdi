import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Chip,
  Button,
  Grid,
  Alert,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  Divider,
  Avatar
} from '@mui/material';
import ConfirmDialog from './ConfirmDialog';
import { orderService } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { useNotification } from '../contexts/NotificationContext';

const OrdersList = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [orderToCancel, setOrderToCancel] = useState(null);
  const [cancelLoading, setCancelLoading] = useState(false);
  const { user } = useAuth();
  const { showNotification } = useNotification();

  useEffect(() => {
    if (user) {
      fetchOrders();
    }
  }, [user]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await orderService.getAll();
      setOrders(response.data.orders);
    } catch (error) {
      console.error('Error fetching orders:', error);
      showNotification('Erreur lors du chargement des commandes', 'error');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'warning',
      confirmed: 'info',
      processing: 'primary',
      shipped: 'secondary',
      delivered: 'success',
      cancelled: 'error'
    };
    return colors[status] || 'default';
  };

  const getStatusLabel = (status) => {
    const labels = {
      pending: 'En attente',
      confirmed: 'Confirmée',
      processing: 'En préparation',
      shipped: 'Expédiée',
      delivered: 'Livrée',
      cancelled: 'Annulée'
    };
    return labels[status] || status;
  };

  const canCancelOrder = (order) => {
    return ['pending', 'confirmed'].includes(order.status);
  };

  const handleCancelOrderRequest = (order) => {
    setOrderToCancel(order);
    setConfirmOpen(true);
  };

  const handleCancelOrderConfirm = async () => {
    if (!orderToCancel) return;
    
    try {
      setCancelLoading(true);
      await orderService.updateStatus(orderToCancel.id, 'cancelled');
      showNotification('Commande annulée avec succès', 'success');
      await fetchOrders();
      setDetailsOpen(false);
      setConfirmOpen(false);
      setOrderToCancel(null);
    } catch (error) {
      showNotification('Erreur lors de l\'annulation', 'error');
    } finally {
      setCancelLoading(false);
    }
  };

  const handleCancelOrderCancel = () => {
    setConfirmOpen(false);
    setOrderToCancel(null);
  };

  const handleViewDetails = (order) => {
    setSelectedOrder(order);
    setDetailsOpen(true);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!user) {
    return (
      <Alert severity="info">
        Connectez-vous pour voir vos commandes
      </Alert>
    );
  }

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (orders.length === 0) {
    return (
      <Alert severity="info">
        Vous n'avez pas encore passé de commande
      </Alert>
    );
  }

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Mes commandes ({orders.length})
      </Typography>

      <Grid container spacing={2}>
        {orders.map((order) => (
          <Grid item xs={12} key={order.id}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <Box>
                    <Typography variant="h6" gutterBottom>
                      Commande #{order.orderNumber}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {formatDate(order.createdAt)}
                    </Typography>
                  </Box>
                  <Chip 
                    label={getStatusLabel(order.status)} 
                    color={getStatusColor(order.status)} 
                    size="small"
                  />
                </Box>

                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    {order.OrderItems?.length || 0} article(s) • {order.totalAmount}€
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Paiement: {order.paymentMethod} • {order.paymentStatus}
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button 
                    variant="outlined" 
                    size="small"
                    onClick={() => handleViewDetails(order)}
                  >
                    Détails
                  </Button>
                  {canCancelOrder(order) && (
                    <Button 
                      variant="outlined" 
                      color="error" 
                      size="small"
                      onClick={() => handleCancelOrderRequest(order)}
                    >
                      Annuler
                    </Button>
                  )}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog 
        open={detailsOpen} 
        onClose={() => setDetailsOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          Détails commande #{selectedOrder?.orderNumber}
        </DialogTitle>
        <DialogContent dividers>
          {selectedOrder && (
            <Box>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Typography variant="h6" gutterBottom>Informations</Typography>
                  <Typography variant="body2">
                    <strong>Date:</strong> {formatDate(selectedOrder.createdAt)}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Statut:</strong> 
                    <Chip 
                      label={getStatusLabel(selectedOrder.status)} 
                      color={getStatusColor(selectedOrder.status)} 
                      size="small"
                      sx={{ ml: 1 }}
                    />
                  </Typography>
                  <Typography variant="body2">
                    <strong>Total:</strong> {selectedOrder.totalAmount}€
                  </Typography>
                  <Typography variant="body2">
                    <strong>Paiement:</strong> {selectedOrder.paymentMethod} ({selectedOrder.paymentStatus})
                  </Typography>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <Typography variant="h6" gutterBottom>Adresse de livraison</Typography>
                  {selectedOrder.shippingAddress && (
                    <Box>
                      <Typography variant="body2">
                        {selectedOrder.shippingAddress.firstName} {selectedOrder.shippingAddress.lastName}
                      </Typography>
                      <Typography variant="body2">
                        {selectedOrder.shippingAddress.address}
                      </Typography>
                      <Typography variant="body2">
                        {selectedOrder.shippingAddress.postalCode} {selectedOrder.shippingAddress.city}
                      </Typography>
                      <Typography variant="body2">
                        {selectedOrder.shippingAddress.country}
                      </Typography>
                    </Box>
                  )}
                </Grid>
              </Grid>

              <Divider sx={{ my: 3 }} />

              <Typography variant="h6" gutterBottom>Articles commandés</Typography>
              <List>
                {selectedOrder.OrderItems?.map((item, index) => (
                  <ListItem key={index} divider>
                    <Avatar 
                      src={item.ProductVariant?.Product?.images?.[0] || 'https://via.placeholder.com/50?text=No+Image'} 
                      variant="square" 
                      sx={{ mr: 2 }} 
                    />
                    <ListItemText
                      primary={`${item.ProductVariant?.Product?.name || 'Produit'} (Taille: ${item.ProductVariant?.size || 'N/A'})`}
                      secondary={`${item.ProductVariant?.Product?.brand || ''} • ${item.quantity} x ${item.unitPrice}€`}
                    />
                    <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                      {item.totalPrice}€
                    </Typography>
                  </ListItem>
                ))}
              </List>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          {selectedOrder && canCancelOrder(selectedOrder) && (
            <Button 
              color="error"
              onClick={() => handleCancelOrderRequest(selectedOrder)}
            >
              Annuler la commande
            </Button>
          )}
          <Button onClick={() => setDetailsOpen(false)}>
            Fermer
          </Button>
        </DialogActions>
      </Dialog>

      <ConfirmDialog
        open={confirmOpen}
        onClose={handleCancelOrderCancel}
        onConfirm={handleCancelOrderConfirm}
        title="Annuler la commande"
        message={orderToCancel ? 
          `Êtes-vous sûr de vouloir annuler la commande #${orderToCancel.orderNumber} ?` : 
          'Êtes-vous sûr de vouloir annuler cette commande ?'
        }
        confirmText="Oui, annuler"
        cancelText="Non, conserver"
        severity="error"
        loading={cancelLoading}
        irreversible={true}
      />
    </Box>
  );
};

export default OrdersList;
