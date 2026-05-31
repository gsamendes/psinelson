# PsiApp — Progress Log (raiz)

> Log macro do projeto. Detalhe técnico do frontend em [`../frontend/docs/PROGRESS_LOG.md`](../frontend/docs/PROGRESS_LOG.md).

## Etapa 9 — Refresh token, seed e login real (preparação de integração) · 2026-05-31

Objetivo: avançar a integração — `POST /auth/refresh`, seed do banco e login real no frontend — mantendo mocks como padrão e sem exigir banco para os testes.

### Feito
- **Backend `POST /auth/refresh`**: `refreshSchema` (Zod), `authService.refresh` (verifica refresh token e re-emite access+refresh, stateless), `authController.refresh`, rota pública validada.
- **Seed Prisma** (`prisma/seed.ts`, idempotente): tenant `demo`, psicóloga (`ana.costa@email.com`) + perfil, paciente (`camila.souza@email.com`) + perfil, 3 disponibilidades. Senha demo `123456` (bcrypt). Script `prisma:seed` + bloco `prisma.seed` no `package.json`.
- **Testes de integração (Prisma mockado, sem banco)**: `tests/auth-service.test.ts` (register com hash; duplicado 409; login ok/erro; refresh) e `tests/appointments-service.test.ts` (cancel PENDENTE→CANCELADA; 409; 404). `tests/refresh.test.ts` cobre a rota (400/401/200).
- **Frontend — login real ligado**: `authStore.signIn(email,password)` chama `authService.login`, mapeia papel da API (maiúsculo→minúsculo) e persiste token; `logout` limpa token. `Login.tsx`: campos controlados; em modo mock mantém `login(role)` (sem rede); em modo real (`VITE_USE_MOCKS=false`) usa `signIn` com loading e notificação de erro. Teste de `signIn` (modo mock) adicionado.

### Não feito (depende de você / 8º período)
- **Provisionar Neon + `prisma migrate dev`**: exige `DATABASE_URL` real (conta Neon) — não executável aqui. Passo a passo no `backend/README.md`.
- Validação real ponta a ponta (`VITE_USE_MOCKS=false`) só após migrar/seed.
- Revogação/rotação persistida do refresh token; registro real (Register) com seleção de tenant.

### Qualidade (comandos executados)
- `npm run test:all` (raiz): **51/51 verdes** — frontend **23** (7 arquivos) + backend **28** (6 arquivos).
- Frontend `npm run build` (tsc -b + vite): **OK**. Backend `npm run build` (tsc): **OK**.

### Arquivos criados
- `backend/prisma/seed.ts`, `backend/tests/{auth-service,appointments-service,refresh}.test.ts`.

### Arquivos alterados
- Backend: `modules/auth/{schemas,service,controller,routes}.ts`, `package.json` (script + `prisma.seed`), `README.md`.
- Frontend: `stores/authStore.ts`, `pages/Login.tsx`, `stores/__tests__/authStore.test.ts`.
- Docs: `API_CONTRACTS.md` (refresh ✅), `TEST_AUTOMATION.md` (51 testes), este log.

### Pendências (8º período)
- Neon + migrate + seed; integração real ligada; testes de integração com banco real; E2E; revogação de refresh; cadastro real com tenant.

### Próximo passo
**PROMPT 10** — Após criar o banco no Neon e definir `DATABASE_URL`: rodar `prisma:generate/migrate/seed`, subir o backend, ligar `VITE_USE_MOCKS=false` e validar login→busca→agendamento→aceite ponta a ponta; depois adicionar testes de integração contra um banco de teste.



## Etapa 8 — Testes automatizados do MVP · 2026-05-31

Objetivo: suíte inicial de testes automatizados validável por comandos no terminal, sem banco real e sem quebrar o app funcional.

### Bibliotecas instaladas (dev)
- **Frontend:** `vitest@^2`, `@testing-library/react`, `@testing-library/jest-dom`, `@testing-library/user-event`, `jsdom`.
- **Backend:** `vitest@^2`, `supertest`, `@types/supertest`.
- Gerenciador: **npm** (lockfiles em frontend/backend). Nenhuma lib de teste existia antes.

