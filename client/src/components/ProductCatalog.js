import React, { useState, useEffect } from 'react';
import { Grid, Card, CardMedia, CardContent, Typography, Button, Chip, Box, CircularProgress, Alert } from '@mui/material';
import { productService } from '../services/api';

const ProductCatalog = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
              
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Tailles disponibles: {product.ProductVariants?.map(v => v.size).join(', ')}
              </Typography>
              
              <Button 
                variant="contained" 
                fullWidth
                disabled={!product.ProductVariants?.some(v => v.stock > 0)}
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
