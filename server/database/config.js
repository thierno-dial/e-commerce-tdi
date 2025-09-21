const config = require('../config');

module.exports = {
  development: {
    username: config.database.username,
    password: config.database.password,
    database: config.database.name,
    host: config.database.host,
    port: config.database.port,
    dialect: 'postgres',
    logging: console.log, // Affiche les requêtes SQL en dev
    define: {
      // Utilise des timestamps automatiques
      timestamps: true,
      // Utilise le snake_case pour les colonnes
      underscored: true,
      // Utilise des UUID par défaut
      defaultScope: {
        attributes: { exclude: ['createdAt', 'updatedAt'] }
      }
    }
  },
  
  production: {
    username: config.database.username,
    password: config.database.password,
    database: config.database.name,
    host: config.database.host,
    port: config.database.port,
    dialect: 'postgres',
    logging: false, // Pas de logs en production
    define: {
      timestamps: true,
      underscored: true
    }
  }
};
