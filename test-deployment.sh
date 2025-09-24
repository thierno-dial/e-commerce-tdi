#!/bin/bash

# 🧪 Script de Test de Déploiement - SneakersShop
# Usage: ./test-deployment.sh https://votre-backend.onrender.com

if [ -z "$1" ]; then
    echo "❌ Usage: $0 <backend-url>"
    echo "   Exemple: $0 https://sneakersshop-api.onrender.com"
    exit 1
fi

BACKEND_URL="$1"
API_URL="$BACKEND_URL/api"

echo "🧪 TEST DE DÉPLOIEMENT SNEAKERSSHOP"
echo "======================================"
echo "Backend URL: $BACKEND_URL"
echo "API URL: $API_URL"
echo ""

# Test 1: Health Check
echo "1️⃣ Test Health Check..."
HEALTH_RESPONSE=$(curl -s "$API_URL/health")
if echo "$HEALTH_RESPONSE" | grep -q "ok"; then
    echo "✅ Health Check: OK"
else
    echo "❌ Health Check: FAILED"
    echo "Response: $HEALTH_RESPONSE"
fi
echo ""

# Test 2: Products API
echo "2️⃣ Test Products API..."
PRODUCTS_RESPONSE=$(curl -s "$API_URL/products?limit=1")
if echo "$PRODUCTS_RESPONSE" | grep -q "products"; then
    PRODUCT_COUNT=$(echo "$PRODUCTS_RESPONSE" | grep -o '"totalItems":[0-9]*' | cut -d':' -f2)
    echo "✅ Products API: OK ($PRODUCT_COUNT produits)"
else
    echo "❌ Products API: FAILED"
    echo "Response: $PRODUCTS_RESPONSE"
fi
echo ""

# Test 3: Authentication
echo "3️⃣ Test Authentication..."
AUTH_RESPONSE=$(curl -s -X POST "$API_URL/auth/login" \
    -H "Content-Type: application/json" \
    -d '{"email":"admin@sneakersshop.com","password":"SneakersShop2025!Admin"}')

if echo "$AUTH_RESPONSE" | grep -q "token"; then
    echo "✅ Authentication: OK"
else
    echo "❌ Authentication: FAILED"
    echo "Response: $AUTH_RESPONSE"
fi
echo ""

# Test 4: CORS Headers
echo "4️⃣ Test CORS Headers..."
CORS_RESPONSE=$(curl -s -I "$API_URL/health")
if echo "$CORS_RESPONSE" | grep -q "Access-Control-Allow-Origin"; then
    echo "✅ CORS Headers: OK"
else
    echo "❌ CORS Headers: MISSING"
fi
echo ""

echo "🎯 RÉSUMÉ DES TESTS"
echo "=================="
echo "✅ = Fonctionnel"
echo "❌ = Problème détecté"
echo ""
echo "Pour tester le frontend:"
echo "1. Ouvrir https://votre-frontend.onrender.com"
echo "2. Vérifier que les produits s'affichent"
echo "3. Tester la connexion admin: admin@sneakersshop.com / SneakersShop2025!Admin"
