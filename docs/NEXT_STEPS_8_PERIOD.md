# PsiApp — Próximos Passos (8º período)

> Evolução planejada do MVP para um produto integrado e seguro. Mantém a arquitetura atual (Client-Server, Monólito Modular, Multi-Tenant, Stateless, REST) — sem NestJS, sem microsserviços.

## Fase A — Backend real e persistência
- **Backend completo em Node.js + Express + TypeScript** sobre o esqueleto já existente (controllers/services por domínio).
- **Persistência Prisma + PostgreSQL/Neon**: rodar `prisma migrate`, criar seed (tenant demo, usuários, perfis, disponibilidades).
- **Autenticação JWT real**: login validando credenciais (bcrypt), `GET /auth/me`, e **`POST /auth/refresh`** com rotação/revogação de refresh token.
- **Integração frontend↔backend**: ligar `authStore` ao `authService`, ativar `VITE_USE_MOCKS=false`, ajustar mappers de shape (Profile→Psychologist, Message→AdminMessage). Mocks permanecem como fallback até estabilizar.

## Fase B — Regras de negócio e segurança
- **Regras transacionais de agendamento**: confirmar/recusar/cancelar em transação consistente.
- **Controle de concorrência para horários**: impedir que o mesmo slot seja confirmado para mais de um paciente (lock otimista / constraint única no banco).
- **RBAC efetivo**: `PATIENT` / `PSYCHOLOGIST` / `ADMIN` aplicados em todas as rotas sensíveis.
- **Multi-tenant disciplinado**: `tenant_id` aplicado em 100% das queries; testes para prevenir vazamento entre tenants.
- **Vínculo terapêutico ativo**: pré-condição para acesso a dados do paciente.
- **Auditoria**: registrar operações sensíveis em `AuditLog` (quem, o quê, quando, entidade).

## Fase C — Prontuário seguro
- Liberar o prontuário **somente** com JWT + RBAC + `tenant_id` + vínculo terapêutico ativo + auditoria.
- Avaliar criptografia em repouso para conteúdo clínico e políticas de retenção/consentimento.

## Fase D — Comunicação
- **Notificações reais** (substituir o feed simulado; avaliar polling ou websockets).
- **Mensagens persistidas** entre paciente e psicólogo (histórico no banco).

## Fase E — Qualidade
- **Testes automatizados**: unitários (services), integração (rotas Express), e2e dos fluxos críticos no frontend.
- Lint/format padronizados em CI; cobertura mínima nos módulos críticos (auth, agendamento).

## Fase F — Operação e deploy
- **Deploy do frontend** (Vercel) e **do backend** (Render); banco no **Neon**.
- **Ambiente de produção**: variáveis seguras, `CORS` restrito, segredos fora do repositório.
- **Monitoramento e logs**: logs estruturados, health checks, e métricas/alertas básicos.

## Ordem sugerida
1. Fase A (banco + auth real + integração) → desbloqueia o resto.
2. Fase B (regras + segurança) em paralelo com testes da Fase E.
3. Fase C (prontuário) somente após B consolidada.
4. Fase D (comunicação) e Fase F (deploy/operação) ao final.

## Riscos e mitigações
- **Vazamento entre tenants** → testes específicos + revisão de toda query por `tenant_id`.
- **Concorrência de horários** → constraint no banco + transação.
- **Dados clínicos** → não liberar prontuário sem todos os controles de segurança.
