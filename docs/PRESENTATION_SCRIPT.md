# PsiApp — Roteiro de Apresentação Acadêmica

> Duração sugerida: 10–15 min. Demo ao vivo com `npm run dev` (frontend) em modo mock. Tenha as telas do `SCREENSHOT_GUIDE.md` abertas como backup.

## 1. Abertura (30s)
"Apresentamos o **PsiApp**, uma plataforma que conecta pacientes a psicólogos. Este é o **MVP do 7º período**: um frontend funcional com dados simulados e a base técnica do backend, preparado para integração no 8º período."

## 2. Problema identificado (1 min)
- Encontrar um psicólogo adequado e marcar consulta é burocrático e pouco transparente.
- Falta um canal único para buscar por critérios **profissionais**, solicitar horário e acompanhar o status.

## 3. Proposta de solução (1 min)
- Busca por especialidade, modalidade, disponibilidade, localização e faixa de valor — **sem filtros discriminatórios**.
- Fluxo claro de agendamento: **solicitação → análise do psicólogo → aceite/recusa → notificação**.
- Painel do psicólogo para gerir agenda e solicitações.

## 4. Público-alvo (30s)
- Pacientes em busca de atendimento (online, presencial ou híbrido).
- Psicólogos que querem gerir agenda e pedidos de forma simples.

## 5. Arquitetura escolhida (1–2 min)
- **Client-Server + Monólito Modular + Multi-Tenant + Stateless + REST.**
- Isolamento lógico por `tenant_id` (sem schema por tenant); autenticação stateless por JWT.
- Registrada em `docs/DECISIONS.md` (ADR-001 a ADR-004).

## 6. Stack utilizada (1 min)
- **Frontend:** React, TypeScript, Vite, Mantine UI, React Router, Zustand, TanStack Query.
- **Backend (esqueleto):** Node.js, Express, TypeScript, Prisma, PostgreSQL, JWT, Zod.
- Decisão consciente de usar **Express, não NestJS**, para um MVP enxuto e demonstrável (ADR-004).

## 7. Demonstração do frontend (3–4 min) — roteiro ponta a ponta
1. **Login** e seleção de perfil (paciente).
2. **Busca** com filtros permitidos → **detalhe** do psicólogo.
3. **Solicitar consulta** → mostrar que nasce **PENDENTE** (não confirma sozinha).
4. **Minhas Consultas** → consulta pendente.
5. Trocar para **psicólogo** → **Solicitações** → **Aceitar**.
6. Voltar como paciente → consulta agora **CONFIRMADA**.
7. Mostrar **disponibilidade**, **agenda** e **responsividade mobile**.

## 8. Explicação dos mocks (1 min)
- "Todos os dados são **simulados em memória** nesta entrega — o app funciona 100% sem backend."
- A **camada de services** já tem um *toggle* (`VITE_USE_MOCKS`) e um cliente HTTP prontos: trocar mock por API real é mudar uma variável de ambiente.

## 9. Explicação do backend (1–2 min)
- Esqueleto **Express + Prisma** modular por domínio (auth, agendamento, etc.), que **compila**.
- `auth` com register/login (bcrypt), schema Prisma com `tenant_id` e enums, validação Zod, middlewares de auth/tenant/erro.
- **Contratos REST** documentados em `docs/API_CONTRACTS.md`.

## 10. Decisões de segurança (1 min)
- Senhas só com **bcrypt** (nunca em texto puro); backend **stateless** com JWT.
- Multi-tenant por `tenant_id`; RBAC previsto por papel.
- **Prontuário é placeholder seguro**: não exibe dados clínicos; exigirá RBAC, `tenant_id`, vínculo terapêutico ativo e auditoria.

## 11. Limites do MVP (1 min) — transparência
- Persistência e login são **simulados**; sem backend integrado nesta entrega.
- Notificações e mensagens são **simuladas** (sem tempo real).
- Prontuário **não** é funcional — é placeholder.

## 12. Evolução para o 8º período (1 min)
- Banco real (Neon), JWT real + refresh, integração ponta a ponta.
- Regras transacionais e concorrência de horários, RBAC, auditoria, prontuário seguro.
- Testes automatizados e deploy (Vercel + Render). Detalhes em `docs/NEXT_STEPS_8_PERIOD.md`.

## 13. Fechamento (30s)
"O PsiApp entrega uma base **profissional, demonstrável e bem documentada**, com arquitetura definida e caminho claro de evolução. Obrigado — abrimos para perguntas."

---
### Perguntas prováveis (preparação)
- *"Por que não NestJS?"* → ADR-004: simplicidade e prazo; arquitetura não muda; migração futura preserva services/Prisma.
- *"Os dados são reais?"* → Não; são simulados. O toggle mock/real já está pronto.
- *"E os dados clínicos?"* → Prontuário é placeholder; só com RBAC + tenant + vínculo + auditoria.
