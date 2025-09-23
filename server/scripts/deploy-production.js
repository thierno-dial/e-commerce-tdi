#!/usr/bin/env node

/**
 * 🚀 Script de Déploiement Production - SoleHub
 * 
 * Ce script automatise le déploiement complet de l'application :
 * 1. Nettoyage de la base de données
 * 2. Insertion des données de production depuis les fichiers CSV
 * 3. Vérification de l'intégrité des données
 * 
 * Usage: node scripts/deploy-production.js
 */

const { sequelize } = require('../database');

async function deployProduction() {
  console.log('🚀 DÉPLOIEMENT PRODUCTION - SOLEHUB');
  console.log('=====================================\n');

  try {
    // Vérification de la connexion à la base de données
    console.log('🔌 Vérification de la connexion à la base de données...');
    await sequelize.authenticate();
    console.log('✅ Connexion à la base de données établie\n');

    // Synchronisation des modèles (création des tables si nécessaire)
    console.log('📋 Synchronisation des modèles de base de données...');
    await sequelize.sync({ force: false }); // force: false pour ne pas recréer les tables
    console.log('✅ Modèles synchronisés\n');

    // Exécution du seeding de production
    console.log('📦 Lancement du seeding de production...');
    const { spawn } = require('child_process');
    
    await new Promise((resolve, reject) => {
      const seedProcess = spawn('node', ['scripts/seed-production.js'], {
        cwd: process.cwd(),
        stdio: 'inherit'
      });
      
      seedProcess.on('close', (code) => {
        if (code === 0) {
          resolve();
        } else {
          reject(new Error(`Seeding process exited with code ${code}`));
        }
      });
      
      seedProcess.on('error', reject);
    });
    
    console.log('✅ Seeding de production terminé\n');

    // Vérification finale
    console.log('🔍 Vérification finale des données...');
    const { Product, User, ProductVariant } = require('../database');
    
    const productCount = await Product.count({ where: { isActive: true } });
    const userCount = await User.count({ where: { isActive: true } });
    const variantCount = await ProductVariant.count();
    
    console.log('📊 RÉSUMÉ DU DÉPLOIEMENT:');
    console.log(`   👟 Produits actifs: ${productCount}`);
    console.log(`   👥 Utilisateurs actifs: ${userCount}`);
    console.log(`   📏 Variantes de produits: ${variantCount}`);
    
    if (productCount === 0 || userCount === 0) {
      throw new Error('❌ Données incomplètes détectées');
    }
    
    console.log('\n🎉 DÉPLOIEMENT PRODUCTION RÉUSSI !');
    console.log('🌐 Votre marketplace SoleHub est prête pour la production');
    
  } catch (error) {
    console.error('\n❌ ERREUR DE DÉPLOIEMENT:', error.message);
    console.error('📋 Détails:', error);
    process.exit(1);
  } finally {
    // Fermeture propre de la connexion
    await sequelize.close();
    console.log('\n🔌 Connexion à la base de données fermée');
  }
}

// Exécution du script si appelé directement
if (require.main === module) {
  deployProduction()
    .then(() => {
      console.log('\n✅ Script de déploiement terminé avec succès');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n❌ Script de déploiement échoué:', error);
      process.exit(1);
    });
}

module.exports = deployProduction;
