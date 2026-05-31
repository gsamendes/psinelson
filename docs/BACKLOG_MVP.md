# PsiApp — BACKLOG MVP

> Lista priorizada das funcionalidades do MVP. Prioridade: **P0** = essencial p/ demo do 7º período · **P1** = importante · **P2** = desejável / 8º período.

## P0 — Essencial (demonstrável no 7º período)

| # | Funcionalidade | Módulo | Status |
|---|----------------|--------|--------|
| 1 | Landing + identidade visual | UI | ✅ Pronto |
| 2 | Autenticação (login/registro) — fake por papel | Auth | ✅ Fake pronto |
| 3 | Rotas protegidas por papel | Auth | ✅ Pronto |
| 4 | Layout principal (Topbar + Sidebar) | UI | ✅ Pronto |
| 5 | Dashboard do paciente | Perfil | ✅ Pronto |
| 6 | Detalhe do psicólogo | Busca | ✅ Pronto |
| 7 | Fluxo de agendamento (selecionar horário → status PENDENTE) | Agendamento | ✅ Pronto |
| 8 | Busca de psicólogos com filtros | Busca | ✅ Pronto |
| 8b | Minhas Consultas (acompanhamento por status + cancelar) | Agendamento | ✅ Pronto |

## P1 — Importante

| # | Funcionalidade | Módulo | Status |
|---|----------------|--------|--------|
| 9  | Painel do psicólogo (solicitações + aceitar/recusar + agenda + mensagens + prontuário placeholder) | Agendamento | ✅ Pronto |
| 10 | Gestão de disponibilidade do psicólogo (CRUD horários) | Agendamento | ✅ Pronto |
| 11 | Backend Auth real (JWT access + refresh) | Auth | 🟡 register/login/me/refresh + login real ligado no front; falta banco (Neon) |
| 12 | Persistência real (Prisma + PostgreSQL, multi-tenant) | Infra | 🟡 Schema + client prontos; falta migrar no Neon |
| 13 | Edição de perfil (paciente / psicólogo) | Perfil | ⬜ Pendente |

## P2 — Desejável / 8º período

| # | Funcionalidade | Módulo | Status |
|---|----------------|--------|--------|
| 14 | Chat texto paciente↔psicólogo | Comunicação | ⬜ Futuro |
| 15 | Painel admin | Admin | ⬜ Futuro |
| 16 | Histórico clínico / anotações | Perfil | ⬜ Futuro |
| 17 | Responsividade mobile refinada (nav inferior funcional, grids responsivos) | UI | ✅ Refinada |

## Fora de escopo (não entra no MVP do 7º período)

Videochamada · pagamentos · IA · microsserviços · push · mobile nativo.
