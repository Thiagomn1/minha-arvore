#!/bin/bash

# Script de inicialização do ambiente Docker
# Uso: ./scripts/docker-start.sh

set -e

echo "🐳 Minha Árvore - Docker Setup"
echo "=============================="
echo ""

# Verificar se Docker está instalado
if ! command -v docker &> /dev/null; then
    echo "❌ Docker não está instalado"
    echo "📥 Instale em: https://docs.docker.com/get-docker/"
    exit 1
fi

# Verificar se Docker Compose está instalado
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose não está instalado"
    echo "📥 Instale em: https://docs.docker.com/compose/install/"
    exit 1
fi

echo "✅ Docker instalado: $(docker --version)"
echo "✅ Docker Compose instalado: $(docker-compose --version)"
echo ""

# Criar .env se não existir
if [ ! -f .env ]; then
    echo "📝 Criando arquivo .env..."
    cp .env.example .env

    # Gerar secret aleatório
    SECRET=$(openssl rand -base64 32)

    # Atualizar .env com configurações Docker
    sed -i.bak "s|MONGODB_URI=.*|MONGODB_URI=mongodb://mongodb:27017/minha-arvore|g" .env
    sed -i.bak "s|NEXTAUTH_SECRET=.*|NEXTAUTH_SECRET=$SECRET|g" .env
    sed -i.bak "s|REDIS_URL=.*|REDIS_URL=redis://redis:6379|g" .env

    rm .env.bak

    echo "✅ Arquivo .env criado com sucesso!"
else
    echo "ℹ️  Arquivo .env já existe"
fi

echo ""
echo "🚀 Iniciando serviços Docker..."
echo ""

# Parar containers antigos se existirem
docker-compose down 2>/dev/null || true

# Iniciar serviços
docker-compose up -d

echo ""
echo "⏳ Aguardando serviços ficarem prontos..."

# Aguardar MongoDB
echo -n "   MongoDB: "
until docker-compose exec -T mongodb mongosh --eval "db.runCommand('ping').ok" &>/dev/null; do
    echo -n "."
    sleep 1
done
echo " ✅"

# Aguardar Redis
echo -n "   Redis: "
until docker-compose exec -T redis redis-cli ping &>/dev/null; do
    echo -n "."
    sleep 1
done
echo " ✅"

# Aguardar App
echo -n "   App: "
sleep 5
echo " ✅"

echo ""
echo "=============================="
echo "🎉 Ambiente iniciado com sucesso!"
echo "=============================="
echo ""
echo "📍 Serviços disponíveis:"
echo "   • App:     http://localhost:3000"
echo "   • MongoDB: mongodb://localhost:27017"
echo "   • Redis:   redis://localhost:6379"
echo ""
echo "📋 Comandos úteis:"
echo "   • Ver logs:      docker-compose logs -f"
echo "   • Parar:         docker-compose down"
echo "   • Reiniciar:     docker-compose restart"
echo "   • Status:        docker-compose ps"
echo ""
echo "📖 Documentação:"
echo "   • Docker:        cat DOCKER.md"
echo "   • Rate Limiting: cat RATE_LIMITING.md"
echo ""
