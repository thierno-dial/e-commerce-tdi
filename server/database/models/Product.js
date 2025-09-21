const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Product = sequelize.define('Product', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [2, 200]
      }
    },
    
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    
    brand: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [2, 50]
      }
    },
    
    category: {
      type: DataTypes.ENUM('men', 'women', 'kids'),
      allowNull: false
    },
    
    // Prix de base (peut être surchargé par variante)
    basePrice: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        min: 0
      }
    },
    
    // Images stockées comme array d'URLs
    images: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: []
    },
    
    // Métadonnées pour SEO et recherche
    tags: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: []
    },
    
    // Caractéristiques techniques
    specifications: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: {}
    },
    
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    
    // Pour la gestion des promotions
    isOnSale: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    
    salePrice: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
      validate: {
        min: 0
      }
    }
    
  }, {
    tableName: 'products',
    
    // Index pour optimiser les recherches
    indexes: [
      {
        fields: ['brand']
      },
      {
        fields: ['category']
      },
      {
        fields: ['is_active']
      },
      {
        fields: ['is_on_sale']
      }
    ],
    
    // Scopes pour des requêtes prédéfinies
    scopes: {
      // Produits actifs seulement
      active: {
        where: { isActive: true }
      },
      
      // Par catégorie
      men: {
        where: { category: 'men', isActive: true }
      },
      
      women: {
        where: { category: 'women', isActive: true }
      },
      
      kids: {
        where: { category: 'kids', isActive: true }
      },
      
      // Produits en promotion
      onSale: {
        where: { isOnSale: true, isActive: true }
      },
      
      // Par marque
      byBrand: (brand) => ({
        where: { brand, isActive: true }
      })
    }
  });
  
  return Product;
};
