import React, { createContext, useContext, useState, useEffect } from 'react';
import { cartService } from '../services/api';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState({ items: [], total: 0, count: 0 });
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const getLocalCart = () => {
    const localCart = localStorage.getItem('anonymousCart');
    return localCart ? JSON.parse(localCart) : { items: [], total: 0, count: 0 };
  };

  const saveLocalCart = (cartData) => {
    localStorage.setItem('anonymousCart', JSON.stringify(cartData));
  };

  const migrateAnonymousCart = async () => {
    const localCart = getLocalCart();
    if (localCart.items.length === 0) return;

    try {
      for (const item of localCart.items) {
        await cartService.add(item.productVariantId, item.quantity);
      }
      localStorage.removeItem('anonymousCart');
      console.log('Panier anonyme migré avec succès');
    } catch (error) {
      console.error('Erreur lors de la migration du panier:', error);
    }
  };

  const fetchCart = async () => {
    if (!user) {
      setCart(getLocalCart());
      return;
    }
    try {
      setLoading(true);
      
      // Migrer le panier anonyme si l'utilisateur vient de se connecter
      await migrateAnonymousCart();
      
      const response = await cartService.get();
      setCart(response.data);
    } catch (error) {
      console.error('Failed to fetch cart:', error);
      setCart(getLocalCart());
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (productVariantId, quantity = 1, productInfo = null) => {
    if (user) {
      try {
        await cartService.add(productVariantId, quantity);
        await fetchCart();
        return { success: true };
      } catch (error) {
        return { success: false, error: error.response?.data?.error || 'Failed to add to cart' };
      }
    } else {
      // Panier anonyme (localStorage)
      const currentCart = getLocalCart();
      const existingItemIndex = currentCart.items.findIndex(
        item => item.productVariantId === productVariantId
      );

      if (existingItemIndex >= 0) {
        currentCart.items[existingItemIndex].quantity += quantity;
      } else {
        currentCart.items.push({
          id: Date.now().toString(),
          productVariantId,
          quantity,
          productInfo
        });
      }

      // Recalculer total et count
      currentCart.count = currentCart.items.reduce((sum, item) => sum + item.quantity, 0);
      currentCart.total = currentCart.items.reduce((sum, item) => {
        const price = item.productInfo?.basePrice || 0;
        return sum + (item.quantity * price);
      }, 0);

      saveLocalCart(currentCart);
      setCart(currentCart);
      return { success: true };
    }
  };

  const updateCart = async (id, quantity) => {
    try {
      await cartService.update(id, quantity);
      await fetchCart();
      return { success: true };
    } catch (error) {
      return { success: false, error: error.response?.data?.error || 'Failed to update cart' };
    }
  };

  const removeFromCart = async (id) => {
    try {
      await cartService.remove(id);
      await fetchCart();
      return { success: true };
    } catch (error) {
      return { success: false, error: error.response?.data?.error || 'Failed to remove from cart' };
    }
  };

  useEffect(() => {
    fetchCart();
  }, [user]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <CartContext.Provider value={{
      cart,
      loading,
      addToCart,
      updateCart,
      removeFromCart,
      fetchCart
    }}>
      {children}
    </CartContext.Provider>
  );
};