### Arquivos de teste criados
- Frontend: `src/stores/__tests__/authStore.test.ts`, `src/services/__tests__/psychologistService.test.ts`, `src/services/__tests__/appointmentService.test.ts`, `src/pages/__tests__/{Login,Register,PatientSearch,PsychologistRecord}.test.tsx`.
- Setup frontend: `vitest.config.ts`, `src/test/setup.ts`, `src/test/renderWithProviders.tsx`, `tsconfig.test.json`.
- Backend: `tests/{health,auth,security}.test.ts`, `vitest.config.ts`.

### Arquivos alterados
- `frontend/package.json` — scripts `test`, `test:run`, `test:coverage`.
- `frontend/tsconfig.app.json` — exclui `*.test.*` e `src/test` do build (protege `tsc -b`).
- `backend/package.json` — scripts `test`, `test:run` (+ devDeps de teste).
- `package.json` (raiz, **novo**) — `test:frontend`, `test:backend`, `test:all`.
- `docs/TEST_AUTOMATION.md` (**novo**) — cobertura, como rodar, pendências, limitações.

### Scripts de teste disponíveis
- Raiz: `npm run test:all` · `test:frontend` · `test:backend`.
- Frontend: `npm test` · `test:run` · `test:coverage`.
- Backend: `npm test` · `test:run`.

### Comandos executados e resultado
- `npm run test:run` (frontend): **22/22 passaram** (7 arquivos).
- `npm run test:run` (backend): **15/15 passaram** (3 arquivos).
- `npm run test:all` (raiz): **37/37 passaram**.
- `npm run build` (frontend e backend): **OK** após excluir testes do build.

### Quais passaram
- Frontend: login simulado por papel; render de Login/Cadastro; filtros permitidos + ausência de filtros sensíveis; prontuário placeholder seguro; serviço de psicólogos (filtros/detalhe/erro); fluxo de agendamento (PENDENTE→CONFIRMADA/RECUSADA/CANCELADA).
- Backend: `/health`; validação Zod de register/login (400); proteção por token (401) em todas as rotas protegidas, incluindo `/medical-records`.

### Quais falharam
- Nenhum no estado final. Durante o desenvolvimento, 4 testes de render falharam por seletor ambíguo (texto de título == texto de botão/badge: "Entrar", "Criar conta", "demonstração", "faixa de valor"); corrigido usando `getByRole('button')`/`getAllByText`. **Correção apenas nos testes — sem mudança no app.**

### Problemas encontrados / correções mínimas
- `tsc -b` passaria a compilar os testes (quebraria o build) → adicionado `exclude` em `tsconfig.app.json` e testes do backend colocados fora de `src/`. Nenhuma correção estrutural de código de produção foi necessária.

### Pendências (8º período)
- Testes que exigem banco real (listagens/persistência), login real + `/auth/refresh`, integração `VITE_USE_MOCKS=false`, E2E (Playwright/Cypress), validação de campos obrigatórios na UI (hoje inexistente).

### Próximo passo
**PROMPT 09** — Provisionar Neon, rodar `prisma migrate dev` + seed, e adicionar testes de integração de backend com banco de teste (ou Prisma mockado), além de ligar o login real no frontend.



## Etapa 7 — Qualidade, evidências e preparação da entrega · 2026-05-30

Objetivo: deixar o PsiApp pronto para entrega acadêmica (README, evidências, testes manuais, roteiro, separação implementado/simulado/planejado). Sem features novas; sem grande refatoração.

### Arquivos revisados
- `docs/AI_CONTEXT.md`, `docs/DECISIONS.md`, `docs/BACKLOG_MVP.md`, `docs/API_CONTRACTS.md`, `docs/SCREENSHOT_GUIDE.md`, `docs/TEST_PLAN.md`, `frontend/package.json`, `backend/package.json`. (`docs/DESIGN_FOUNDATIONS.md` não existe — ignorado conforme regra "se existir".)

