import React, { useState, useEffect } from 'react';
import { Grid, Card, CardMedia, CardContent, Typography, Button, Chip, Box, CircularProgress, Alert, Select, MenuItem, FormControl } from '@mui/material';
import { productService } from '../services/api';
import { useCart } from '../contexts/CartContext';
import { useNotification } from '../contexts/NotificationContext';

const ProductCatalog = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedVariants, setSelectedVariants] = useState({});
  const [variantErrors, setVariantErrors] = useState({});
  const { addToCart } = useCart();
  const { showNotification } = useNotification();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await productService.getAll();
        setProducts(response.data.products);
      } catch (err) {
        setError('Erreur lors du chargement des produits');
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const getCategoryColor = (category) => {
    const colors = { men: 'primary', women: 'secondary', kids: 'success' };
    return colors[category] || 'default';
  };

  const handleVariantChange = (productId, variantId) => {
    setSelectedVariants(prev => ({ ...prev, [productId]: variantId }));
    setVariantErrors(prev => ({ ...prev, [productId]: false }));
  };

  const handleAddToCart = async (product) => {
    const selectedVariantId = selectedVariants[product.id];
    if (!selectedVariantId) {
      setVariantErrors(prev => ({ ...prev, [product.id]: true }));
      showNotification('Veuillez sélectionner une taille', 'warning');
      return;
    }

    const selectedVariant = product.ProductVariants.find(v => v.id === selectedVariantId);
    const productInfo = {
      id: product.id,
      name: product.name,
      brand: product.brand,
      basePrice: product.basePrice,
      variant: selectedVariant
    };

    const result = await addToCart(selectedVariantId, 1, productInfo);
    if (result.success) {
      showNotification('Produit ajouté au panier !', 'success');
      setSelectedVariants(prev => ({ ...prev, [product.id]: '' }));
    } else {
      showNotification(result.error, 'error');
    }
  };

  const getCategoryLabel = (category) => {
    switch (category) {
      case 'men': return 'Homme';
      case 'women': return 'Femme';
      case 'kids': return 'Enfant';
      default: return category;
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" p={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        {error}
      </Alert>
    );
  }

  return (
    <Grid container spacing={3}>
      {products.map((product) => (
        <Grid item xs={12} sm={6} md={4} key={product.id}>
          <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <CardMedia
              component="div"
              sx={{
                height: 200,
                backgroundColor: '#f5f5f5',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Typography variant="h6" color="text.secondary">
                👟 {product.brand}
              </Typography>
            </CardMedia>
            
            <CardContent sx={{ flexGrow: 1 }}>
              <Box sx={{ mb: 2 }}>
                <Chip 
                  label={getCategoryLabel(product.category)}
                  color={getCategoryColor(product.category)}
                  size="small"
                />
              </Box>
              
              <Typography gutterBottom variant="h6" component="h2">
                {product.name}
              </Typography>
              
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                {product.brand}
              </Typography>
              
              <Typography variant="h6" color="primary" sx={{ mb: 2 }}>
                {product.basePrice}€
              </Typography>
              
              {product.ProductVariants && product.ProductVariants.length > 0 && (
                <Box sx={{ mb: 2 }}>
                  <FormControl fullWidth size="small" error={variantErrors[product.id]}>
                    <Select
                      value={selectedVariants[product.id] || ''}
                      onChange={(e) => handleVariantChange(product.id, e.target.value)}
                      displayEmpty
                    >
                      <MenuItem value="" disabled>Sélectionner une taille</MenuItem>
                      {product.ProductVariants
                        .filter(variant => variant.stock > 0)
                        .map(variant => (
                          <MenuItem key={variant.id} value={variant.id}>
                            {variant.size} ({variant.stock} en stock)
                          </MenuItem>
                        ))}
                    </Select>
                  </FormControl>
                </Box>
              )}
              
              <Button 
                variant="contained" 
                fullWidth
                disabled={!product.ProductVariants?.some(v => v.stock > 0)}
                onClick={() => handleAddToCart(product)}
              >
                {product.ProductVariants?.some(v => v.stock > 0) ? 'Ajouter au panier' : 'Rupture de stock'}
              </Button>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default ProductCatalog;
