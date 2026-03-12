#!/bin/bash

# Script de deployment para GALATEA Core Backend con PM2
# Uso: ./deploy.sh [production|staging|development]

set -e

ENVIRONMENT=${1:-production}
APP_NAME="galatea-core-backend"

echo "🚀 Iniciando deployment en modo: $ENVIRONMENT"

# Verificar que PM2 esté instalado
if ! command -v pm2 &> /dev/null; then
    echo "❌ PM2 no está instalado. Instalando PM2..."
    npm install -g pm2
fi

# Crear directorio de logs si no existe
mkdir -p logs

# Instalar dependencias
echo "📦 Instalando dependencias..."
npm install

# Construir la aplicación
echo "🔨 Construyendo la aplicación..."
npm run build

# Verificar que el archivo de configuración de Prisma existe
if [ -f "prisma/schema.prisma" ]; then
    echo "🗄️ Generando cliente de Prisma..."
    npx prisma generate
fi

# Detener la aplicación si está corriendo
echo "🛑 Deteniendo aplicación existente..."
pm2 delete $APP_NAME 2>/dev/null || echo "No hay aplicación corriendo"

# Iniciar la aplicación con PM2
echo "▶️ Iniciando aplicación con PM2..."
if [ "$ENVIRONMENT" = "production" ]; then
    pm2 start ecosystem.config.js --env production
elif [ "$ENVIRONMENT" = "staging" ]; then
    pm2 start ecosystem.config.js --env staging
else
    pm2 start ecosystem.config.js
fi

# Guardar configuración de PM2
pm2 save

# Configurar PM2 para que se inicie automáticamente
pm2 startup

echo "✅ Deployment completado!"
echo "📊 Estado de la aplicación:"
pm2 status
echo ""
echo "📝 Para ver los logs:"
echo "   pm2 logs $APP_NAME"
echo ""
echo "🔄 Para reiniciar:"
echo "   pm2 restart $APP_NAME"
echo ""
echo "🛑 Para detener:"
echo "   pm2 stop $APP_NAME"
