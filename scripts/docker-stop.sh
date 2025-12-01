#!/bin/bash

# Script para parar o ambiente Docker
# Uso: ./scripts/docker-stop.sh [--clean]

set -e

echo "🛑 Parando serviços Docker..."
echo ""

if [ "$1" == "--clean" ]; then
    echo "⚠️  Modo CLEAN: Irá remover volumes (apaga dados!)"
    read -p "Tem certeza? (y/N): " -n 1 -r
    echo ""

    if [[ $REPLY =~ ^[Yy]$ ]]; then
        docker-compose down -v
        echo ""
        echo "🧹 Serviços parados e volumes removidos"
        echo "ℹ️  Na próxima inicialização, terá banco de dados limpo"
    else
        echo "Cancelado"
        exit 0
    fi
else
    docker-compose down
    echo ""
    echo "✅ Serviços parados"
    echo "ℹ️  Dados preservados (MongoDB e Redis)"
    echo ""
    echo "💡 Para limpar tudo: ./scripts/docker-stop.sh --clean"
fi

echo ""