### Arquivos criados
- `README.md` (raiz) — descrição, problema, público, escopo, stack, arquitetura, status, como rodar (front/back), env, e separação implementado/simulado/planejado.
- `docs/DELIVERY_SUMMARY.md` — resumo objetivo da entrega do 7º período.
- `docs/NEXT_STEPS_8_PERIOD.md` — evolução planejada (backend real, JWT, Prisma/Postgres, RBAC, tenant, auditoria, prontuário seguro, testes, deploy, monitoramento).
- `docs/PRESENTATION_SCRIPT.md` — roteiro de apresentação (abertura → fechamento + perguntas prováveis).

### Arquivos atualizados
- `docs/TEST_PLAN.md` — expandido de fluxo do paciente para **23 casos** (TC-01..TC-23) cobrindo login/perfil/rotas/dashboards/busca/filtros/agendamento/aceite-recusa/disponibilidade/notificações/mensagens/prontuário/fallback-mocks/responsividade, no formato objetivo/pré-condição/passos/esperado/status/obs.
- `docs/SCREENSHOT_GUIDE.md` — tabela com rota, objetivo, requisito e natureza (funcional/simulado/placeholder) + print mobile.

### Problemas encontrados / correções
- Nenhum erro de build/typecheck. Constatado que **não havia README na raiz** (só `backend/README.md`) → criado. Nenhuma correção de código necessária (sem imports quebrados, rotas ausentes ou erros de TS).

### Qualidade (comandos executados)
- Frontend `npm run build` (tsc -b + vite): **OK** (aviso não bloqueante de chunk > 500 kB).
- Frontend `npm run typecheck` (tsc -b --noEmit): **OK**.
- Backend `npm run build` (tsc): **OK**, sem erros.
- (Sem script de lint configurado nos projetos — não aplicável.)

### Status final do projeto
- Frontend **demonstrável** ponta a ponta com mocks; backend **esqueleto compilando**; contratos e toggle mock/real prontos; documentação acadêmica completa.

### Pendências para o 8º período
- Migrar banco no Neon + seed; JWT real + `/auth/refresh`; integração real (`VITE_USE_MOCKS=false`); regras transacionais + concorrência de horários; RBAC efetivo; auditoria; prontuário seguro; notificações/mensagens persistidas; testes automatizados; deploy (Vercel + Render). Ver `docs/NEXT_STEPS_8_PERIOD.md`.

### Próximo passo
**PROMPT 08** — Provisionar Neon, rodar `prisma migrate dev` + seed, implementar `POST /auth/refresh` e ativar o login real no frontend (`authStore` → `authService`), validando o agendamento ponta a ponta com `VITE_USE_MOCKS=false`.



## Etapa 6 — Contratos de API + camada de integração (mock/real) · 2026-05-30

Objetivo: preparar a integração frontend↔backend **sem quebrar** o frontend mockado. Default permanece **mocks**.

### Feito
- **`docs/API_CONTRACTS.md`** (novo): documenta os endpoints do MVP (auth, psychologists, availability, appointments, notifications, messages) com finalidade, perfil/RBAC, método, URL, params, query, body, resposta, status HTTP, regras de segurança e observações de `tenantId`/JWT. Inclui tabela service→endpoint.
- **Frontend — camada de services preparada p/ alternância mock/real (não quebra telas):**
  - `config/runtime.ts` — flag `USE_MOCKS` (default true) e `API_URL`, via `VITE_USE_MOCKS`/`VITE_API_URL`.
  - `services/apiClient.ts` — cliente HTTP fino (Bearer + `x-tenant-id` via localStorage, `ApiError`). Só roda em modo real.
  - Dual-mode adicionado a `psychologistService`, `appointmentService`, `notificationService` (mock continua idêntico; ramo real chama os endpoints documentados).
  - Novos `authService` (login/register/me) e `messageService` (list/send), ambos mock/real.
  - `.env.example` do frontend + augment de `import.meta.env` em `vite-env.d.ts`.
