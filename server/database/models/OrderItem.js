const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const OrderItem = sequelize.define('OrderItem', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    
    orderId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: 'order_id',
      references: {
        model: 'orders',
        key: 'id'
      }
    },
    
    productVariantId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: 'product_variant_id',
      references: {
        model: 'product_variants',
        key: 'id'
      }
    },
    
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1
      }
    },
    
    // Prix unitaire au moment de l'achat (historique)
    unitPrice: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      field: 'unit_price',
      validate: {
        min: 0
      }
    },
    
    // Prix total pour cet article
    totalPrice: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      field: 'total_price',
      validate: {
        min: 0
      }
    }
    
  }, {
    tableName: 'order_items',
    
    // Index
    indexes: [
      {
        fields: ['order_id']
      },
      {
        fields: ['product_variant_id']
      }
    ],
    
    // Hooks pour calculer automatiquement le prix total
    hooks: {
      beforeSave: (orderItem) => {
        orderItem.totalPrice = orderItem.unitPrice * orderItem.quantity;
      }
    }
  });
  
  return OrderItem;
};
