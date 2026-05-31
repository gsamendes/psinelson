# PsiApp — Resumo da Entrega (7º período)

> Visão objetiva do que foi entregue, do que é simulado e do que fica para o 8º período. Data: 2026-05-30.

## 1. O que foi entregue no 7º período
- **Frontend completo e demonstrável** (React + TS + Vite + Mantine), cobrindo os fluxos de **paciente** e **psicólogo** com dados simulados.
- **Camada de services com alternância mock/real** (`VITE_USE_MOCKS`) e cliente HTTP pronto (`apiClient`).
- **Esqueleto do backend** (Express + TS + Prisma) modular por domínio, com autenticação (register/login) e rotas alinhadas aos contratos.
- **Documentação acadêmica**: contexto, decisões (ADRs), contratos de API, plano de testes, guia de prints, roteiro de apresentação e próximos passos.

## 2. O que está funcional no frontend
- Landing, login/cadastro e seleção de perfil (fake por papel) + rotas protegidas.
- **Paciente:** dashboard, busca com filtros permitidos, detalhe do psicólogo, solicitação de agendamento (PENDENTE), Minhas Consultas, cancelamento.
- **Psicólogo:** dashboard com indicadores, disponibilidade (CRUD), solicitações com aceitar/recusar, agenda com status visual, mensagens e notificações.
- Estados de loading/erro/vazio padronizados; navegação responsiva (desktop + mobile).

## 3. O que está usando dados simulados
- Persistência em memória (consultas, disponibilidades, notificações, mensagens) — reseta ao recarregar.
- Login (sem validação real de credenciais).
- Notificações e mensagens (sem tempo real).
- Listas de psicólogos e pacientes vinculados (mocks, sem dados sensíveis reais).

## 4. O que existe apenas como estrutura técnica
- **Backend Express + Prisma**: compila, com módulos (`auth`, `users`, `patients`, `psychologists`, `tenants`, `scheduling`, `appointments`, `therapeutic-bonds`, `medical-records`, `messages`, `notifications`, `audit`), middlewares (auth, tenant, erro), validação Zod e schema Prisma com `tenantId` + enums.
- **Contratos de API** documentados e ramos HTTP nos services do frontend (prontos para ligar).

## 5. O que ainda não possui backend real
- Persistência em PostgreSQL (migração/seed não executados).
- Autenticação JWT efetiva ponta a ponta (login real).
- Integração frontend↔backend ativa (roda em mocks por padrão).
- `POST /auth/refresh` (token de refresh é emitido, mas não há rota de renovação).

## 6. O que NÃO deve ser apresentado como finalizado
- **Prontuário**: é **placeholder seguro** — não exibe nem armazena dados clínicos. Exige RBAC, `tenant_id`, vínculo terapêutico ativo e auditoria antes de qualquer dado real.
- **Login/persistência**: simulados; não tratar como autenticação/armazenamento reais.
- **Notificações/mensagens**: simuladas, sem tempo real.

## 7. Decisões arquiteturais tomadas
- **ADR-001:** Client-Server + Monólito Modular + Multi-Tenant (`tenantId`) + Stateless (JWT).
- **ADR-002:** Mantine UI no frontend (não Tailwind).
- **ADR-003:** Gráficos em SVG puro (sem lib de charts).
- **ADR-004:** Backend em **Express** (não NestJS) nesta etapa.
Detalhes em `docs/DECISIONS.md`.

## 8. Por que o backend foi simplificado para Node.js + Express
- Prazo fixo e time reduzido; foco em entregar um MVP **demonstrável** e bem documentado.
- Express tem curva de aprendizado menor e setup direto, mais fácil de explicar na banca.
- A organização **modular por domínio** preserva as fronteiras (mesma divisão de um Nest), e os `services`/Prisma são reaproveitáveis caso se migre para NestJS no futuro.
- A arquitetura (multi-tenant, stateless, REST) **não muda** — apenas o framework HTTP.

## 9. Como o projeto evolui no 8º período
Integração real ponta a ponta: banco no Neon, JWT real, regras transacionais de agendamento com controle de concorrência, RBAC efetivo, auditoria, prontuário seguro, notificações/mensagens persistidas, testes automatizados e deploy (Vercel + Render). Plano detalhado em `docs/NEXT_STEPS_8_PERIOD.md`.

## 10. Qualidade verificada
- Frontend `npm run build` (tsc -b + vite): **OK** (aviso não bloqueante de chunk > 500 kB).
- Backend `npm run build` (tsc): **OK**, sem erros.
- Plano de testes manuais: `docs/TEST_PLAN.md` (TC-01 a TC-21 e TC-23 aprovados; TC-22 pendente).