- **Frontend — tipos por entidade** (`types/`): `user.ts`, `auth.ts`, `psychologist.ts`, `availability.ts`, `appointment.ts`, `notification.ts`, `message.ts`. `types/index.ts` virou barril que reexporta tudo → **imports antigos `from '../types'` seguem válidos**.
- **Backend — rotas alinhadas ao contrato:**
  - `GET /auth/me`.
  - `GET /appointments/me` (deriva paciente/psicólogo pelo papel) e `PATCH /appointments/:id/cancel`.
  - `GET /availability/:psychologistId` (alias de scheduling).
  - `GET /messages` + `POST /messages` (com `sendMessageSchema` Zod).
- **Zod**: schemas iniciais cobertos — `registerSchema`, `loginSchema`, `createAvailabilitySchema`, `createAppointmentSchema`, `sendMessageSchema`.

### Regras respeitadas
- Sem NestJS / microsserviços / schema por tenant.
- Mocks mantidos (default); telas existentes intactas; senha só com bcrypt; stateless JWT.
- Prontuário **não** integrado (`/medical-records` segue `501`).
- Decisão Express já registrada (ADR-004); nenhuma nova decisão arquitetural.

### Qualidade
- Frontend `npm run build` (tsc -b + vite): **OK** (só aviso de chunk > 500 kB).
- Backend `npm run build` (tsc): **OK**, sem erros.

### Endpoints documentados
`POST /auth/register` · `POST /auth/login` · `GET /auth/me` · `GET /psychologists` · `GET /psychologists/:id` · `GET /availability/:psychologistId` · `POST /appointments` · `GET /appointments/me` · `PATCH /appointments/:id/accept` · `PATCH /appointments/:id/reject` · `PATCH /appointments/:id/cancel` · `GET /notifications/me` · `GET /messages` · `POST /messages`.

### Estado dos endpoints
- **Prontos no backend (sem migração de banco):** todos os acima (compilam; dependem de `prisma migrate` + dados reais p/ rodar).
- **Mockados no frontend (default):** todos — o app funciona 100% sem backend.
- **Pendentes:** `POST /auth/refresh`; mappers de shape (Profile→Psychologist, Message→AdminMessage) no ramo real; disponibilidade real no detalhe do psicólogo; prontuário (bloqueado por design).

### Pendências técnicas
- Migrar banco no Neon (`prisma migrate dev`) + seed; só então `VITE_USE_MOCKS=false` funciona de ponta a ponta.
- Implementar `/auth/refresh` e wiring do `authService` no `authStore` (login real no lugar do fake).
- Ajustar mapeamento de shapes nos ramos reais dos services.

### Próximo passo
**PROMPT 07** — Provisionar PostgreSQL no Neon, rodar `prisma migrate dev` + seed (tenant demo, usuários, perfis, disponibilidades), implementar `POST /auth/refresh` e ligar o **login real** no frontend (`authStore` → `authService`), validando o agendamento ponta a ponta com `VITE_USE_MOCKS=false`.



## Etapa 5 — Esqueleto do backend (Express + TS + Prisma) · 2026-05-30

Criada a base do backend em `/backend`: **Node.js + Express + TypeScript + Prisma**, arquitetura Monólito Modular Multi-Tenant + Stateless (JWT). Decisão de usar Express (não NestJS) registrada em **ADR-004**.

### Feito
- **Projeto/config**: `package.json` (scripts dev/build/start/prisma), `tsconfig.json` (strict + noUnused), `.env.example` (`PORT`, `DATABASE_URL`, `JWT_SECRET`, expirações, `CORS_ORIGIN`), `.gitignore`, `README.md`.
- **Bootstrap**: `src/server.ts` (listener) + `src/app.ts` (helmet, cors, json, tenantMiddleware, `/health`, `/api`, errorHandler) + `src/routes.ts` (agrega módulos).
- **Config**: `src/config/env.ts` — validação das envs com Zod.
- **Shared**:
  - `shared/prisma/prismaClient.ts` — Prisma Client singleton.
  - `shared/middlewares/` — `errorHandler`, `authMiddleware` (+ `requireRole` p/ RBAC), `tenantMiddleware`.
  - `shared/http/` — `validateBody` (Zod), `context` (`requireTenant`/`requireUserId`).
  - `shared/utils/` — `jwt` (access+refresh), `password` (bcryptjs), `asyncHandler`.
  - `shared/errors/AppError.ts` — `AppError` + `NotImplementedError`.
  - `shared/types/express.d.ts` — augment de `req.user` / `req.tenantId`.
