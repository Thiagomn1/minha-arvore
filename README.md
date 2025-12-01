# 🌳 Minha Árvore

E-commerce de mudas nativas com sistema de rastreamento de plantio e cálculo de compensação de CO₂.

## 📋 Tecnologias

- **Framework:** Next.js 16 (App Router)
- **Database:** MongoDB + Mongoose
- **Auth:** NextAuth.js
- **Cache/Rate Limit:** Redis (Upstash)
- **Styling:** Tailwind CSS + DaisyUI
- **State:** Zustand + React Query
- **Maps:** Leaflet + Mapbox
- **Tests:** Vitest + Testing Library

## ⚡ Quick Start

### Com Docker (Recomendado)

```bash
# Clone o repositório
git clone <repo-url>
cd minha-arvore

# Inicie tudo (MongoDB + Redis + App)
npm run docker:start

# Acesse http://localhost:3000
```

### Desenvolvimento Local

```bash
# Instale dependências
npm install

# Suba apenas banco e cache
docker-compose up -d mongodb redis

# Configure ambiente
cp .env.example .env
# Edite MONGODB_URI, NEXTAUTH_SECRET, REDIS_URL

# Inicie app
npm run dev
```

## 🔧 Configuração

### Variáveis de Ambiente

```env
# Database
MONGODB_URI=mongodb://localhost:27017/minha-arvore

# Auth (gere com: openssl rand -base64 32)
NEXTAUTH_SECRET=your-secret-here
NEXTAUTH_URL=http://localhost:3000

# Rate Limiting
REDIS_URL=redis://localhost:6379              # Local/Docker
# UPSTASH_REDIS_REST_URL=https://...          # Produção (opcional)
# UPSTASH_REDIS_REST_TOKEN=...
```

### Scripts Disponíveis

```bash
npm run dev              # Desenvolvimento (Turbopack)
npm run build            # Build de produção
npm start                # Rodar build
npm test                 # Testes
npm run lint             # ESLint

# Docker
npm run docker:start     # Iniciar ambiente completo
npm run docker:stop      # Parar (mantém dados)
npm run docker:clean     # Parar e limpar volumes
npm run docker:logs      # Ver logs
npm run docker:restart   # Reiniciar app
```

## 🏗️ Estrutura do Projeto

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API Routes
│   ├── admin/             # Páginas admin
│   ├── login/             # Autenticação
│   └── ...
├── components/            # Componentes React
│   ├── ui/               # Componentes reutilizáveis
│   └── layouts/          # Layouts
├── hooks/                 # React Hooks customizados
├── lib/                   # Utilidades
│   ├── rate-limit.ts     # Configuração rate limiting
│   ├── auth.ts           # NextAuth config
│   └── ...
├── models/                # Mongoose models
├── services/              # Lógica de negócio
└── types/                 # TypeScript types
```

## 🛡️ Segurança & Rate Limiting

O projeto implementa proteção contra abuso com rate limiting em três níveis:

| Endpoint    | Limite       | Janela | Identificador |
| ----------- | ------------ | ------ | ------------- |
| Login       | 5 tentativas | 15 min | Email         |
| Registro    | 3 cadastros  | 1 hora | IP            |
| API Pública | 100 requests | 1 min  | IP            |

**Rotas protegidas:**

- ✅ Login/Registro (autenticação)
- ✅ APIs públicas (produtos, checkout, pedidos)
- ✅ Rotas admin (middleware + rate limit)

**Como funciona:**

```typescript
// Sliding window algorithm via Upstash
// Persiste no Redis, funciona em múltiplas instâncias
export const apiRateLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(100, "1 m"),
});
```

[📖 Documentação completa](RATE_LIMITING.md) | [🐳 Setup Docker](DOCKER.md)

## 🧪 Testing

```bash
npm test                 # Rodar todos os testes
npm run test:ui          # Interface visual
npm run test:coverage    # Cobertura de código
```

**Testar rate limiting:**

```bash
# 6 tentativas de login (5º será bloqueada)
for i in {1..6}; do
  curl -X POST http://localhost:3000/api/auth/callback/credentials \
    -d '{"email":"test@test.com","password":"wrong"}'
done

# Verificar no Redis
docker-compose exec redis redis-cli
> KEYS "*ratelimit*"
```

## 🚀 Deploy

### Vercel (Recomendado)

```bash
vercel
```

**Configure:**

- `MONGODB_URI` → MongoDB Atlas
- `NEXTAUTH_SECRET` → Secret gerado
- `UPSTASH_REDIS_REST_URL` → Upstash Redis
- `UPSTASH_REDIS_REST_TOKEN` → Token

### Docker (VPS/Cloud)

```bash
docker build -t minha-arvore .
docker-compose up -d
```

## 🐛 Troubleshooting

<details>
<summary>Porta já em uso</summary>

```bash
lsof -i :3000
kill -9 <PID>
# ou mude a porta no docker-compose.yml
```

</details>

<details>
<summary>MongoDB não conecta</summary>

```bash
docker-compose ps mongodb
docker-compose logs mongodb
docker-compose restart mongodb
```

</details>

<details>
<summary>Redis não conecta</summary>

```bash
docker-compose exec redis redis-cli PING
docker-compose logs redis
docker-compose restart redis
```

</details>

<details>
<summary>Build falha</summary>

```bash
rm -rf .next node_modules
npm install
npm run build
```

</details>

## 📚 Funcionalidades

### Para Usuários

- 🛒 Compra de mudas nativas
- 📍 Rastreamento de plantio (mapa)
- 🌍 Cálculo de compensação de CO₂
- 📊 Dashboard de pedidos
- 👤 Gerenciamento de perfil

### Para Administradores

- 📦 Gestão de produtos
- 📋 Gestão de pedidos
- 👥 Gestão de usuários
- 📸 Upload de fotos de plantio
- 📊 Dashboard admin

## 🗺️ Roadmap

- [ ] Integração com gateway de pagamento
- [ ] Sistema de pontos/gamificação
- [ ] App mobile (React Native)
- [ ] Certificados de plantio (PDF)
- [ ] Dashboard analytics avançado
- [ ] API pública para parceiros

## 🤝 Contribuindo

1. Fork o projeto
2. Crie sua branch (`git checkout -b feature/amazing`)
3. Commit suas mudanças (`git commit -m 'feat: add amazing feature'`)
4. Push para branch (`git push origin feature/amazing`)
5. Abra um Pull Request

**Padrão de commits:** [Conventional Commits](https://www.conventionalcommits.org/)

```
feat: nova funcionalidade
fix: correção de bug
docs: documentação
style: formatação
refactor: refatoração
test: testes
chore: manutenção
```

## 📄 Licença

Este projeto está sob a licença MIT. Veja [LICENSE](LICENSE) para mais detalhes.
