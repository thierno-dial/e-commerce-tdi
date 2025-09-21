const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const ProductVariant = sequelize.define('ProductVariant', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    
    productId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: 'product_id',
      references: {
        model: 'products',
        key: 'id'
      }
    },
    
    // Taille (ex: "42", "9", "8.5")
    size: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [1, 10]
      }
    },
    
    // Type de taille (EU, US, UK)
    sizeType: {
      type: DataTypes.ENUM('EU', 'US', 'UK'),
      allowNull: false,
      defaultValue: 'EU',
      field: 'size_type'
    },
    
    // Stock disponible
    stock: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      validate: {
        min: 0
      }
    },
    
    // Prix spécifique à cette variante (peut différer du prix de base)
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true, // Si null, utilise le prix de base du produit
      validate: {
        min: 0
      }
    },
    
    // SKU unique pour la gestion logistique
    sku: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        len: [3, 50]
      }
    },
    
    // Stock de sécurité (alerte si en dessous)
    minStock: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 5,
      field: 'min_stock'
    },
    
    // Poids pour calcul de livraison
    weight: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: true,
      validate: {
        min: 0
      }
    }
    
  }, {
    tableName: 'product_variants',
    
    // Index composé pour optimiser les recherches
    indexes: [
      {
        unique: true,
        fields: ['product_id', 'size', 'size_type']
      },
      {
        fields: ['stock']
      },
      {
        fields: ['sku']
      }
    ],
    
    // Méthodes d'instance
    instanceMethods: {
      // Vérifie si le stock est suffisant
      hasStock(quantity = 1) {
        return this.stock >= quantity;
      },
      
      // Vérifie si le stock est critique
      isLowStock() {
        return this.stock <= this.minStock;
      },
      
      // Formate la taille pour l'affichage
      getFormattedSize() {
        return `${this.size} ${this.sizeType}`;
      }
    },
    
    // Scopes
    scopes: {
      // Variantes en stock
      inStock: {
        where: {
          stock: {
            [sequelize.Sequelize.Op.gt]: 0
          }
        }
      },
      
      // Stock faible
      lowStock: {
        where: sequelize.literal('stock <= min_stock')
      },
      
      // Par type de taille
      eu: {
        where: { sizeType: 'EU' }
      },
      
      us: {
        where: { sizeType: 'US' }
      },
      
      uk: {
        where: { sizeType: 'UK' }
      }
    },
    
    // Hooks pour la gestion automatique
    hooks: {
      // Génère automatiquement le SKU si pas fourni
      beforeCreate: async (variant) => {
        if (!variant.sku) {
          // Format: BRAND-PRODUCTNAME-SIZE-TYPE
          const product = await sequelize.models.Product.findByPk(variant.productId);
          if (product) {
            const brandCode = product.brand.substring(0, 3).toUpperCase();
            const sizeCode = variant.size.replace('.', '');
            variant.sku = `${brandCode}-${sizeCode}${variant.sizeType}-${Date.now()}`;
          }
        }
      }
    }
  });
  
  return ProductVariant;
};
