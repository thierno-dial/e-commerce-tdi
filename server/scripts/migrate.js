const { sequelize, testConnection } = require('../database');

async function migrate() {
  try {
    console.log('🔗 Testing database connection...');
    await testConnection();
    
    console.log('📊 Creating/updating database tables...');
    
    // Synchronise les modèles avec la base de données
    // force: false = ne supprime pas les tables existantes
    // alter: true = modifie les tables si nécessaire
    await sequelize.sync({ 
      force: false,
      alter: true 
    });
    
    console.log('✅ Database migration completed successfully!');
    
    // Affiche la structure créée
    const tables = await sequelize.getQueryInterface().showAllTables();
    console.log('📋 Tables created:', tables);
    
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    process.exit(1);
  } finally {
    await sequelize.close();
  }
}

// Exécute la migration
if (require.main === module) {
  migrate();
}

module.exports = migrate;
