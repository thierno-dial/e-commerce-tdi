# 🏪 ARCHITECTURE MULTI-VENDEURS - MARKETPLACE SNEAKERS

## 📋 Vue d'ensemble

Cette marketplace de sneakers implémente une **architecture multi-vendeurs complète** permettant à plusieurs sellers de vendre leurs produits sur la même plateforme, avec une isolation totale des données et des permissions granulaires.

## 🎯 Fonctionnalités Principales

### 👥 Rôles et Permissions

#### 👑 **ADMINISTRATEUR**
- **Produits** : Voir et gérer tous les produits de tous les sellers
- **Commandes** : Voir et gérer toutes les commandes de la marketplace
- **Dashboard** : Statistiques globales et gestion complète
- **Sellers** : Approuver/suspendre les sellers et gérer leurs statuts

#### 🏪 **SELLER**
- **Produits** : Voir uniquement ses propres produits (isolation complète)
- **Commandes** : Voir uniquement les commandes contenant ses produits
- **Dashboard** : Statistiques personnelles et gestion de ses produits
- **Isolation** : Aucun accès aux données des autres sellers

#### 👤 **CLIENT**
- **Catalogue** : Voir tous les produits avec information du seller
- **Commandes** : Voir uniquement ses propres commandes
- **Panier** : Acheter des produits de différents sellers dans la même commande

### 🔒 Isolation des Données

#### **Produits**
```javascript
// Sellers : API /products/my-products
GET /api/products/my-products → Filtrés par sellerId = req.user.id

// Admins : API /products  
GET /api/products → Tous les produits de tous les sellers
```

#### **Commandes**
```javascript
// Sellers : Commandes filtrées
- Voir uniquement les commandes contenant leurs produits
- Dans chaque commande, voir uniquement leurs articles

// Clients : Leurs commandes uniquement
- Voir toutes leurs commandes avec tous les articles (multi-sellers)

// Admins : Vue globale
- Voir toutes les commandes de tous les clients et sellers
```

## 🗄️ Structure de la Base de Données

### **Table `users`**
```sql
-- Champs seller ajoutés
seller_info JSON,              -- Informations business (nom, adresse, etc.)
seller_status ENUM,            -- 'pending', 'approved', 'suspended', 'rejected'  
seller_approved_at DATETIME    -- Date d'approbation
```

### **Table `products`**
```sql
-- Association seller
seller_id UUID NOT NULL,           -- Référence vers users(id)
seller_product_code VARCHAR(50),   -- Code unique par seller
commission_rate DECIMAL(5,4)       -- Taux de commission (ex: 0.1000 = 10%)
```

### **Index de Performance**
```sql
-- Optimisation des requêtes
INDEX idx_products_seller_id (seller_id)
INDEX idx_products_seller_active (seller_id, is_active) 
INDEX idx_products_seller_category (seller_id, category)
UNIQUE INDEX unique_seller_product_code (seller_id, seller_product_code)
```

## 🚀 API Endpoints

### **Produits**
```javascript
GET    /api/products              // Public : tous les produits avec info seller
GET    /api/products/my-products  // Seller : ses produits uniquement  
POST   /api/products              // Seller/Admin : créer (sellerId auto-assigné)
PUT    /api/products/:id          // Seller : modifier ses produits uniquement
DELETE /api/products/:id          // Seller : supprimer ses produits uniquement
```

### **Commandes**
```javascript
GET /api/orders                   // Filtrées selon le rôle :
                                  // - Customer : ses commandes
                                  // - Seller : commandes avec ses produits
                                  // - Admin : toutes les commandes

GET /api/orders/:id               // Avec filtrage selon les permissions
PUT /api/orders/:id/status        // Sellers : uniquement si leurs produits
```

### **Sellers**
```javascript
GET /api/sellers/me               // Seller : son profil
PUT /api/sellers/me               // Seller : modifier son profil  
GET /api/sellers                  // Admin : tous les sellers
PUT /api/sellers/:id/status       // Admin : modifier statut seller
```

## 🎨 Interface Utilisateur

### **Dashboard Seller**
```javascript
// Onglets dynamiques selon le rôle
- "Mes Produits" (sellers) / "Gestion Produits" (admins)
- "Gestion Commandes" (sellers/admins) 
- "Statistiques" (admins uniquement)

// Données filtrées automatiquement
fetchProducts() → user.role === 'seller' ? getMyProducts() : getAll()
```

### **Catalogue Public**
```javascript
// Affichage seller pour chaque produit
{product.Seller && (
  <Typography variant="caption" color="text.secondary">
    🏪 {product.Seller.sellerInfo?.businessName || 
         `${product.Seller.firstName} ${product.Seller.lastName}`}
  </Typography>
)}
```

