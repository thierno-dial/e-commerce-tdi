# Configuration de Déploiement

## Variables d'Environnement

### Backend (Render Web Service)
```bash
NODE_ENV=production
JWT_SECRET=your-super-secret-jwt-key-minimum-32-characters
PORT=5000
```

### Frontend (.env.production)
```bash
# Créer le fichier client/.env.production avec:
REACT_APP_API_URL=https://your-backend-app.onrender.com/api
```

## Configuration Render

### Backend
- **Service Type**: Web Service
- **Repository**: Votre repository GitHub
- **Root Directory**: `server`
- **Build Command**: `npm install`
- **Start Command**: `npm start`
- **Environment**: Node.js 18.x

### Frontend
- **Service Type**: Static Site
- **Repository**: Votre repository GitHub  
- **Root Directory**: `client`
- **Build Command**: `npm install && npm run build`
- **Publish Directory**: `build`

## Étapes de Déploiement

### 1. Backend
1. Créer un Web Service sur Render
2. Connecter votre repository
3. Configurer les variables d'environnement
4. Déployer
5. Initialiser la base de données via Shell: `npm run seed`

### 2. Frontend
1. Créer `.env.production` avec l'URL du backend
2. Créer un Static Site sur Render
3. Configurer et déployer

## Test de Déploiement
- Vérifier l'accès à l'API backend
- Tester la connexion avec les comptes de test
- Vérifier le processus d'achat complet
