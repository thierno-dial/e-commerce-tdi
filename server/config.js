require('dotenv').config();

module.exports = {
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  
  database: {
    // Pour simplifier le développement, on utilise SQLite en local
    dialect: process.env.NODE_ENV === 'production' ? 'postgres' : 'sqlite',
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    name: process.env.DB_NAME || 'sneakers_ecommerce_dev',
    username: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'password',
    storage: process.env.NODE_ENV !== 'production' ? './database/dev.sqlite' : null
  },
  
  jwt: {
    secret: process.env.JWT_SECRET || 'fallback_secret_change_me',
    expiresIn: process.env.JWT_EXPIRES_IN || '7d'
  },
  
  upload: {
    maxFileSize: process.env.MAX_FILE_SIZE || '5MB'
  }
};
