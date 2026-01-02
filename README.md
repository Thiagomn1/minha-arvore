# 🌳 Minha Árvore

E-commerce de mudas nativas com sistema de rastreamento de plantio e cálculo de compensação de CO₂.

## 📋 Tecnologias

- **Framework:** Next.js 16 (App Router)
- **Database:** MongoDB + Mongoose
- **Auth:** NextAuth.js
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

# Inicie tudo (MongoDB + App)
npm run docker:start

# Acesse http://localhost:3000
```

### Desenvolvimento Local

```bash
# Instale dependências
npm install

# Suba apenas o banco de dados
docker compose up -d mongodb

# Configure ambiente
cp .env.example .env
# Edite MONGODB_URI, NEXTAUTH_SECRET

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
│   ├── auth.ts           # NextAuth config
│   ├── db/               # Database config
│   └── ...
├── models/                # Mongoose models
├── services/              # Lógica de negócio
└── types/                 # TypeScript types
```

## 🛡️ Segurança

**Rotas protegidas:**

- ✅ Login/Registro (autenticação NextAuth)
- ✅ APIs públicas (validação de dados com Zod)
- ✅ Rotas admin (middleware de autorização)

**Validação de dados:**

- Senhas: mínimo 6 caracteres, maiúsculas, minúsculas, números e caracteres especiais
- CPF/CNPJ: validação de formato
- Email: validação de formato e unicidade
- Todos os inputs sanitizados com Zod schemas

## 🧪 Testing

```bash
npm test                 # Rodar todos os testes
npm run test:ui          # Interface visual
npm run test:coverage    # Cobertura de código
```

## 🚀 Deploy

### Vercel (Recomendado)

```bash
vercel
```

**Configure:**

- `MONGODB_URI` → MongoDB Atlas
- `NEXTAUTH_SECRET` → Secret gerado

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

## 🔐 Admin Setup

Para promover um usuário a administrador:

```bash
# Conecte ao MongoDB
docker exec minha-arvore-mongodb mongosh minha-arvore --eval 'db.users.updateOne({email: "seu@email.com"}, {$set: {role: "Admin"}})'
```

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