- **Prisma schema** (`prisma/schema.prisma`): models `Tenant`, `User`, `PatientProfile`, `PsychologistProfile`, `Availability`, `Appointment`, `TherapeuticBond`, `MedicalRecord`, `Message`, `Notification`, `AuditLog`; enums `UserRole`, `AppointmentStatus`, `NotificationType`, `TherapeuticBondStatus`; `tenantId` + índices em todas as tabelas relevantes.
- **Módulos** (`src/modules`, padrão `routes/controller/service[/schemas]`):
  - `auth` — register + login implementados (bcrypt + JWT). Schemas Zod de cadastro/login.
  - `users`, `patients`, `psychologists`, `tenants` — listagem/consulta escopada por tenant (RBAC onde aplicável).
  - `scheduling` — disponibilidade (criar/listar/remover) + schema Zod.
  - `appointments` — solicitação (`PENDENTE`) + `accept` (`CONFIRMADA`, marca horário reservado em transação) + `reject` (`RECUSADA`) + schema Zod.
  - `therapeutic-bonds` — listagem por tenant/psicólogo.
  - `medical-records` — **bloqueado (501)** de propósito; exige RBAC + vínculo + auditoria.
  - `messages`, `notifications` — listagem do usuário (+ marcar lidas).
  - `audit` — `record()` p/ uso interno + listagem `ADMIN`.

### Regras respeitadas
- Sem NestJS, sem microsserviços, sem schema por tenant.
- Senha sempre via **bcryptjs** (nunca em texto puro). Backend **stateless** (JWT).
- Prontuário real **não** implementado (rota retorna 501).
- Multi-tenant por `tenantId` aplicado nas queries dos services.
- Não conectado ao frontend (sem contrato fechado ainda).

### Qualidade
- `npm install` → OK (0 vulnerabilidades).
- `npm run prisma:generate` → OK (Prisma Client v5.22).
- `npm run build` (tsc) → **OK**, sem erros (gera `dist/`, 55 arquivos JS).

### Pendências técnicas
- **Migração do banco** ainda não rodada (`prisma migrate dev` exige `DATABASE_URL` real do Neon).
- Endpoints são esqueleto: faltam regras completas (derivar `patientId` do usuário logado, notificações automáticas no aceite/recusa, registro de auditoria nas operações sensíveis).
- **Refresh token** é emitido, mas falta rota `/auth/refresh` e revogação.
- Sem testes automatizados.
- Integração frontend↔backend (trocar services em memória do front por HTTP) ainda não feita.
- `medical-records`, `therapeutic-bonds` e `messages` precisam de regras de vínculo/criação.

### Próximo passo
**PROMPT 06** — Provisionar PostgreSQL no Neon, rodar `prisma migrate dev` + seed inicial (tenant demo + usuários), e implementar `/auth/refresh`. Em seguida, conectar o módulo `Auth` ao frontend (login real substituindo o fake).



## Etapa 4 — Refino de UI, responsividade e padronização · 2026-05-30

Objetivo: deixar o frontend apresentável para o documento acadêmico e demo do MVP. Sem mudança de arquitetura e sem features novas.

### Feito
- **Componentes reutilizáveis** (`src/components/common/`), eliminando repetição:
  - `EmptyState` — estado vazio padrão (ícone + título + descrição + ação opcional).
  - `ErrorState` — alerta de erro com "Tentar novamente".
  - `StatCard` — card de indicador (número + rótulo + ícone), opcionalmente clicável.
