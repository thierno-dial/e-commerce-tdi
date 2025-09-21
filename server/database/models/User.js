const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [6, 255] // Minimum 6 caractères
      }
    },
    
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [2, 50]
      }
    },
    
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [2, 50]
      }
    },
    
    role: {
      type: DataTypes.ENUM('admin', 'seller', 'customer'),
      allowNull: false,
      defaultValue: 'customer'
    },
    
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    
    // Champs optionnels pour le profil
    phone: {
      type: DataTypes.STRING,
      allowNull: true
    },
    
    dateOfBirth: {
      type: DataTypes.DATE,
      allowNull: true
    },
    
    // Adresse par défaut (JSON pour flexibilité)
    defaultAddress: {
      type: DataTypes.JSON,
      allowNull: true
    }
    
  }, {
    tableName: 'users',
    
    // Méthodes d'instance
    instanceMethods: {
      getFullName() {
        return `${this.firstName} ${this.lastName}`;
      }
    },
    
    // Hooks Sequelize (équivalent des triggers)
    hooks: {
      // Avant création, on peut hasher le mot de passe ici
      beforeCreate: async (user) => {
        // Le hashage sera implémenté dans le service d'authentification
      }
    },
    
    // Scopes pour des requêtes prédéfinies
    scopes: {
      // Exclut le mot de passe des requêtes par défaut
      defaultScope: {
        attributes: { exclude: ['password'] }
      },
      
      // Scope pour inclure le mot de passe (login)
      withPassword: {
        attributes: { include: ['password'] }
      },
      
      // Utilisateurs actifs seulement
      active: {
        where: { isActive: true }
      },
      
      // Par rôle
      admins: {
        where: { role: 'admin' }
      },
      
      sellers: {
        where: { role: 'seller' }
      },
      
      customers: {
        where: { role: 'customer' }
      }
    }
  });
  
  return User;
};