### **Navigation Adaptative**
```javascript
// Icônes selon le rôle
- "Mes commandes" : clients uniquement
- "Dashboard" : admins et sellers uniquement
```

## 🔧 Fonctionnalités Techniques

### **Génération Automatique des Codes**
```javascript
// Chaque produit reçoit un code unique
const generateSellerProductCode = (name, brand) => {
  const nameCode = name.replace(/\s+/g, '').substring(0, 3).toUpperCase();
  const brandCode = brand.replace(/\s+/g, '').substring(0, 3).toUpperCase(); 
  const timestamp = Date.now().toString().slice(-4);
  return `${nameCode}-${brandCode}-${timestamp}`;
};

// Exemple : "Nike Air Max" + "Nike" → "NIK-NIK-1234"
```

### **Middleware d'Isolation**
```javascript
// Vérification automatique des permissions
requireRole(['seller', 'admin'])
verifyProductOwnership(sellerId)
filterOrdersBySeller(sellerId)
```

### **Transactions Atomiques**
```javascript
// Gestion cohérente des stocks multi-sellers
- Déduction de stock lors de la commande
- Restauration en cas d'annulation
- Vérification des permissions seller
```

## 📊 Données de Test

### **Sellers Configurés**

#### 🏪 **Sneakers Premium Store**
- **Email** : `seller@sneakers.com`
- **Mot de passe** : `seller123`
- **Produits** : 9 produits (477 unités en stock)
- **Spécialités** : Nike, Adidas, marques premium

#### 🏪 **Urban Style Sneakers**  
- **Email** : `urbanstyle@sneakers.com`
- **Mot de passe** : `seller2024`
- **Produits** : 6 produits (487 unités en stock)
- **Spécialités** : Converse, Vans, New Balance, Jordan Kids

### **Comptes de Test**
```
👑 Admin    : admin@sneakers.com / admin123
🏪 Seller 1 : seller@sneakers.com / seller123  
🏪 Seller 2 : urbanstyle@sneakers.com / seller2024
👤 Client   : customer@sneakers.com / customer123
```

## ✅ Tests de Validation

### **Isolation des Produits** ✅
- Chaque seller voit uniquement ses produits
- API `/my-products` filtre automatiquement par `sellerId`
- Impossible d'accéder aux produits d'un autre seller

### **Isolation des Commandes** ✅  
- Sellers voient uniquement les commandes contenant leurs produits
- Dans chaque commande, seuls leurs articles sont visibles
- Filtrage automatique côté serveur et client

### **Permissions Granulaires** ✅
- Modification/suppression limitée aux propres ressources
- Vérifications de propriété avant chaque opération
- Messages d'erreur appropriés en cas d'accès non autorisé

### **Intégrité des Données** ✅
- Tous les produits ont un seller assigné
- Codes produits uniques par seller
- Associations cohérentes entre toutes les tables
- Pas de données orphelines

## 🎊 Résultat Final

### **Architecture Enterprise-Ready**
- ✅ **Scalabilité** : Support de centaines de sellers
- ✅ **Sécurité** : Isolation complète des données
- ✅ **Performance** : Index optimisés pour les requêtes multi-sellers
- ✅ **Maintenabilité** : Code modulaire et bien structuré

### **Expérience Utilisateur**
- ✅ **Sellers** : Dashboard dédié avec leurs données uniquement
- ✅ **Clients** : Catalogue unifié avec info sellers transparente  
- ✅ **Admins** : Vue globale et contrôle total de la marketplace

### **Fonctionnalités Métier**
- ✅ **Multi-seller** : Plusieurs vendeurs sur une plateforme
- ✅ **Commissions** : Taux configurables par produit/seller
- ✅ **Approbation** : Workflow de validation des sellers
- ✅ **Isolation** : Données privées par seller

## 🚀 Prêt pour la Production

Cette architecture multi-vendeurs est **complètement fonctionnelle** et prête pour un environnement de production. Elle offre :

- **Isolation parfaite** des données entre sellers
- **Permissions granulaires** selon les rôles
- **Interface utilisateur adaptative** 
- **Performance optimisée** avec index appropriés
- **Intégrité des données** garantie
- **Expérience utilisateur fluide** pour tous les rôles

La marketplace est maintenant capable de supporter **plusieurs sellers** avec une **séparation complète** de leurs activités, tout en offrant une **expérience unifiée** aux clients.

---

*Architecture créée et validée le 22 septembre 2025*
