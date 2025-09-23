import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Card, 
  CardMedia, 
  CardContent, 
  Container,
  IconButton
} from '@mui/material';
import { 
  ShoppingCart
} from '@mui/icons-material';
import { productService } from '../services/api';

const FeaturedProducts = ({ onProductClick }) => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        // Récupérer les 4 premiers produits comme produits vedettes
        const response = await productService.getAll({ limit: 4, sortBy: 'newest' });
        setFeaturedProducts(response.data.products || []);
      } catch (error) {
        console.error('Erreur lors du chargement des produits vedettes:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedProducts();
  }, []);

  const getProductImage = (product) => {
    if (product.images && product.images.length > 0) {
      return product.images[0];
    }
    
    const fallbackImages = {
      'Nike': 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300&h=300&fit=crop&auto=format&q=80',
      'Jordan': 'https://images.unsplash.com/photo-1556906781-9a412961c28c?w=300&h=300&fit=crop&auto=format&q=80',
      'Adidas': 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=300&h=300&fit=crop&auto=format&q=80',
      'New Balance': 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=300&h=300&fit=crop&auto=format&q=80',
      'ASICS': 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=300&h=300&fit=crop&auto=format&q=80'
    };
    
    return fallbackImages[product.brand] || fallbackImages['Nike'];
  };

  if (loading || featuredProducts.length === 0) {
    return null;
  }

  return (
    <Box sx={{ py: 8, bgcolor: 'grey.50' }}>
      <Container maxWidth="lg">
        {/* Header simplifié */}
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography 
            variant="h4" 
            sx={{ 
              fontWeight: 700, 
              mb: 1,
              color: '#2d3748',
              fontSize: { xs: '1.5rem', md: '2rem' }
            }}
          >
            Sélection du Moment
          </Typography>
        </Box>

        {/* Grille de produits simplifiée */}
        <Box 
          sx={{ 
            display: 'grid',
            gridTemplateColumns: { 
              xs: 'repeat(2, 1fr)', 
              md: 'repeat(4, 1fr)' 
            },
            gap: 3,
            px: { xs: 2, md: 0 }
          }}
        >
          {featuredProducts.map((product, index) => (
              <Card
                key={product.id}
                sx={{
                  height: 350,
                  display: 'flex',
                  flexDirection: 'column',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: '0 12px 24px rgba(0,0,0,0.15)'
                  },
                  animation: `fadeInUp 0.6s ease ${index * 0.1}s both`
                }}
                onClick={() => onProductClick && onProductClick(product)}
              >
                <Box sx={{ position: 'relative' }}>
                  <CardMedia
                    component="img"
                    image={getProductImage(product)}
                    alt={`${product.brand} ${product.name}`}
                    sx={{
                      height: 200,
                      objectFit: 'cover',
                      backgroundColor: '#f8f9fa'
                    }}
                  />
                </Box>

                <CardContent sx={{ flexGrow: 1, p: 2 }}>
                  <Typography 
                    variant="caption" 
                    sx={{ 
                      color: 'primary.main',
                      fontWeight: 600,
                      textTransform: 'uppercase',
                      letterSpacing: 1
                    }}
                  >
                    {product.brand}
                  </Typography>
                  
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      fontWeight: 600,
                      fontSize: '0.9rem',
                      lineHeight: 1.3,
                      height: '2.6em',
                      overflow: 'hidden',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      mb: 1
                    }}
                  >
                    {product.name}
                  </Typography>

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
                    <Typography 
                      variant="h6" 
                      sx={{ 
                        fontWeight: 700,
                        color: '#2d3748'
                      }}
                    >
                      {product.basePrice}€
                    </Typography>
                    
                    <IconButton
                      size="small"
                      sx={{
                        bgcolor: 'primary.main',
                        color: 'white',
                        '&:hover': { bgcolor: 'primary.dark' }
                      }}
                    >
                      <ShoppingCart fontSize="small" />
                    </IconButton>
                  </Box>
                </CardContent>
              </Card>
            ))}
        </Box>
      </Container>

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </Box>
  );
};

export default FeaturedProducts;