- **Refatoração** para usar os componentes acima: `PatientSearch`, `PatientAppointments`, `PsychologistRequests`, `PsychologistSchedule`, `PsychologistAvailability`, `PsychologistDashboard` (removida definição local duplicada de `StatCard`).
- **Navegação responsiva real**: `Sidebar` agora é **role-aware e funcional** (navega de verdade via React Router, item ativo por rota). No desktop é o trilho lateral de ícones; no mobile vira **barra inferior** (rolável quando há muitos itens). Inclui ação de **Sair**. Antes a sidebar era decorativa e a navegação some­tia em telas < 1080px.
- **Topbar** role-aware (itens distintos paciente/psicólogo) já alinhada à navegação.
- **Estados vazios e mensagens claras** padronizados em todas as listas principais.
- **Textos** revisados para pt-BR consistente.
- **`docs/SCREENSHOT_GUIDE.md`** criado: lista priorizada de prints (login, cadastro, dashboards, busca, detalhe, agendamento, consultas, disponibilidade, solicitações, agenda) + roteiro ponta-a-ponta.

### Consistência visual
- Cards (`.psi-card`), badges (`statusMeta`), formulários (Mantine + `SegmentedControl`), botões (raio `xl`, cor `psiGreen`) e listas seguem o mesmo padrão entre telas.
- Grids responsivos (`SimpleGrid`/`Grid` com breakpoints `base/sm/md/lg`).

### Não feito (proposital)
- Sem mudança de arquitetura (ADRs mantidos).
- Sem features novas fora do escopo.

### Qualidade
- `npm run build` (tsc -b + vite build): **OK**. Aviso apenas de chunk > 500 kB (não bloqueante).

### Checklist de telas prontas
- [x] Login · `/login`
- [x] Cadastro / seleção de perfil · `/register`
- [x] Dashboard do paciente · `/patient/dashboard`
- [x] Busca de psicólogos · `/patient/search`
- [x] Detalhe do psicólogo · `/patient/psychologist/:id`
- [x] Solicitação de agendamento (modal → PENDENTE) · `/patient/psychologist/:id`
- [x] Minhas consultas · `/patient/appointments`
- [x] Dashboard do psicólogo · `/psychologist/dashboard`
- [x] Disponibilidade (CRUD) · `/psychologist/availability`
- [x] Solicitações recebidas (aceitar/recusar) · `/psychologist/requests`
- [x] Agenda do psicólogo (status visual) · `/psychologist/schedule`
- [x] Mensagens administrativas · `/psychologist/messages`
- [x] Prontuário (placeholder com avisos) · `/psychologist/record`

### Próximo passo
**PROMPT 05** — Iniciar **backend real** (NestJS + Prisma + PostgreSQL/Neon): módulo `Auth` (JWT access+refresh, RBAC) e `Agendamento`, substituindo os services em memória sem alterar as telas. Alternativa: edição de perfil (paciente/psicólogo).



## Etapa 3 — Fluxo principal do psicólogo · 2026-05-30

Fluxo entregue (frontend, dados simulados):
`login psicólogo → dashboard → disponibilidade → solicitações → aceitar/recusar → status muda (CONFIRMADA/RECUSADA) → paciente notificado (simulado)`.

### Feito
- **Camada de serviços** (prep p/ API real):
  - `availabilityService.ts` — "banco" em memória de horários do psicólogo: `listSlots`/`addSlot`/`updateSlot`/`removeSlot`, com validação de duplicidade (data+hora) e derivação do dia da semana.
  - `notificationService.ts` — notificações internas **simuladas** (sem tempo real): `listNotifications(audience)`, `pushNotification(...)`, `markAllRead(...)`.
  - `appointmentService.ts` estendido — fonte de verdade única paciente↔psicólogo: `listPsychologistAppointments`, `acceptAppointment` (→ **CONFIRMADA**, bloqueia duplo-agendamento do mesmo horário), `rejectAppointment` (→ **RECUSADA**). Aceite/recusa dispara notificação ao paciente; nova solicitação dispara notificação ao psicólogo. Consulta agora carrega `patientName`/`patientAvatar`.
