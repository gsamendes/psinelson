# PsiApp — Decisões de Arquitetura (ADR)

> Registro de decisões arquiteturais. Formato leve: contexto → decisão → consequências.

---

## ADR-001 — Client-Server + Monolito Modular Multi-Tenant + Stateless

**Data:** 2026-05-30
**Status:** Aceita

### Contexto
Projeto acadêmico do 7º período, prazo fixo e time reduzido. Precisa ser profissional, demonstrável e coerente com a documentação, e evoluível no 8º período — sem complexidade operacional alta.

### Decisão
Adotar **Client-Server + Monolito Modular Multi-Tenant + Stateless**.

- **Client-Server:** frontend (React/Mantine) e backend (Node/Express) separados, comunicando por API REST.
- **Monolito Modular:** um único deploy de backend, organizado em módulos (`Auth`, `Perfil`, `Busca`, `Agendamento`, `Comunicação`, `Admin`) e camadas `routes → controllers → services → repositories`.
- **Multi-Tenant:** isolamento lógico por coluna `tenant_id` em todas as tabelas relevantes.
- **Stateless:** sem sessão em servidor; autenticação por **JWT** (access ~15min + refresh ~7d).

### Alternativas descartadas
- **Microsserviços:** complexidade operacional (deploy, rede, observabilidade) incompatível com o prazo e o objetivo acadêmico.
- **Sessão stateful em servidor:** dificulta escala horizontal e contraria o requisito stateless.
- **Single-tenant:** limitaria evolução multi-organização planejada.

### Consequências
- ✅ Simples de desenvolver, testar e demonstrar.
- ✅ Modularidade permite extrair serviços no futuro, se necessário.
- ✅ Stateless facilita escala horizontal posterior.
- ⚠️ `tenant_id` deve ser aplicado de forma disciplinada em **todas** as queries (risco de vazamento entre tenants se esquecido).
- ⚠️ Monolito exige disciplina de fronteiras entre módulos para não virar "big ball of mud".

---

## ADR-002 — Mantine UI no frontend (não Tailwind)

**Data:** 2026-05-30
**Status:** Aceita

### Contexto
Necessidade de UI consistente e rápida de montar, com componentes prontos e tema centralizado.

### Decisão
Usar **Mantine UI** como biblioteca de componentes e sistema de tema. Tailwind **não** será usado.

### Consequências
- ✅ Componentes ricos prontos (forms, modais, grid) aceleram entrega.
- ✅ Tema central (paleta verde/bege) aplicado de forma uniforme.
- ⚠️ Acoplamento à API do Mantine; customizações muito específicas via CSS modules.

---

## ADR-003 — Gráficos em SVG puro (sem lib de charts)

**Data:** 2026-05-30
**Status:** Aceita

### Contexto
Dashboard precisa de gráfico de bem-estar fiel à referência visual, sem inflar dependências.

### Decisão
Desenhar o gráfico em **SVG inline**, sem Recharts ou similar.

### Consequências
- ✅ Zero dependência extra; fidelidade total à referência.
- ⚠️ Gráficos novos exigem código SVG manual; reavaliar se surgir necessidade de muitos gráficos.

---

## ADR-004 — Backend em Express (não NestJS) nesta etapa do MVP

**Data:** 2026-05-30
**Status:** Aceita (revisa a menção a NestJS no `AI_CONTEXT.md`)

### Contexto
O `AI_CONTEXT.md` previa NestJS. Para o esqueleto do backend do 7º período, prioriza-se simplicidade, curva de aprendizado baixa e rapidez de demonstração, mantendo a organização modular por domínio.

### Decisão
Usar **Node.js + Express + TypeScript + Prisma**, com estrutura **modular por domínio** (`src/modules/*` no padrão `routes → controller → service → schemas`) e camadas compartilhadas em `src/shared`. Mantém-se **multi-tenant por `tenantId`** e **stateless via JWT** (ADR-001).

### Alternativas descartadas
- **NestJS:** mais estrutura/abstrações do que o necessário para o esqueleto atual; pode ser reavaliado no 8º período.

### Consequências
- ✅ Setup leve e direto; fácil de explicar na banca.
- ✅ Organização modular preserva fronteiras de domínio mesmo sem framework opinado.
- ⚠️ Sem DI/decorators do Nest — disciplina de estrutura fica por conta da convenção do time.
- ⚠️ Migrar para NestJS depois exigiria reescrever a camada HTTP (controllers/rotas), mas os `services`/Prisma são reaproveitáveis.
