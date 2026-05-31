# PsiApp — Contratos de API (MVP)

> Contratos REST previstos para o MVP. Backend: **Express + TypeScript + Prisma + JWT + Zod**, Monólito Modular Multi-Tenant, **Stateless**. Base URL: `/api` (ex.: `http://localhost:3333/api`).

## Convenções gerais

- **Autenticação:** JWT Bearer no header `Authorization: Bearer <accessToken>`. Tokens emitidos no login (access ~15min + refresh ~7d). Stateless — sem sessão no servidor.
- **Multi-tenant:** o `tenantId` vem do JWT. Em rotas públicas (register/login) o tenant chega no body ou no header `x-tenant-id`. Toda query é escopada por `tenantId` (ADR-001) — sem schema por tenant.
- **RBAC:** papéis `PATIENT`, `PSYCHOLOGIST`, `ADMIN`. Rotas sensíveis exigem papel específico (middleware `requireRole`).
- **Validação:** body validado com **Zod**; em falha → `400` com `{ error, details }`.
- **Formato de erro:** `{ "error": string, "details"?: unknown }`.
- **Status comuns:** `400` validação · `401` não autenticado · `403` sem permissão · `404` não encontrado · `409` conflito · `501` não implementado.
- **Estado de implementação:** ✅ pronto (backend) · 🟡 mock no frontend · ⬜ pendente.

---

## Autenticação

### POST /auth/register — ✅
- **Finalidade:** cadastrar usuário (hash de senha com bcrypt).
- **Perfil:** público.
- **Body:**
  ```json
  { "tenantId": "demo-tenant", "name": "Camila", "email": "c@ex.com", "password": "123456", "role": "PATIENT" }
  ```
- **Resposta `201`:** `{ id, name, email, role, tenantId }` (sem hash de senha).
- **Status:** `201` · `400` · `409` (e-mail já existe no tenant).
- **Segurança:** senha nunca em texto puro; resposta não expõe `passwordHash`.

### POST /auth/login — ✅
- **Finalidade:** autenticar e emitir tokens.
- **Perfil:** público.
- **Body:** `{ "email": "c@ex.com", "password": "123456" }`
- **Resposta `200`:** `{ user: { id, name, email, role, tenantId }, accessToken, refreshToken }`
- **Status:** `200` · `400` · `401` (credenciais inválidas).
- **Segurança:** mesma mensagem genérica para e-mail/senha inválidos.

### GET /auth/me — ✅
- **Finalidade:** dados do usuário autenticado.
- **Perfil:** autenticado (qualquer papel).
- **Headers:** `Authorization: Bearer <token>`.
- **Resposta `200`:** `{ id, name, email, role, tenantId }`.
- **Status:** `200` · `401` · `404`.
- **Observação:** `tenantId`/`userId` derivados do JWT.

### POST /auth/refresh — ✅
- **Finalidade:** renovar os tokens a partir de um refresh token válido (stateless).
- **Perfil:** público (requer refresh token no body).
- **Body:** `{ "refreshToken": "<jwt>" }`
- **Resposta `200`:** `{ accessToken, refreshToken }`.
- **Status:** `200` · `400` (body inválido) · `401` (refresh inválido/expirado).
- **Observação:** re-emissão sem store de sessão; revogação/rotação persistida fica para evolução.

---

## Psicólogos

### GET /psychologists — ✅
- **Finalidade:** listar/buscar profissionais do tenant.
- **Perfil:** autenticado.
- **Query (filtros permitidos):** `specialty`, `modality` (`online|presencial|hibrido`), `location`, `weekday`, `maxPrice`. **Proibidos** filtros sensíveis/discriminatórios.
- **Resposta `200`:** `PsychologistProfile[]` (inclui `user` resumido).
- **Status:** `200` · `401`.

### GET /psychologists/:id — ✅
- **Finalidade:** detalhe do profissional + horários livres.
- **Perfil:** autenticado.
- **Params:** `id` (psychologistProfileId).
- **Resposta `200`:** `PsychologistProfile` + `availabilities` (não reservadas).
- **Status:** `200` · `401` · `404`.

---

## Disponibilidade

### GET /availability/:psychologistId — ✅
- **Finalidade:** listar horários de um psicólogo.
- **Perfil:** autenticado.
- **Params:** `psychologistId`.
- **Resposta `200`:** `Availability[]` (`{ id, date, time, modality, isBooked }`), ordenado por data/hora.
- **Status:** `200` · `401`.
- **Observação:** alias de `GET /scheduling/psychologist/:psychologistId`. Cadastro/remoção em `POST /scheduling` e `DELETE /scheduling/:id` (papel `PSYCHOLOGIST`/`ADMIN`).

---

## Agendamentos