- **Hooks TanStack Query** (`hooks/usePsychologistConsole.ts`): `usePsychologistAppointments`, `useAcceptAppointment`/`useRejectAppointment` (invalidam visão do paciente e do psicólogo + notificações), `useSlots`/`useAddSlot`/`useUpdateSlot`/`useRemoveSlot`, `useNotifications`/`useMarkNotificationsRead`.
- **Tipos**: `PsychologistSlot`, `InternalNotification`, `NotificationKind`, `LinkedPatient`, `AdminMessage`; `PatientAppointment` enriquecido com dados do paciente.
- **Mocks**: `currentPsychologist` (Dra. Ana Costa, perfil `p1`), `linkedPatients` (3 fictícios), `psychologistSlotsSeed`, `adminMessages`; seeds PENDENTE/CONFIRMADA p/ a Dra. Ana alimentarem solicitações e agenda.
- **Telas**:
  - `/psychologist/dashboard` — 4 indicadores (pendentes, confirmadas, próximos atendimentos, pacientes vinculados), próximos atendimentos, feed de notificações, lista de pacientes vinculados.
  - `/psychologist/availability` — cadastrar, **editar** (modal) e **remover** horários (data/hora/modalidade) com feedback.
  - `/psychologist/requests` — solicitações pendentes com **Aceitar/Recusar**.
  - `/psychologist/schedule` — agenda por data com status visual (barra colorida por status) e filtro.
  - `/psychologist/messages` — mensagens administrativas (sem tempo real) + notificações internas com "marcar como lidas".
  - `/psychologist/record` — **placeholder de prontuário** com aviso explícito: dados clínicos exigem backend, JWT, RBAC, tenant_id, vínculo terapêutico e auditoria. Prontuário **bloqueado** por paciente.
- **Topbar** agora é role-aware (navegação distinta p/ paciente e psicólogo).

### Regras de negócio respeitadas
- Fluxo coerente: solicitação **PENDENTE** → análise do psicólogo → **aceite/recusa** → notificação ao paciente. Nunca confirma automático.
- Um horário não pode ser confirmado para mais de um paciente (validação no aceite).
- **Prontuário real não é exposto**; sem acesso livre a dados clínicos (tela meramente ilustrativa, com avisos).
- Aceite/recusa reflete na visão do paciente (mesma fonte em memória).

### Qualidade
- `npm run build` (tsc -b + vite build): **OK**. Aviso apenas de chunk > 500 kB (não bloqueante).

### Pendências
- Persistência some ao recarregar (banco em memória) — esperado nesta fase.
- Backend real (NestJS + Prisma + PostgreSQL/Neon, JWT, RBAC, multi-tenant, auditoria).
- Prontuário clínico real (somente com backend seguro).
- Login fake: papel definido na tela de login; futura troca por auth real.

### Telas prontas para printar (documento)
- `/psychologist/dashboard` (indicadores + notificações + pacientes vinculados)
- `/psychologist/requests` (aceitar/recusar)
- `/psychologist/availability` (cadastro + edição + remoção)
- `/psychologist/schedule` (agenda com status visual)
- `/psychologist/messages` (mensagens administrativas + notificações)
- `/psychologist/record` (placeholder de prontuário com avisos de segurança)
- Para o efeito ponta-a-ponta: aceitar uma solicitação e mostrar a consulta como **Confirmada** em `/patient/appointments`.

### Próximo passo
**PROMPT 04** — Edição de perfil (paciente/psicólogo) + refinamento de responsividade mobile; ou iniciar **backend real** (NestJS + Prisma + Auth JWT/RBAC) para substituir os services em memória.



## Etapa 2 — Fluxo principal do paciente · 2026-05-30

Fluxo entregue (frontend, dados simulados):
`busca → filtros permitidos → detalhe → seleção de horário → solicitação PENDENTE → acompanhamento em Minhas Consultas`.

