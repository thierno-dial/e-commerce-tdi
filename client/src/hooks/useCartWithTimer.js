import { useCallback } from 'react';
import { useCart } from '../contexts/CartContext';
import { useCartTimer } from '../contexts/CartTimerContext';

/**
 * Hook personnalisé qui combine les fonctionnalités du panier avec le timer
 * Prolonge automatiquement le timer lors d'ajout d'articles
 */
export const useCartWithTimer = () => {
  const cart = useCart();
  const { extendOnAddItem } = useCartTimer();

  // Wrapper pour addToCart qui prolonge automatiquement le timer
  const addToCartWithTimer = useCallback(async (...args) => {
    console.log('🛒 addToCartWithTimer appelé avec:', args);
    try {
      // Ajouter l'article au panier
      console.log('Ajout au panier...');
      const result = await cart.addToCart(...args);
      console.log('Résultat addToCart:', result);
      
      if (result.success) {
        // Prolonger automatiquement le timer après un petit délai
        // pour s'assurer que le panier est mis à jour
        console.log('Succès ! Appel de extendOnAddItem dans 100ms...');
        setTimeout(() => {
          console.log('🕐 Délai écoulé, appel de extendOnAddItem maintenant');
          extendOnAddItem();
        }, 100);
      } else {
        console.log('Échec de l\'ajout au panier:', result.error);
      }
      
      return result;
    } catch (error) {
      console.error('Erreur lors de l\'ajout au panier avec timer:', error);
      return { success: false, error: error.message };
    }
  }, [cart.addToCart, extendOnAddItem]);

  return {
    ...cart,
    addToCart: addToCartWithTimer
  };
};

export default useCartWithTimer;
