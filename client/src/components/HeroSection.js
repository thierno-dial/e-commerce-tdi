import React from 'react';
import { Box, Typography, Button, Container, Grid, Chip } from '@mui/material';
import { ShoppingBag, TrendingUp, Verified } from '@mui/icons-material';

const HeroSection = ({ onShopNow, onShowOffers }) => {
  return (
    <Box
      component="section"
      role="banner"
      aria-label="Section d'accueil avec présentation de la collection sneakers"
      sx={{
        background: 'linear-gradient(135deg, #1a1a1a 0%, #2d3748 100%)',
        color: 'white',
        py: { xs: 8, md: 12 },
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.03"%3E%3Cpath d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
        }
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4} alignItems="center">
          <Grid item xs={12} md={7}>
            <Box sx={{ position: 'relative', zIndex: 1 }}>
              {/* Badge tendance */}
              <Chip
                icon={<TrendingUp />}
                label="Collection Automne 2025"
                sx={{
                  backgroundColor: 'rgba(255, 107, 53, 0.9)',
                  color: 'white',
                  fontWeight: 600,
                  mb: 3,
                  '& .MuiChip-icon': { color: 'white' }
                }}
              />
              
              <Typography
                variant="h1"
                component="h1"
                sx={{
                  fontSize: { xs: '2.5rem', md: '3.5rem', lg: '4rem' },
                  fontWeight: 800,
                  mb: 2,
                  background: 'linear-gradient(45deg, #ffffff 30%, #ffd700 90%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  lineHeight: 1.1,
                  fontFamily: '"Poppins", "Inter", sans-serif'
                }}
              >
                Sneakers
                <br />
                <span style={{ color: '#ffd700' }}>Authentiques</span>
              </Typography>
              
              <Typography
                variant="h5"
                sx={{
                  mb: 4,
                  opacity: 0.9,
                  fontWeight: 400,
                  maxWidth: '600px',
                  lineHeight: 1.6
                }}
              >
                <strong>100+ références</strong> pour <strong>Hommes, Femmes & Enfants</strong>. 
                Gestion professionnelle des stocks par taille (EU, UK, US). 
                Des marques iconiques aux labels émergents. Qualité e-commerce premium.
              </Typography>
              
              {/* Points clés */}
              <Box sx={{ display: 'flex', gap: 3, mb: 4, flexWrap: 'wrap' }}>
                {[
                  { icon: <Verified />, text: '3 catégories' },
                  { icon: <ShoppingBag />, text: 'Stock temps réel' },
                  { icon: <TrendingUp />, text: 'Toutes tailles' }
                ].map((item, index) => (
                  <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box sx={{ color: '#ffd700' }}>{item.icon}</Box>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      {item.text}
                    </Typography>
                  </Box>
                ))}
              </Box>
              
              {/* CTA Buttons */}
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <Button
                  variant="contained"
                  size="large"
                  onClick={onShopNow}
                  aria-label="Découvrir notre collection de sneakers premium"
                  sx={{
                    backgroundColor: '#ff6b35',
                    color: 'white',
                    px: 4,
                    py: 1.5,
                    fontSize: '1.1rem',
                    fontWeight: 600,
                    borderRadius: '12px',
                    '&:hover': {
                      backgroundColor: '#e64a19',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 8px 25px rgba(255, 107, 53, 0.3)'
                    }
                  }}
                >
                  Découvrir la collection
                </Button>
                
                <Button
                  variant="outlined"
                  size="large"
                  onClick={onShowOffers}
                  aria-label="Voir les offres spéciales et nouveautés"
                  sx={{
                    borderColor: 'white',
                    color: 'white',
                    px: 4,
                    py: 1.5,
                    fontSize: '1.1rem',
                    fontWeight: 600,
                    borderRadius: '12px',
                    '&:hover': {
                      borderColor: '#ffd700',
                      color: '#ffd700',
                      backgroundColor: 'rgba(255, 215, 0, 0.1)',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 8px 25px rgba(255, 215, 0, 0.2)'
                    }
                  }}
                >
                  🔥 Nouveautés
                </Button>
              </Box>
            </Box>
          </Grid>
          
          <Grid item xs={12} md={5}>
            <Box
              sx={{
                position: 'relative',
                textAlign: 'center',
                zIndex: 1
              }}
            >
              {/* Illustration sneakers stylisée */}
              <Box
                sx={{
                  fontSize: { xs: '8rem', md: '12rem' },
                  lineHeight: 1,
                  opacity: 0.9,
                  filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.3))',
                  animation: 'float 3s ease-in-out infinite',
                  '@keyframes float': {
                    '0%, 100%': { transform: 'translateY(0px)' },
                    '50%': { transform: 'translateY(-10px)' }
                  }
                }}
                role="img"
                aria-label="Illustration de sneaker premium"
              >
                👟
              </Box>
              
              {/* Badges flottants */}
              <Box
                sx={{
                  position: 'absolute',
                  top: '20%',
                  right: '10%',
                  animation: 'pulse 2s ease-in-out infinite'
                }}
              >
                <Chip
                  label="Nouveau"
                  sx={{
                    backgroundColor: '#ffd700',
                    color: '#1a1a1a',
                    fontWeight: 600,
                    fontSize: '0.8rem'
                  }}
                />
              </Box>
              
              <Box
                sx={{
                  position: 'absolute',
                  bottom: '30%',
                  left: '5%',
                  animation: 'pulse 2s ease-in-out infinite 1s'
                }}
              >
                <Chip
                  label="-20%"
                  sx={{
                    backgroundColor: '#ff6b35',
                    color: 'white',
                    fontWeight: 600,
                    fontSize: '0.9rem'
                  }}
                />
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Container>
      
      {/* Section Statistiques */}
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Grid container spacing={4} justifyContent="center">
          <Grid item xs={6} md={3} textAlign="center">
            <Typography variant="h3" sx={{ fontWeight: 800, color: '#ffd700', mb: 1 }}>
              100+
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.8 }}>
              Références
            </Typography>
          </Grid>
          <Grid item xs={6} md={3} textAlign="center">
            <Typography variant="h3" sx={{ fontWeight: 800, color: '#ffd700', mb: 1 }}>
              3
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.8 }}>
              Catégories
            </Typography>
          </Grid>
          <Grid item xs={6} md={3} textAlign="center">
            <Typography variant="h3" sx={{ fontWeight: 800, color: '#ffd700', mb: 1 }}>
              24/7
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.8 }}>
              Stock temps réel
            </Typography>
          </Grid>
          <Grid item xs={6} md={3} textAlign="center">
            <Typography variant="h3" sx={{ fontWeight: 800, color: '#ffd700', mb: 1 }}>
              RGPD
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.8 }}>
              Conformité
            </Typography>
          </Grid>
        </Grid>
      </Container>
      
      {/* Section Catégories */}
      <Container maxWidth="lg" sx={{ py: 6, textAlign: 'center' }}>
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 4, color: 'white' }}>
          Pour Toute la Famille
        </Typography>
        <Box sx={{ display: 'flex', gap: 3, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Box sx={{ 
            flex: '1 1 300px',
            maxWidth: '350px',
            minWidth: '280px',
            p: 3, 
            borderRadius: 3, 
            bgcolor: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            transition: 'all 0.3s ease',
            '&:hover': {
              transform: 'translateY(-5px)',
              bgcolor: 'rgba(255, 255, 255, 0.15)',
              boxShadow: '0 10px 30px rgba(0,0,0,0.3)'
            }
          }}>
            <Typography variant="h2" sx={{ mb: 2 }}>👩</Typography>
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 2, color: 'white' }}>
              Femmes
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9, color: 'white' }}>
              Style et confort réunis
            </Typography>
          </Box>
          <Box sx={{ 
            flex: '1 1 300px',
            maxWidth: '350px',
            minWidth: '280px',
            p: 3, 
            borderRadius: 3, 
            bgcolor: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            transition: 'all 0.3s ease',
            '&:hover': {
              transform: 'translateY(-5px)',
              bgcolor: 'rgba(255, 255, 255, 0.15)',
              boxShadow: '0 10px 30px rgba(0,0,0,0.3)'
            }
          }}>
            <Typography variant="h2" sx={{ mb: 2 }}>👨</Typography>
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 2, color: 'white' }}>
              Hommes
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9, color: 'white' }}>
              Sneakers urbaines et sportives
            </Typography>
          </Box>
          <Box sx={{ 
            flex: '1 1 300px',
            maxWidth: '350px',
            minWidth: '280px',
            p: 3, 
            borderRadius: 3, 
            bgcolor: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            transition: 'all 0.3s ease',
            '&:hover': {
              transform: 'translateY(-5px)',
              bgcolor: 'rgba(255, 255, 255, 0.15)',
              boxShadow: '0 10px 30px rgba(0,0,0,0.3)'
            }
          }}>
            <Typography variant="h2" sx={{ mb: 2 }}>🧒</Typography>
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 2, color: 'white' }}>
              Enfants
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9, color: 'white' }}>
              Qualité et sécurité
            </Typography>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default HeroSection;