### POST /appointments — ✅
- **Finalidade:** solicitar consulta. **Nasce sempre `PENDENTE`** (nunca confirma automático).
- **Perfil:** autenticado (paciente).
- **Body:** `{ "patientId": "...", "psychologistId": "...", "availabilityId": "...", "notes"?: "..." }`
- **Resposta `201`:** `Appointment` com `status: "PENDENTE"`.
- **Status:** `201` · `400` · `401` · `404` (horário) · `409` (horário já reservado).
- **Regra:** paciente só agenda horário ofertado pelo psicólogo.

### GET /appointments/me — ✅
- **Finalidade:** consultas do usuário logado (deriva paciente **ou** psicólogo pelo papel).
- **Perfil:** autenticado.
- **Resposta `200`:** `Appointment[]` (mais recentes primeiro).
- **Status:** `200` · `401`.

### PATCH /appointments/:id/accept — ✅
- **Finalidade:** psicólogo aceita → `CONFIRMADA` (marca o horário como reservado, em transação).
- **Perfil:** `PSYCHOLOGIST`, `ADMIN`.
- **Params:** `id`.
- **Resposta `200`:** `Appointment` `CONFIRMADA`.
- **Status:** `200` · `401` · `403` · `404` · `409` (não está pendente).
- **Regra:** um horário não pode ser confirmado para mais de um paciente.

### PATCH /appointments/:id/reject — ✅
- **Finalidade:** psicólogo recusa → `RECUSADA`.
- **Perfil:** `PSYCHOLOGIST`, `ADMIN`.
- **Resposta `200`:** `Appointment` `RECUSADA`.
- **Status:** `200` · `401` · `403` · `404` · `409`.

### PATCH /appointments/:id/cancel — ✅
- **Finalidade:** cancelar consulta → `CANCELADA`.
- **Perfil:** autenticado (paciente dono / psicólogo / admin).
- **Resposta `200`:** `Appointment` `CANCELADA`.
- **Status:** `200` · `401` · `404` · `409` (status não cancelável).

---

## Notificações

### GET /notifications/me — ✅
- **Finalidade:** notificações internas do usuário (sem tempo real/push).
- **Perfil:** autenticado.
- **Resposta `200`:** `Notification[]` (`{ id, type, title, message, read, createdAt }`).
- **Status:** `200` · `401`.
- **Extra:** `PATCH /notifications/me/read-all` marca todas como lidas.

---

## Mensagens

### GET /messages — ✅
- **Finalidade:** caixa de mensagens administrativas do usuário (recipiente). Sem tempo real.
- **Perfil:** autenticado.
- **Resposta `200`:** `Message[]` (`{ id, senderId, recipientId, subject?, body, read, createdAt }`).
- **Status:** `200` · `401`.
- **Observação:** `GET /messages/me` é alias.

### POST /messages — ✅
- **Finalidade:** enviar mensagem.
- **Perfil:** autenticado (remetente = usuário logado).
- **Body:** `{ "recipientId": "...", "subject"?: "...", "body": "..." }`
- **Resposta `201`:** `Message`.
- **Status:** `201` · `400` · `401`.

---

## Fora deste contrato (bloqueado nesta fase)

- **Prontuário (`/medical-records`):** retorna **`501`**. Conteúdo clínico real exige JWT + RBAC + `tenantId` + **vínculo terapêutico ativo** + **auditoria**. Não implementar sem todos esses controles.
- **Refresh token (`POST /auth/refresh`):** ✅ implementado (re-emite tokens). Falta apenas revogação/rotação persistida.

---

## Estado de integração frontend ↔ backend

O frontend usa **mocks por padrão** (`VITE_USE_MOCKS=true`). Cada service alterna para a API real quando `VITE_USE_MOCKS=false` + `VITE_API_URL` definido. Mapeamento service → endpoint:

| Service (frontend) | Endpoint(s) | Estado |
|---|---|---|
| `authService` | `POST /auth/login`, `POST /auth/register`, `GET /auth/me` | mock ✅ · real pronto p/ ligar |
| `psychologistService` | `GET /psychologists`, `GET /psychologists/:id` | mock ✅ · real precisa de mapper Profile→Psychologist |
| `appointmentService` | `GET /appointments/me`, `POST /appointments`, `PATCH /:id/{accept,reject,cancel}` | mock ✅ · real pronto p/ ligar |
| `notificationService` | `GET /notifications/me`, `PATCH /notifications/me/read-all` | mock ✅ · real pronto p/ ligar |
| `messageService` | `GET /messages`, `POST /messages` | mock ✅ · real precisa de mapper Message→AdminMessage |
| disponibilidade | `GET /availability/:psychologistId` | mock embutido no psicólogo · real ⬜ |

> "real pronto p/ ligar" = caminho HTTP implementado e tipado; falta apenas backend migrado + dados reais + ajustes de mapeamento de shape.
