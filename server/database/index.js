const { Sequelize } = require('sequelize');
const config = require('../config');

// Configuration de la connexion
const sequelize = new Sequelize(
  config.database.dialect === 'sqlite' ? config.database.storage : config.database.name,
  config.database.username,
  config.database.password,
  {
    host: config.database.host,
    port: config.database.port,
    dialect: config.database.dialect,
    storage: config.database.storage, // Pour SQLite
    logging: config.nodeEnv === 'development' ? console.log : false,
    
    // Pool de connexions pour optimiser les performances
    pool: {
      max: 5,        // Maximum 5 connexions simultanées
      min: 0,        // Minimum 0 connexions
      acquire: 30000, // Timeout pour acquérir une connexion (30s)
      idle: 10000     // Temps avant fermeture d'une connexion inactive (10s)
    },
    
    // Options pour la production
    define: {
      timestamps: true,
      underscored: true, // snake_case pour les colonnes
      freezeTableName: true // Nom de table exact (pas de pluralisation automatique)
    }
  }
);

// Import des modèles
const User = require('./models/User')(sequelize);
const Product = require('./models/Product')(sequelize);
const ProductVariant = require('./models/ProductVariant')(sequelize);
const Order = require('./models/Order')(sequelize);
const OrderItem = require('./models/OrderItem')(sequelize);
const CartItem = require('./models/CartItem')(sequelize);

// Définition des associations
const setupAssociations = () => {
  // User associations
  User.hasMany(Order, { foreignKey: 'user_id', as: 'orders' });
  User.hasMany(CartItem, { foreignKey: 'user_id', as: 'cartItems' });
  
  // Product associations
  Product.hasMany(ProductVariant, { foreignKey: 'product_id', as: 'variants' });
  
  // ProductVariant associations
  ProductVariant.belongsTo(Product, { foreignKey: 'product_id', as: 'product' });
  ProductVariant.hasMany(OrderItem, { foreignKey: 'product_variant_id', as: 'orderItems' });
  ProductVariant.hasMany(CartItem, { foreignKey: 'product_variant_id', as: 'cartItems' });
  
  // Order associations
  Order.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
  Order.hasMany(OrderItem, { foreignKey: 'order_id', as: 'items' });
  
  // OrderItem associations
  OrderItem.belongsTo(Order, { foreignKey: 'order_id', as: 'order' });
  OrderItem.belongsTo(ProductVariant, { foreignKey: 'product_variant_id', as: 'productVariant' });
  
  // CartItem associations
  CartItem.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
  CartItem.belongsTo(ProductVariant, { foreignKey: 'product_variant_id', as: 'productVariant' });
};

// Configuration des associations
setupAssociations();

// Test de connexion
const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connection established successfully.');
  } catch (error) {
    console.error('❌ Unable to connect to the database:', error.message);
  }
};

// Export des modèles et de la connexion
module.exports = {
  sequelize,
  User,
  Product,
  ProductVariant,
  Order,
  OrderItem,
  CartItem,
  testConnection
};
