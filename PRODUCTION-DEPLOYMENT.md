# 🚀 Guide de Déploiement Production - SoleHub

## 📋 Prérequis

- Node.js 18+ installé
- NPM ou Yarn
- Base de données SQLite (incluse)
- Port 5000 disponible pour l'API
- Port 3000 disponible pour le client

## 🛠️ Déploiement Complet

### 1. Installation des Dépendances

```bash
# Backend
cd server
npm install

# Frontend  
cd ../client
npm install
```

### 2. Déploiement de la Base de Données

```bash
cd server
npm run deploy
```

**Ce script unique :**
- ✅ Nettoie la base de données
- ✅ Crée tous les utilisateurs (admin, vendeurs, clients)
- ✅ Importe 108 produits depuis les fichiers CSV
- ✅ Génère toutes les variantes de tailles (EU, UK, US)
- ✅ Vérifie l'intégrité des données

### 3. Lancement des Serveurs

```bash
# Terminal 1 - API Backend
cd server
npm start

# Terminal 2 - Client Frontend
cd client
npm start
```

## 🔑 Comptes Créés

### 👑 **Administrateur**
- **Email:** `admin@solehub.com`
- **Mot de passe:** `SoleHub2025!Admin`
- **Rôle:** Administration complète

### 🏪 **Vendeurs**
- **SneakerPro Paris:** `vendor1@solehub.com` / `Vendor2025!`
- **Urban Kicks Lyon:** `vendor2@solehub.com` / `Vendor2025!`
- **Street Style Marseille:** `vendor3@solehub.com` / `Vendor2025!`

### 👥 **Clients**
- **Maxime Lopez:** `maxime.lopez@outlook.fr` / `Maxime2025!`
- **Lucas Moreau:** `lucas.moreau@gmail.com` / `Lucas2025!`
- **Emma Rousseau:** `emma.rousseau@yahoo.fr` / `Emma2025!`

## 📊 Données de Production

- **108 produits** authentiques avec images
- **3 catégories:** Hommes, Femmes, Enfants
- **Marques:** Nike, Adidas, Jordan, New Balance, ASICS, Puma, Converse
- **Tailles:** EU, UK, US avec stock réaliste
- **Vendeurs:** 3 entreprises avec informations complètes

## 🌐 URLs d'Accès

- **Frontend:** http://localhost:3000
- **API Backend:** http://localhost:5000
- **Documentation API:** http://localhost:5000/api

## 🔧 Scripts Disponibles

```bash
# Déploiement complet (recommandé)
npm run deploy

# Seeding uniquement (si base existante)
npm run seed

# Développement avec rechargement automatique
npm run dev
```

## 📁 Structure des Données

```
server/database/data/
├── sneakers_data_1.csv  # Nike, Adidas
├── sneakers_data_2.csv  # Jordan, New Balance  
├── sneakers_data_5.csv  # ASICS, Puma
└── sneakers_data_6.csv  # Converse, Divers
```

## 🛡️ Sécurité

- ✅ Mots de passe hashés avec bcryptjs
- ✅ JWT pour l'authentification
- ✅ CORS configuré
- ✅ Helmet pour la sécurité des headers
- ✅ Rate limiting activé
- ✅ Validation des données

## 📱 Fonctionnalités

- ✅ Marketplace complète
- ✅ Gestion multi-vendeurs
- ✅ Panier anonyme et utilisateur
- ✅ Filtres avancés (marque, catégorie, taille, prix)
- ✅ Pagination (12 produits/page)
- ✅ Tri multiple
- ✅ Interface responsive
- ✅ Conformité RGPD
- ✅ Réinitialisation des filtres par utilisateur

## 🚨 Dépannage

### Port déjà utilisé
```bash
# Trouver et tuer le processus
lsof -ti:5000 | xargs kill -9
lsof -ti:3000 | xargs kill -9
```

### Réinitialisation complète
```bash
cd server
rm database/dev.sqlite
npm run deploy
```

### Vérification des données
```bash
cd server
node -e "
const { Product, User } = require('./database');
Product.count().then(p => console.log('Produits:', p));
User.count().then(u => console.log('Utilisateurs:', u));
"
```

---

**🎉 Votre marketplace SoleHub est maintenant prête pour la production !**
