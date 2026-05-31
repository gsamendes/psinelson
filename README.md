# PsiApp

Plataforma digital de conexão entre **pacientes** e **psicólogos** — MVP acadêmico do 7º período de Engenharia de Software.

## Sobre

O PsiApp permite que pacientes **encontrem psicólogos**, vejam informações relevantes, **solicitem agendamentos** e acompanhem suas consultas. Para psicólogos, oferece **gestão de agenda**, recebimento e **análise de solicitações** (aceitar/recusar), controle de pacientes vinculados e, futuramente, prontuário com segurança reforçada.

### Problema que resolve
Encontrar um psicólogo adequado e marcar consulta costuma ser burocrático e pouco transparente. O PsiApp centraliza busca por critérios **profissionais** (especialidade, modalidade, disponibilidade, localização, faixa de valor), pedido de horário e acompanhamento de status — sem filtros sensíveis ou discriminatórios.

### Público-alvo
- **Pacientes** buscando atendimento psicológico (online, presencial ou híbrido).
- **Psicólogos** que querem gerir agenda e solicitações de forma simples.

## Escopo do MVP (7º período)

Frontend funcional e demonstrável com **dados simulados**, mais o **esqueleto do backend** (Express + Prisma) e **contratos de API** prontos para integração no 8º período. A prioridade é uma base profissional, organizada e coerente com a documentação — sem prometer o que ainda não está integrado.

## Stack

**Frontend:** React · TypeScript · Vite · Mantine UI · React Router · Zustand · TanStack Query
**Backend (esqueleto):** Node.js · Express · TypeScript · Prisma · PostgreSQL (Neon) · JWT · Zod
**Arquitetura:** Client-Server · Monólito Modular · Multi-Tenant (por `tenantId`) · Stateless (JWT) · API REST

> Decisão: o MVP usa **Express (não NestJS)** — ver `docs/DECISIONS.md` (ADR-004).

## Status do projeto

| Camada | Estado |
|---|---|
| Frontend (telas paciente + psicólogo) | ✅ Funcional com mocks |
| Camada de services com toggle mock/real | ✅ Pronta (`VITE_USE_MOCKS`) |
| Backend Express + Prisma (esqueleto) | ✅ Compila; rotas alinhadas aos contratos |
| Banco PostgreSQL (migração/seed) | ⬜ Pendente (Neon) |
| Integração real ponta a ponta | ⬜ Planejada p/ 8º período |
| Prontuário clínico | 🔒 Placeholder seguro (bloqueado por design) |

Detalhes em `docs/DELIVERY_SUMMARY.md` e `docs/PROGRESS_LOG.md`.

## Como rodar

### Frontend
```bash
cd frontend
npm install
npm run dev        # http://localhost:5173
npm run build      # tsc -b + vite build
npm run typecheck  # checagem de tipos
```
Login fake: qualquer credencial entra; o seletor "Sou Paciente / Sou Psicólogo" define o papel e o redirecionamento.

### Backend (esqueleto)
```bash
cd backend
npm install
copy .env.example .env       # Windows (Linux/macOS: cp)
npm run prisma:generate      # gera o Prisma Client
npm run dev                  # tsx watch — http://localhost:3333
npm run build                # tsc -> dist/
# Requer DATABASE_URL real para migrar:
npm run prisma:migrate
```
Health check: `GET /health`. Rotas sob `/api`. Contratos em `docs/API_CONTRACTS.md`.

## Variáveis de ambiente

**Frontend** (`frontend/.env`, opcional — padrão usa mocks):
```
VITE_USE_MOCKS=true                       # 'false' para chamar a API real
VITE_API_URL=http://localhost:3333/api
```

**Backend** (`backend/.env`):
```
PORT=3333
NODE_ENV=development
DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/psiapp?schema=public"
JWT_SECRET="troque-este-segredo-em-producao"
JWT_ACCESS_EXPIRES_IN="15m"
JWT_REFRESH_EXPIRES_IN="7d"
CORS_ORIGIN="http://localhost:5173"
```

## Funcionalidades

### ✅ Implementadas (frontend, demonstráveis)
- Landing, login/cadastro e seleção de perfil (fake por papel).
- Rotas protegidas por papel (`ProtectedRoute`).
- Dashboard do paciente; busca de psicólogos com filtros permitidos; detalhe do psicólogo.
- Solicitação de agendamento (status nasce **PENDENTE**); Minhas Consultas por status.
- Dashboard do psicólogo; gestão de disponibilidade (CRUD); solicitações com **aceitar/recusar**; agenda com status visual.
- Notificações e mensagens administrativas simuladas.
- Navegação responsiva (desktop + barra inferior mobile).

### 🟡 Simuladas (dados em memória / mocks)
- Persistência das consultas, disponibilidades, notificações e mensagens (somem ao recarregar).
- Login (não há validação real de credenciais nesta fase).

### 🔒 Placeholder seguro
- **Prontuário**: tela meramente ilustrativa, com aviso de que dados clínicos exigem backend, JWT, RBAC, `tenant_id`, vínculo terapêutico ativo e auditoria. **Não** exibe dados clínicos.

### ⬜ Planejadas para o 8º período
Backend real integrado, autenticação JWT real, persistência Prisma + PostgreSQL, regras transacionais de agendamento, RBAC efetivo, auditoria, prontuário seguro, notificações/mensagens persistidas, testes automatizados e deploy. Ver `docs/NEXT_STEPS_8_PERIOD.md`.

## Documentação

| Documento | Conteúdo |
|---|---|
| `docs/AI_CONTEXT.md` | Contexto oficial do produto/escopo |
| `docs/DECISIONS.md` | Decisões de arquitetura (ADRs) |
| `docs/API_CONTRACTS.md` | Contratos REST do MVP |
| `docs/TEST_PLAN.md` | Plano de testes manuais |
| `docs/DELIVERY_SUMMARY.md` | Resumo da entrega do 7º período |
| `docs/NEXT_STEPS_8_PERIOD.md` | Evolução planejada |
| `docs/SCREENSHOT_GUIDE.md` | Telas para print na documentação |
| `docs/PRESENTATION_SCRIPT.md` | Roteiro de apresentação |
| `docs/PROGRESS_LOG.md` | Histórico de evolução |
| `backend/README.md` | Detalhes do backend |
