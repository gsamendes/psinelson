# PsiApp — Backend

Backend do PsiApp em **Node.js + Express + TypeScript + Prisma**.
Arquitetura: **Monólito Modular Multi-Tenant, Stateless (JWT)** — ver `../docs/DECISIONS.md`.

> Esta etapa é o **esqueleto** do backend: estrutura, schema Prisma, autenticação e rotas iniciais por módulo. Regras clínicas e prontuário real **não** estão implementados.

## Stack

- Express 4 + TypeScript
- Prisma ORM + PostgreSQL (Neon no deploy)
- JWT (`jsonwebtoken`) — access + refresh, stateless
- `bcryptjs` para hash de senha
- `zod` para validação
- `helmet` + `cors` para segurança básica

## Estrutura

```
backend/
├─ prisma/
│  └─ schema.prisma          # entidades + enums + multi-tenancy (tenantId)
├─ src/
│  ├─ server.ts              # bootstrap do listener
│  ├─ app.ts                 # montagem do Express (middlewares + rotas)
│  ├─ routes.ts              # agrega as rotas dos módulos sob /api
│  ├─ config/                # env validado (zod)
│  ├─ shared/
│  │  ├─ prisma/             # prismaClient (singleton)
│  │  ├─ middlewares/        # errorHandler, authMiddleware, tenantMiddleware
│  │  ├─ http/               # validateBody (zod), context (tenant/user)
│  │  ├─ utils/              # jwt, password, asyncHandler
│  │  ├─ errors/             # AppError, NotImplementedError
│  │  └─ types/              # augment do Express (req.user, req.tenantId)
│  └─ modules/               # um diretório por domínio
│     ├─ auth/               # register + login (implementados)
│     ├─ users/
│     ├─ patients/
│     ├─ psychologists/
│     ├─ tenants/
│     ├─ scheduling/         # disponibilidade
│     ├─ appointments/       # solicitação + aceitar/recusar
│     ├─ therapeutic-bonds/
│     ├─ medical-records/    # bloqueado (501) nesta fase
│     ├─ messages/
│     ├─ notifications/
│     └─ audit/
```

Cada módulo segue o padrão `routes.ts → controller.ts → service.ts` (+ `schemas.ts` quando há validação).

## Configuração

```bash
cd backend
npm install
cp .env.example .env   # no Windows: copy .env.example .env
# edite o .env com a sua DATABASE_URL (PostgreSQL/Neon) e JWT_SECRET
```

Variáveis (`.env`): `PORT`, `NODE_ENV`, `DATABASE_URL`, `JWT_SECRET`, `JWT_ACCESS_EXPIRES_IN`, `JWT_REFRESH_EXPIRES_IN`, `CORS_ORIGIN`.

## Prisma

```bash
npm run prisma:generate   # gera o Prisma Client (necessário antes do build)
npm run prisma:migrate    # cria/aplica migração (precisa de DATABASE_URL válido)
npm run prisma:seed       # popula dados demo (tenant + usuários + disponibilidades)
npm run prisma:studio     # GUI do banco
```

**Setup com banco real (Neon):** crie um banco no Neon, coloque a `DATABASE_URL` no `.env`, e rode:
```bash
npm run prisma:generate && npm run prisma:migrate && npm run prisma:seed
```
Logins demo após o seed (senha `123456`): `ana.costa@email.com` (psicóloga) e `camila.souza@email.com` (paciente).

## Execução

```bash
npm run dev     # tsx watch — desenvolvimento com reload
npm run build   # tsc -> dist/
npm start       # node dist/server.js (após build)
```

Health check: `GET /health`. Rotas da API sob `/api`.

## Endpoints iniciais (resumo)

| Método | Rota | Observação |
|--------|------|------------|
| POST | `/api/auth/register` | cadastro (bcrypt) |
| POST | `/api/auth/login` | retorna access + refresh token |
| GET | `/api/users` / `/api/users/me` / `/api/users/:id` | requer JWT |
| GET | `/api/psychologists` / `/:id` | busca de profissionais |
| GET/POST/DELETE | `/api/scheduling` | disponibilidade (psicólogo) |
| POST | `/api/appointments` | solicita consulta → `PENDENTE` |
| PATCH | `/api/appointments/:id/accept` | → `CONFIRMADA` |
| PATCH | `/api/appointments/:id/reject` | → `RECUSADA` |
| GET | `/api/notifications/me` | notificações do usuário |
| GET | `/api/medical-records` | **501** — bloqueado nesta fase |
| GET | `/api/audit` | somente `ADMIN` |

Autenticação: enviar `Authorization: Bearer <accessToken>`. O `tenantId` vem do JWT; rotas públicas aceitam o header `x-tenant-id`.

## Não escopo desta etapa

NestJS · microsserviços · schema por tenant · prontuário clínico real · regras clínicas sensíveis · integração com o frontend.
