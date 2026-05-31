# PsiApp — Testes Automatizados

> Suíte inicial de testes do MVP (7º período). **Frontend:** Vitest + React Testing Library + jsdom. **Backend:** Vitest + Supertest. Sem banco real — testes que dependeriam de PostgreSQL são marcados como pendentes.

## Como rodar

### Frontend (`/frontend`)
```bash
cd frontend
npm install
npm test            # modo watch
npm run test:run    # execução única (CI)
npm run test:coverage
```

### Backend (`/backend`)
```bash
cd backend
npm install
npm run test:run    # execução única
npm test            # modo watch
```

### Tudo de uma vez (raiz)
```bash
npm run test:all        # frontend + backend
npm run test:frontend
npm run test:backend
```

## Resultado atual
- **Frontend:** 7 arquivos · **23 testes** — todos passando.
- **Backend:** 6 arquivos · **28 testes** — todos passando.
- **Total: 51 testes verdes.** Builds (`tsc`/`vite`) seguem OK (arquivos de teste excluídos do build).

## Cobertura por fluxo

### Frontend
| Arquivo | Fluxo coberto |
|---|---|
| `stores/__tests__/authStore.test.ts` | Login simulado por papel + logout + `signIn` (login real em modo mock) |
| `pages/__tests__/Login.test.tsx` | Render do login; login simulado; seleção de perfil reflete no estado |
| `pages/__tests__/Register.test.tsx` | Render do cadastro + seletor de perfil |
| `pages/__tests__/PatientSearch.test.tsx` | Filtros permitidos presentes; **ausência de filtros sensíveis** |
| `pages/__tests__/PsychologistRecord.test.tsx` | Prontuário = placeholder seguro; sem dados clínicos; avisos RBAC/tenant/vínculo/auditoria |
| `services/__tests__/psychologistService.test.ts` | Listagem, filtro por especialidade/modalidade, detalhe e erro controlado |
| `services/__tests__/appointmentService.test.ts` | Solicitação nasce PENDENTE; aceitar→CONFIRMADA; recusar→RECUSADA; cancelar→CANCELADA; bloqueio de decisão duplicada |

### Backend
| Arquivo | Fluxo coberto |
|---|---|
| `tests/health.test.ts` | `GET /health` → 200 |
| `tests/auth.test.ts` | `POST /auth/register` e `/login` inválidos → 400 (Zod); `GET /auth/me` sem token → 401 |
| `tests/refresh.test.ts` | `POST /auth/refresh`: body inválido → 400; token inválido → 401; token válido → 200 com novos tokens |
| `tests/security.test.ts` | Rotas protegidas (`psychologists`, `availability`, `appointments/*`, `notifications`, `medical-records`) → 401 sem token; `POST /appointments` sem token → 401 |
| `tests/auth-service.test.ts` | **Integração (Prisma mockado):** register com senha em hash; e-mail duplicado → 409; login ok/senha errada/usuário inexistente; `refresh` válido/inválido |
| `tests/appointments-service.test.ts` | **Integração (Prisma mockado):** `cancel` PENDENTE→CANCELADA; já realizada → 409; inexistente → 404 |

## Setup / configuração
- `frontend/vitest.config.ts` (jsdom, globals, setup), `frontend/src/test/setup.ts` (jest-dom + mocks de `matchMedia`/`ResizeObserver`), `frontend/src/test/renderWithProviders.tsx` (Mantine + QueryClient + MemoryRouter).
- `frontend/tsconfig.app.json` exclui `*.test.*` e `src/test` do build; `frontend/tsconfig.test.json` dá tipos de teste ao editor.
- `backend/vitest.config.ts` (node, globals); testes em `backend/tests/` (fora de `src/`, não entram no build).

## Testes pendentes (8º período — exigem banco/integração real)
- Fluxos que tocam o PostgreSQL **de verdade**: `GET /psychologists` retornando lista real, `GET /appointments/me` com dados, `accept/reject` aplicando mudança persistida. (Hoje cobertos com Prisma mockado para `cancel`/auth.)
- Login real end-to-end (frontend → API → banco) com `VITE_USE_MOCKS=false`.
- Testes de integração frontend↔backend com `VITE_USE_MOCKS=false`.
- E2E dos fluxos completos (ex.: Playwright/Cypress).
- Detalhe do psicólogo e listagem de consultas como testes de componente com dados (hoje cobertos por testes de serviço + render parcial).

## Limitações nesta fase
- Sem dependência de banco: os testes de backend validam **contrato/segurança** (status, validação, proteção por token), não persistência.
- Validação de campos obrigatórios no Login/Cadastro **não existe na UI** (campos têm valores padrão) — não testada para não inventar funcionalidade; fica como melhoria.
- Testes de componentes com data fetching focam em conteúdo estático (filtros, avisos) para evitar flakiness pela latência simulada (~600ms).
- Prontuário permanece placeholder — nenhum teste cria/lê dado clínico real.
