# Refatoração Completa - Minha Árvore

## Resumo das Mudanças

Esta refatoração transforma o projeto de um MVP funcional em uma aplicação production-ready, com melhorias significativas em segurança, arquitetura, performance e manutenibilidade.

---

## 1. Segurança Crítica

### Arquivos de Ambiente
- ✅ Criado `.env.example` com variáveis de exemplo (sem valores reais)
- ✅ `.gitignore` já configurado corretamente
- ⚠️ **AÇÃO NECESSÁRIA**: Rotacione as credenciais do MongoDB e Stripe se o `.env` foi commitado anteriormente

### Configuração de Imagens
- ✅ Restringido `remotePatterns` no `next.config.ts` para domínios confiáveis apenas
- Anterior: Aceitava qualquer hostname (`hostname: "**"`)
- Atual: Lista explícita de domínios permitidos

### Middleware de Autenticação
- ✅ Implementado `proxy.ts` com proteção de rotas
- Rotas protegidas: `/perfil`, `/pedidos`, `/carrinho`
- Rotas admin: `/admin/*` e `/api/admin/*`
- Redirecionamento automático para login quando não autenticado

---

## 2. Arquitetura e Organização

### Camada de Serviços (Service Layer)
Criados três serviços principais que separam lógica de negócio das rotas:

```
src/services/
├── user.service.ts      # Operações de usuário
├── product.service.ts   # Operações de produto
└── order.service.ts     # Operações de pedido
```

**Benefícios**:
- Reutilização de código
- Testabilidade
- Separação de responsabilidades
- Fácil manutenção

### Validação com Zod
Criados schemas centralizados de validação:

```
src/lib/validations/
└── schemas.ts  # Todos os schemas Zod
```

**Schemas disponíveis**:
- `registerUserSchema`
- `loginSchema`
- `updateUserDadosSchema`, `updateUserEnderecoSchema`, `updateUserSenhaSchema`
- `productSchema`, `updateProductSchema`
- `createOrderSchema`, `updateOrderStatusSchema`
- `paginationSchema`

### Constantes Centralizadas
```typescript
src/lib/constants.ts

// Status, roles, tipos, mensagens de erro, regex patterns, etc.
PRODUCT_STATUS, ORDER_STATUS, USER_ROLES, PERSON_TYPE
ERROR_MESSAGES, REGEX_PATTERNS, PAGINATION
```

### Tipos TypeScript
```
src/types/
├── index.ts            # Tipos centralizados
└── ProductTypes.ts     # (mantido para compatibilidade)
```

Novos tipos: `User`, `Order`, `OrderProduct`, `Location`, `Address`, `CartItem`, `ApiError`, `ApiSuccess`, `PaginatedResponse`

---

## 3. API Client e Data Fetching

### API Client Centralizado
```typescript
src/lib/api-client.ts

// Instância padrão
export const apiClient = new ApiClient("/api");

// Métodos: get, post, put, patch, delete
// Tratamento automático de erros
// Suporte a query params
```

### TanStack Query (React Query)
```
src/providers/
└── QueryProvider.tsx   # Provider configurado

src/hooks/
├── useProducts.ts      # Hooks para produtos
└── useOrders.ts        # Hooks para pedidos
```

**Hooks disponíveis**:
- `useProducts()`, `useProduct(id)`
- `useAdminProducts()`, `useCreateProduct()`, `useUpdateProduct()`, `useDeleteProduct()`
- `useUserOrders()`, `useOrder(id)`, `useCreateOrder()`
- `useAdminOrders()`, `useUpdateOrderStatus()`

**Benefícios**:
- Cache automático
- Revalidação inteligente
- Otimistic updates
- Loading/error states automáticos

---

## 4. APIs Refatoradas

Todas as APIs principais foram refatoradas para usar:
- Service Layer
- Validação com Zod
- Paginação
- Tratamento consistente de erros
- Tipos TypeScript adequados

### APIs atualizadas:
- ✅ `/api/produtos` - Lista produtos com paginação
- ✅ `/api/admin/produtos` - CRUD completo de produtos
- ✅ `/api/auth/registro` - Registro com validação Zod
- ✅ `/api/checkout` - Criação de pedidos
- ✅ `/api/pedidos/[id]` - Pedidos do usuário com paginação

---

## 5. Componentes e UI

### Error Boundaries
```
src/components/
└── ErrorBoundary.tsx   # Error boundary reutilizável

src/app/
├── error.tsx           # Error page global
└── loading.tsx         # Loading page global
```

### Loading Components
```
src/components/ui/
└── Loading.tsx
```

Componentes:
- `LoadingSpinner` - Spinner básico
- `LoadingFullScreen` - Tela cheia de loading
- `LoadingCard` - Skeleton de card
- `LoadingTable` - Skeleton de tabela
- `LoadingButton` - Botão com loading

---

## 6. Melhorias de Código

### Removido
- ✅ Biblioteca `bcrypt` duplicada (mantido apenas `bcryptjs`)
- ✅ Dependência `@types/bcrypt`

### Depreciado
- `src/lib/updateUser.ts` - Agora usa `UserService` internamente
- Marcado como `@deprecated` para migração gradual

---

## 7. Como Usar as Novas Funcionalidades

### Exemplo: Buscar Produtos com React Query

