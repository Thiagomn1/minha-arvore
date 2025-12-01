# 🚀 Quick Start - Minha Árvore

Guia rápido para começar a desenvolver.

## ⚡ Opção 1: Docker (Recomendado)

A forma mais rápida de começar:

```bash
# 1. Clone o repositório
git clone <repo-url>
cd minha-arvore

# 2. Inicie tudo com um comando
./scripts/docker-start.sh

# 3. Acesse
open http://localhost:3000
```

**Pronto! 🎉** MongoDB, Redis e App estão rodando.

### Comandos úteis

```bash
# Ver logs
docker-compose logs -f app

# Parar tudo (mantém dados)
./scripts/docker-stop.sh

# Parar e limpar tudo
./scripts/docker-stop.sh --clean

# Reiniciar app
docker-compose restart app

# Acessar MongoDB
docker-compose exec mongodb mongosh

# Acessar Redis
docker-compose exec redis redis-cli
```

## 💻 Opção 2: Local Development

Para desenvolvimento sem Docker:

```bash
# 1. Instalar dependências
npm install

# 2. Iniciar MongoDB e Redis (via Docker)
docker-compose up -d mongodb redis

# 3. Configurar .env
cp .env.example .env
# Edite .env com:
# MONGODB_URI=mongodb://localhost:27017/minha-arvore
# REDIS_URL=redis://localhost:6379

# 4. Iniciar app em modo dev
npm run dev

# 5. Acesse
open http://localhost:3000
```

## 🔐 Variáveis de Ambiente

### Essenciais

```env
# Banco de dados
MONGODB_URI=mongodb://mongodb:27017/minha-arvore

# Autenticação
NEXTAUTH_SECRET=seu-secret-aqui-256-bits
NEXTAUTH_URL=http://localhost:3000

# Rate Limiting (escolha uma)
REDIS_URL=redis://redis:6379                    # Docker/Local
# UPSTASH_REDIS_REST_URL=https://...            # Produção
# UPSTASH_REDIS_REST_TOKEN=...
```

### Gerar NEXTAUTH_SECRET

```bash
openssl rand -base64 32
```

## 🛡️ Rate Limiting

O projeto já vem com rate limiting configurado:

| Endpoint  | Limite       | Janela |
| --------- | ------------ | ------ |
| Login     | 5 tentativas | 15 min |
| Registro  | 3 cadastros  | 1 hora |
| API Geral | 100 requests | 1 min  |

**Testar rate limit:**

```bash
# Login (após 5 tentativas será bloqueado)
for i in {1..6}; do
  curl -X POST http://localhost:3000/api/auth/callback/credentials \
    -H "Content-Type: application/json" \
    -d '{"email":"test@test.com","password":"wrong"}'
done
```

**Ver dados no Redis:**

```bash
docker-compose exec redis redis-cli
> KEYS *
> GET "@upstash/ratelimit:login:test@test.com"
```

## 🧪 Testing

```bash
# Rodar testes
npm test

# Testes em watch mode
npm run test:watch

# Coverage
npm run test:coverage
```

## 📦 Build

```bash
# Build de produção
npm run build

# Rodar build
npm start

# Docker build
docker-compose up -d --build
```

**Configurar variáveis:**

- `MONGODB_URI`: MongoDB Atlas
- `NEXTAUTH_SECRET`: Secret gerado
- `UPSTASH_REDIS_REST_URL`: Upstash Redis
- `UPSTASH_REDIS_REST_TOKEN`: Token Upstash

### Docker (VPS/Cloud)

```bash
# Build e push para registry
docker build -t minha-arvore .
docker tag minha-arvore registry.com/minha-arvore
docker push registry.com/minha-arvore

# Deploy
docker-compose up -d
```

## 🐛 Troubleshooting

### Porta já em uso

```bash
# Ver o que está usando a porta
lsof -i :3000

# Matar processo
kill -9 <PID>

# Ou mudar porta no docker-compose.yml
```

### MongoDB não conecta

```bash
# Verificar se está rodando
docker-compose ps mongodb

# Ver logs
docker-compose logs mongodb

# Reiniciar
docker-compose restart mongodb
```

### Redis não conecta

```bash
# Testar conexão
docker-compose exec redis redis-cli PING

# Ver logs
docker-compose logs redis

# Reiniciar
docker-compose restart redis
```

### Build falha

```bash
# Limpar cache
rm -rf .next node_modules
npm install
npm run build

# Docker rebuild
docker-compose down
docker-compose build --no-cache
docker-compose up -d
```

## 💡 Dicas

1. **Use o Docker** para desenvolvimento (evita problemas de ambiente)
2. **Configure Git hooks** para rodar linter antes de commit
3. **Ative ESLint** na sua IDE
4. **Use TypeScript strict mode**
5. **Teste rate limiting** antes de fazer deploy

## 🤝 Contribuindo

```bash
# 1. Fork o projeto
# 2. Crie uma branch
git checkout -b feature/minha-feature

# 3. Commit suas mudanças
git commit -m "feat: adiciona minha feature"

# 4. Push para o branch
git push origin feature/minha-feature

# 5. Abra um Pull Request
```
