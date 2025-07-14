#!/bin/bash

echo "🚀 Iniciando AlterEgo Chain Backend..."

# Verificar si Node.js está instalado
if ! command -v node &> /dev/null; then
    echo "❌ Error: Node.js no está instalado"
    exit 1
fi

# Verificar si las dependencias están instaladas
if [ ! -d "node_modules" ]; then
    echo "📦 Instalando dependencias..."
    npm install
fi

# Crear directorio de conversaciones si no existe
mkdir -p conversaciones

# Iniciar el servidor
echo "🌟 Iniciando servidor en puerto 3001..."
echo "📝 Logs disponibles en server.log"
echo "🔗 API disponible en: http://localhost:3001"
echo ""

# Ejecutar el servidor
node server.js