```typescript
"use client";

import { useProducts } from "@/hooks/useProducts";
import { LoadingCard } from "@/components/ui/Loading";

export function ProductList() {
  const { data, isLoading, error } = useProducts({ page: 1, limit: 10 });

  if (isLoading) return <LoadingCard />;
  if (error) return <div>Erro: {error.message}</div>;

  return (
    <div>
      {data?.products.map((product) => (
        <ProductCard key={product._id} product={product} />
      ))}
    </div>
  );
}
```

### Exemplo: Criar Pedido com Mutation

```typescript
import { useCreateOrder } from "@/hooks/useOrders";

export function CheckoutButton() {
  const createOrder = useCreateOrder();

  const handleCheckout = async () => {
    try {
      await createOrder.mutateAsync({
        userId: session.user.id,
        products: cart.items,
        location: selectedLocation,
      });
      alert("Pedido criado!");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <button onClick={handleCheckout} disabled={createOrder.isPending}>
      {createOrder.isPending ? "Processando..." : "Finalizar Pedido"}
    </button>
  );
}
```

### Exemplo: Validar Dados com Zod

```typescript
import { registerUserSchema } from "@/lib/validations/schemas";

const result = registerUserSchema.safeParse(formData);

if (!result.success) {
  console.error(result.error.flatten().fieldErrors);
  return;
}

// Dados validados
const validData = result.data;
```

---

## 8. Próximos Passos (Tarefas Pendentes)

### Alta Prioridade
- [ ] Migrar componentes cliente para Server Components onde possível
- [ ] Refatorar página de registro (525 linhas) em componentes menores
- [ ] Criar componente de formulário reutilizável com validação
- [ ] Consolidar validação de senha (remover duplicação)

### Média Prioridade
- [ ] Melhorar tipagem TypeScript (remover `any`)
- [ ] Otimizar carregamento de mapas (lazy loading)
- [ ] Implementar optimistic updates no carrinho
- [ ] Extrair classes Tailwind repetidas

### Baixa Prioridade
- [ ] Configurar ambiente de testes (Vitest + Testing Library)
- [ ] Adicionar rate limiting nas rotas de autenticação
- [ ] Remover código comentado e imports não utilizados

---

## 9. Breaking Changes

### Para Desenvolvedores

1. **Layout Principal**: Agora inclui `QueryProvider`. Se você tem layouts personalizados, certifique-se de incluí-lo.

2. **APIs de Produto**: Agora retornam paginação. Atualize o código cliente:
```typescript
// Antes
const { products } = await fetch("/api/produtos").then(r => r.json());

// Depois
const { products, pagination } = await fetch("/api/produtos").then(r => r.json());
```

3. **API de Registro**: Estrutura de resposta mudou:
```typescript
// Antes
{ message: "Usuário criado", userId: "..." }

// Depois
{ success: true, message: "...", data: { userId: "..." } }
```

4. **Middleware**: Rotas protegidas agora são validadas no middleware. Certifique-se de ter sessão válida.

---

## 10. Estrutura de Diretórios Atualizada

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API Routes (refatoradas)
│   ├── error.tsx          # Error page
│   └── loading.tsx        # Loading page
├── components/
│   ├── ui/                # Componentes UI
│   │   └── Loading.tsx    # Componentes de loading
│   └── ErrorBoundary.tsx  # Error boundary
├── context/               # Zustand stores
├── hooks/                 # Custom hooks
│   ├── useProducts.ts     # React Query hooks
│   └── useOrders.ts       # React Query hooks
├── lib/
│   ├── constants.ts       # Constantes centralizadas
│   ├── api-client.ts      # API client
│   ├── validations/
│   │   └── schemas.ts     # Zod schemas
│   ├── mongoose.ts
│   ├── auth.ts
│   └── updateUser.ts      # @deprecated
├── models/                # Mongoose models
├── providers/
│   └── QueryProvider.tsx  # React Query provider
├── services/              # Service layer
│   ├── user.service.ts
│   ├── product.service.ts
│   └── order.service.ts
├── types/                 # TypeScript types
│   ├── index.ts           # Tipos centralizados
│   └── ProductTypes.ts
└── proxy.ts               # Middleware (Next.js 16)
```

---

## 11. Comandos Úteis

```bash
# Desenvolvimento
npm run dev

# Build
npm run build

# Produção
npm start

# Linting
npm run lint

# Instalar dependências
npm install
```

---

## 12. Observações Importantes

1. **Não commitado**: O arquivo `.env` com credenciais não foi encontrado no histórico do git. Isso é bom!

2. **Next.js 16**: O projeto usa a versão mais recente do Next.js. O middleware é implementado via `proxy.ts`.

3. **React 19**: Compatível com React 19.2.0.

4. **TypeScript Strict**: O projeto está em modo strict. Continue seguindo boas práticas.

5. **Paginação Padrão**: Todas as APIs de listagem agora suportam `?page=1&limit=10`.

---

## 13. Contribuindo

Ao adicionar novas features:

1. Crie schemas de validação em `src/lib/validations/schemas.ts`
2. Adicione lógica de negócio em `src/services/`
3. Use constants de `src/lib/constants.ts`
4. Implemente tipos em `src/types/`
5. Use hooks do React Query quando possível
6. Adicione error handling adequado

---

**Refatoração realizada em**: 2025-01-17
**Status**: ✅ Concluída (Fase 1 - Core)