### Feito
- **Camada de serviços** (prep p/ API real): `services/http.ts` (delay + `ApiError`), `psychologistService.ts` (`listPsychologists`/`getPsychologistById`), `appointmentService.ts` ("banco" em memória: `listAppointments`/`createAppointmentRequest`/`cancelAppointment`).
- **Hooks TanStack Query**: `hooks/usePsychologists.ts`, `hooks/useAppointments.ts` (mutations invalidam a lista).
- **Mocks**: 6 psicólogos com `crp` fictício, especialidade, modalidade (`online`/`presencial`/`hibrido`), localização, faixa de valor, descrição e `availableSlots`. Listas derivadas p/ filtros.
- **Tipos**: `Modality`, `AvailableSlot`, `AppointmentStatus`, `PatientAppointment`, `PsychologistFilters`; `Psychologist` enriquecido.
- **Busca** (`/patient/search`): filtros permitidos (especialidade, modalidade, disponibilidade, localização, faixa de valor), grid de cards, loading (Skeleton), estado vazio, erro com retry, limpar filtros.
- **Detalhe** (`/patient/psychologist/:id`): perfil, seleção de horário (Chips), modal de confirmação, notificação, criação com status **PENDENTE**.
- **Minhas Consultas** (`/patient/appointments`): abas por status (Pendentes / Confirmadas / Realizadas / Recusadas+Canceladas), contadores, cancelamento, estados vazios/loading/erro.
- **Feedback Mantine**: cards, badges, modal, `@mantine/notifications` (provider em `main.tsx`), alerts.
- `utils/display.ts`: rótulos de modalidade/status e formatadores.

### Regras de negócio respeitadas
- Agendamento **nunca** confirma automático → nasce `PENDENTE`.
- Sem filtros sensíveis/discriminatórios (apenas critérios profissionais permitidos).
- Sem dados clínicos reais.
- Services isolados → troca futura por HTTP sem mexer nas telas.

### Qualidade
- `npm run build` (tsc -b + vite build): **OK**. Aviso apenas de chunk > 500 kB (não bloqueante).
- Evidências em [`TEST_PLAN.md`](./TEST_PLAN.md).

### Pendências
- Aceite/recusa real pelo psicólogo (hoje há seed CONFIRMADA/REALIZADA p/ demo).
- Persistência some ao recarregar (banco em memória) — esperado nesta fase.
- Backend real (NestJS + Prisma + PostgreSQL/Neon, JWT, RBAC, multi-tenant).
- Responsividade mobile refinada da barra de filtros.

### Próximo passo
**PROMPT 03** — Fluxo do psicólogo: gestão de disponibilidade + tela de solicitações recebidas com **aceitar/recusar** (refletindo no status visto pelo paciente). Ainda frontend/mock.



## Etapa 0 — Contexto e documentação base · 2026-05-30

### Feito
- Criada pasta `/docs`.
- `AI_CONTEXT.md` — contexto oficial (stack, arquitetura, módulos, escopo).
- `BACKLOG_MVP.md` — funcionalidades priorizadas (P0/P1/P2).
- `PROGRESS_LOG.md` — este log.
- `DECISIONS.md` — decisão arquitetural registrada.

### Já existente antes desta etapa
- **Frontend base concluído** em `/frontend` (`npm run build` OK):
  - Stack: Vite + React + TS + Mantine + Zustand + TanStack Query
  - Auth fake por papel + `ProtectedRoute`
  - `AppLayout` (Topbar + Sidebar)
  - **Dashboard do paciente** completo (11 componentes, gráfico SVG puro)
  - 9 rotas + skeletons (Login / Register / Landing)
  - Mocks em `src/mocks/data.ts`

### Pendências
- Backend não iniciado (Auth real, Prisma, PostgreSQL, multi-tenant).
- Telas skeleton sem conteúdo real (busca, detalhe psicólogo, agenda, painel psicólogo).
- Fluxo de agendamento não implementado.
- Responsividade mobile a refinar.

### Próximo passo
**PROMPT 02** — Detalhe do psicólogo + fluxo de agendamento (seleção de horário → status `PENDENTE`).
Ainda no frontend, com mocks. Backend real fica para etapa posterior.

### Status geral
🟢 Base sólida e demonstrável. Documentação alinhada ao código.
