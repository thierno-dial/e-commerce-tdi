import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useCart } from './CartContext';
import { useNotification } from './NotificationContext';

const CartTimerContext = createContext();

export const useCartTimer = () => {
  const context = useContext(CartTimerContext);
  if (!context) {
    throw new Error('useCartTimer must be used within a CartTimerProvider');
  }
  return context;
};

export const CartTimerProvider = ({ children }) => {
  // Timer réduit pour les tests (2 minutes)
  const CART_DURATION = 2 * 60; // 2 minutes pour les tests
  const WARNING_THRESHOLD = 30; // Avertissement à 30 secondes pour les tests
  
  const [timeRemaining, setTimeRemaining] = useState(null);
  const [isActive, setIsActive] = useState(false);
  const [lastActivity, setLastActivity] = useState(Date.now());
  const [showWarning, setShowWarning] = useState(false);
  const [isExpired, setIsExpired] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [pausedTimeRemaining, setPausedTimeRemaining] = useState(null);
  
  const { cart, clearCart } = useCart();
  const { showNotification } = useNotification();
  
  // Sécuriser l'accès aux items du panier
  const cartItems = cart?.items || [];

  // Fonction pour démarrer le timer
  const startTimer = useCallback(() => {
    console.log('🚀 startTimer appelé - Démarrage du timer pour', CART_DURATION, 'secondes');
    const startTime = Date.now();
    setTimeRemaining(CART_DURATION);
    setIsActive(true);
    setIsExpired(false);
    setShowWarning(false);
    setLastActivity(startTime);
    
    // Stocker dans localStorage pour persistance
    localStorage.setItem('cartTimerStart', startTime.toString());
    localStorage.setItem('cartTimerDuration', CART_DURATION.toString());
    
    console.log('✅ Timer démarré avec succès');
  }, [CART_DURATION]);

  // Fonction pour prolonger le timer
  const extendTimer = useCallback(() => {
    console.log('⏰ extendTimer appelé - Prolongation de', CART_DURATION, 'secondes');
    const now = Date.now();
    setTimeRemaining(CART_DURATION);
    setShowWarning(false);
    setIsExpired(false);
    setLastActivity(now);
    
    // Mettre à jour localStorage
    localStorage.setItem('cartTimerStart', now.toString());
    localStorage.setItem('cartTimerDuration', CART_DURATION.toString());
    
    console.log('✅ Timer prolongé avec succès');
    
    showNotification('⏰ Panier prolongé de 15 minutes !', 'success');
  }, [CART_DURATION, showNotification]);

  // Fonction pour arrêter le timer
  const stopTimer = useCallback(() => {
    setIsActive(false);
    setTimeRemaining(null);
    setShowWarning(false);
    setIsExpired(false);
    setIsPaused(false);
    setPausedTimeRemaining(null);
    
    // Nettoyer localStorage
    localStorage.removeItem('cartTimerStart');
    localStorage.removeItem('cartTimerDuration');
    localStorage.removeItem('cartTimerPaused');
    localStorage.removeItem('cartTimerPausedTime');
  }, []);

  // Fonction pour mettre en pause le timer
  const pauseTimer = useCallback(() => {
    if (isActive && !isPaused && timeRemaining !== null) {
      console.log('⏸️ Mise en pause du timer avec', timeRemaining, 'secondes restantes');
      setIsPaused(true);
      setPausedTimeRemaining(timeRemaining);
      
      // Sauvegarder l'état de pause
      localStorage.setItem('cartTimerPaused', 'true');
      localStorage.setItem('cartTimerPausedTime', timeRemaining.toString());
      
      showNotification('⏸️ Timer mis en pause pendant votre commande', 'info');
      return true;
    }
    return false;
  }, [isActive, isPaused, timeRemaining, showNotification]);

  // Fonction pour reprendre le timer
  const resumeTimer = useCallback(() => {
    if (isPaused && pausedTimeRemaining !== null) {
      console.log('▶️ Reprise du timer avec', pausedTimeRemaining, 'secondes restantes');
      
      const now = Date.now();
      setTimeRemaining(pausedTimeRemaining);
      setIsPaused(false);
      setPausedTimeRemaining(null);
      setLastActivity(now);
      
      // Mettre à jour localStorage avec le nouveau départ
      localStorage.setItem('cartTimerStart', now.toString());
      localStorage.setItem('cartTimerDuration', pausedTimeRemaining.toString());
      localStorage.removeItem('cartTimerPaused');
      localStorage.removeItem('cartTimerPausedTime');
      
      showNotification('▶️ Timer repris', 'info');
      return true;
    }
    return false;
  }, [isPaused, pausedTimeRemaining, showNotification]);

  // Fonction pour formater le temps restant
  const formatTime = useCallback((seconds) => {
    if (!seconds || seconds <= 0) return '00:00';
    
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  }, []);

  // Restaurer le timer depuis localStorage au chargement
  useEffect(() => {
    if (!cart) {
      console.log('🔄 Restauration timer: cart pas encore chargé');
      return; // Attendre que le cart soit chargé
    }

    console.log('🔄 Tentative de restauration du timer...');
    const savedStart = localStorage.getItem('cartTimerStart');
    const savedDuration = localStorage.getItem('cartTimerDuration');
    console.log('   - savedStart:', savedStart);
    console.log('   - savedDuration:', savedDuration);
    console.log('   - cartItems.length:', cartItems.length);
    console.log('   - isActive actuel:', isActive);
    
    // Si le timer est déjà actif, ne pas le redémarrer
    if (isActive) {
      console.log('⚠️ Timer déjà actif, pas de restauration');
      return;
    }
    
    // Vérifier d'abord s'il y a un timer en pause
    const isPausedSaved = localStorage.getItem('cartTimerPaused') === 'true';
    const pausedTime = localStorage.getItem('cartTimerPausedTime');
    
    if (isPausedSaved && pausedTime && cartItems.length > 0) {
      console.log('✅ Restauration du timer EN PAUSE avec', pausedTime, 'secondes');
      setTimeRemaining(parseInt(pausedTime));
      setIsActive(true);
      setIsPaused(true);
      setPausedTimeRemaining(parseInt(pausedTime));
      setLastActivity(Date.now());
    } else if (savedStart && savedDuration && cartItems.length > 0) {
      const startTime = parseInt(savedStart);
      const duration = parseInt(savedDuration);
      const elapsed = Math.floor((Date.now() - startTime) / 1000);
      const remaining = duration - elapsed;
      
      console.log('   - remaining:', remaining);
      
      if (remaining > 0) {
        console.log('✅ Restauration du timer avec', remaining, 'secondes restantes');
        setTimeRemaining(remaining);
        setIsActive(true);
        setLastActivity(startTime);
        
        // Vérifier si on doit afficher le warning
        if (remaining <= WARNING_THRESHOLD) {
          setShowWarning(true);
        }
      } else {
        // Timer expiré - vider le panier
        console.log('💀 Timer expiré lors de la restauration - Vidage du panier');
        setIsExpired(true);
        setIsActive(false);
        if (clearCart) {
          clearCart();
        }
        localStorage.removeItem('cartTimerStart');
        localStorage.removeItem('cartTimerDuration');
      }
    } else if (cartItems.length > 0 && !savedStart) {
      console.log('❌ Panier avec articles mais pas de timer sauvegardé - Possible perte de timer');
      // Ne pas démarrer automatiquement ici, laisser extendOnAddItem le faire
    } else {
      console.log('❌ Pas de timer à restaurer ou panier vide');
    }
  }, [cart, cartItems.length, WARNING_THRESHOLD, clearCart, isActive]);

  // Arrêter le timer automatiquement quand le panier est vide
  useEffect(() => {
    if (!cart) return; // Attendre que le cart soit chargé

    // Arrêter le timer seulement si le panier est vide ET que le timer est actif
    if (cartItems.length === 0 && isActive) {
      console.log('🛑 Arrêt du timer (panier vide)');
      stopTimer();
    }
    
    // Note: Le démarrage du timer est maintenant géré uniquement par extendOnAddItem
  }, [cart, cartItems.length, isActive, stopTimer]);

  // Gestion du décompte (seulement si pas en pause)
  useEffect(() => {
    if (!isActive || timeRemaining === null || isPaused) return;

    const interval = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          // Timer expiré - supprimer les articles du panier
          console.log('⏰ TIMER EXPIRÉ - Vidage du panier');
          setIsActive(false);
          setIsExpired(true);
          setShowWarning(false);
          
          // Vider le panier
          if (clearCart) {
            console.log('Appel de clearCart()');
            clearCart().then((result) => {
              console.log('Résultat clearCart:', result);
              if (result.success) {
                console.log('✅ Panier vidé avec succès');
              } else {
                console.error('❌ Échec du vidage du panier:', result.error);
              }
            }).catch((error) => {
              console.error('❌ Erreur lors du vidage du panier:', error);
            });
          } else {
            console.error('❌ clearCart non disponible');
          }
          
          showNotification('⏰ Temps écoulé ! Votre panier a été vidé.', 'error');
          
          // Nettoyer localStorage
          localStorage.removeItem('cartTimerStart');
          localStorage.removeItem('cartTimerDuration');
          
          return 0;
        }
        
        // Afficher l'avertissement à 5 minutes
        if (prev <= WARNING_THRESHOLD && !showWarning) {
          setShowWarning(true);
          showNotification('⚠️ Attention ! Votre panier expire dans 5 minutes', 'warning');
        }
        
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isActive, timeRemaining, isPaused, showWarning, WARNING_THRESHOLD, showNotification]);

  // Mettre à jour l'activité utilisateur
  const updateActivity = useCallback(() => {
    setLastActivity(Date.now());
  }, []);

  // Écouter les événements d'activité utilisateur
  useEffect(() => {
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
    
    const handleActivity = () => {
      updateActivity();
    };

    events.forEach(event => {
      document.addEventListener(event, handleActivity, true);
    });

    return () => {
      events.forEach(event => {
        document.removeEventListener(event, handleActivity, true);
      });
    };
  }, [updateActivity]);

  // Fonction pour prolonger automatiquement le timer lors d'ajout d'article
  const extendOnAddItem = useCallback(() => {
    console.log('🔔 extendOnAddItem appelé');
    console.log('   - isActive:', isActive);
    console.log('   - isExpired:', isExpired);
    console.log('   - timeRemaining:', timeRemaining);
    console.log('   - cartItems:', cartItems.length);
    
    if (isActive && !isExpired && timeRemaining !== null) {
      // Si le timer est actif, le prolonger
      console.log('⏰ Timer actif -> Prolongation automatique');
      extendTimer();
      showNotification('⏰ Timer prolongé automatiquement (+2 min)', 'success');
    } else if (!isActive || timeRemaining === null) {
      // Si pas de timer actif, démarrer un nouveau timer
      console.log('🚀 Pas de timer actif -> Démarrage du timer');
      startTimer();
    } else if (isExpired) {
      console.log('💀 Timer expiré -> Redémarrage du timer');
      setIsExpired(false);
      startTimer();
    } else {
      console.log('❌ Conditions non remplies pour démarrer/prolonger le timer');
      console.log('   - État actuel non géré');
    }
  }, [isActive, isExpired, timeRemaining, cartItems.length, extendTimer, startTimer, showNotification]);

  // Fonction pour récupérer un timer perdu (par exemple après connexion)
  const recoverLostTimer = useCallback(() => {
    console.log('🔄 Tentative de récupération du timer perdu...');
    
    if (cartItems.length > 0 && !isActive) {
      const savedStart = localStorage.getItem('cartTimerStart');
      const savedDuration = localStorage.getItem('cartTimerDuration');
      
      if (savedStart && savedDuration) {
        const startTime = parseInt(savedStart);
        const duration = parseInt(savedDuration);
        const elapsed = Math.floor((Date.now() - startTime) / 1000);
        const remaining = duration - elapsed;
        
        if (remaining > 0) {
          console.log('✅ Timer récupéré avec', remaining, 'secondes restantes');
          setTimeRemaining(remaining);
          setIsActive(true);
          setLastActivity(startTime);
          
          if (remaining <= WARNING_THRESHOLD) {
            setShowWarning(true);
          }
          
          showNotification('⏰ Timer récupéré après connexion', 'info');
          return true;
        }
      }
      
      // Si pas de timer sauvegardé, en démarrer un nouveau
      console.log('🚀 Pas de timer sauvegardé -> Nouveau timer');
      startTimer();
      return true;
    }
    
    console.log('❌ Impossible de récupérer le timer');
    return false;
  }, [cartItems.length, isActive, WARNING_THRESHOLD, startTimer, showNotification]);

  const value = {
    timeRemaining,
    isActive,
    isExpired,
    isPaused,
    showWarning,
    lastActivity,
    startTimer,
    extendTimer,
    extendOnAddItem,
    recoverLostTimer,
    pauseTimer,
    resumeTimer,
    stopTimer,
    formatTime,
    updateActivity,
    CART_DURATION,
    WARNING_THRESHOLD
  };

  return (
    <CartTimerContext.Provider value={value}>
      {children}
    </CartTimerContext.Provider>
  );
};

export default CartTimerContext;
