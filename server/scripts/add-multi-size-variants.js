const { Product, ProductVariant } = require('../database');

// Conversion approximative des tailles
const sizeConversions = {
  men: {
    '40': { EU: '40', UK: '6.5', US: '7' },
    '41': { EU: '41', UK: '7', US: '8' },
    '42': { EU: '42', UK: '8', US: '9' },
    '43': { EU: '43', UK: '9', US: '10' },
    '44': { EU: '44', UK: '10', US: '11' },
    '45': { EU: '45', UK: '11', US: '12' }
  },
  women: {
    '36': { EU: '36', UK: '3.5', US: '6' },
    '37': { EU: '37', UK: '4', US: '6.5' },
    '38': { EU: '38', UK: '5', US: '7.5' },
    '39': { EU: '39', UK: '6', US: '8.5' },
    '40': { EU: '40', UK: '6.5', US: '9' },
    '41': { EU: '41', UK: '7', US: '9.5' }
  },
  kids: {
    '28': { EU: '28', UK: '10', US: '11' },
    '29': { EU: '29', UK: '11', US: '12' },
    '30': { EU: '30', UK: '12', US: '13' },
    '31': { EU: '31', UK: '12.5', US: '13.5' },
    '32': { EU: '32', UK: '13', US: '1' },
    '33': { EU: '33', UK: '1', US: '2' },
    '34': { EU: '34', UK: '2', US: '3' }
  }
};

async function addMultiSizeVariants() {
  try {
    console.log('🌍 Adding UK and US size variants to existing products...');
    
    // Récupérer tous les produits avec leurs variantes EU existantes
    const products = await Product.findAll({
      include: [{ 
        model: ProductVariant,
        where: { sizeType: 'EU' }
      }]
    });

    console.log(`📦 Found ${products.length} products with EU variants`);

    for (const product of products) {
      console.log(`\n👟 Processing: ${product.name} (${product.category})`);
      
      const conversions = sizeConversions[product.category];
      if (!conversions) {
        console.log(`   ⚠️  No conversions available for category: ${product.category}`);
        continue;
      }

      const variantsToCreate = [];

      // Pour chaque variante EU existante, créer les équivalents UK et US
      for (const euVariant of product.ProductVariants) {
        const sizeEU = euVariant.size;
        const conversion = conversions[sizeEU];
        
        if (!conversion) {
          console.log(`   ⚠️  No conversion for size ${sizeEU} EU`);
          continue;
        }

        // Créer variante UK
        const ukSku = `${product.brand.toUpperCase()}-${product.name.replace(/\s+/g, '').toUpperCase()}-${conversion.UK}-UK-${Date.now().toString().slice(-4)}`;
        variantsToCreate.push({
          productId: product.id,
          size: conversion.UK,
          sizeType: 'UK',
          stock: Math.floor(euVariant.stock * 0.7), // Stock légèrement inférieur
          sku: ukSku
        });

        // Créer variante US
        const usSku = `${product.brand.toUpperCase()}-${product.name.replace(/\s+/g, '').toUpperCase()}-${conversion.US}-US-${Date.now().toString().slice(-4)}`;
        variantsToCreate.push({
          productId: product.id,
          size: conversion.US,
          sizeType: 'US',
          stock: Math.floor(euVariant.stock * 0.8), // Stock légèrement inférieur
          sku: usSku
        });

        console.log(`   ✅ Size ${sizeEU} EU → ${conversion.UK} UK, ${conversion.US} US`);
      }

      if (variantsToCreate.length > 0) {
        await ProductVariant.bulkCreate(variantsToCreate);
        console.log(`   🎯 Created ${variantsToCreate.length} new variants (UK & US)`);
      }
    }

    // Vérification finale
    const totalVariants = await ProductVariant.count();
    const euVariants = await ProductVariant.count({ where: { sizeType: 'EU' } });
    const ukVariants = await ProductVariant.count({ where: { sizeType: 'UK' } });
    const usVariants = await ProductVariant.count({ where: { sizeType: 'US' } });

    console.log('\n📊 Final variant statistics:');
    console.log(`   Total variants: ${totalVariants}`);
    console.log(`   EU variants: ${euVariants}`);
    console.log(`   UK variants: ${ukVariants}`);
    console.log(`   US variants: ${usVariants}`);
    
    console.log('\n🎉 Multi-size variants added successfully!');
    
  } catch (error) {
    console.error('❌ Error adding multi-size variants:', error);
    throw error;
  }
}

if (require.main === module) {
  addMultiSizeVariants()
    .then(() => process.exit(0))
    .catch(error => {
      console.error(error);
      process.exit(1);
    });
}

module.exports = addMultiSizeVariants;
