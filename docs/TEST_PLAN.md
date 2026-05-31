# PsiApp — Plano de Testes Manuais

> Verificação manual dos fluxos críticos do MVP (7º período). **Dados simulados** — sem backend real.
> Preparação: `cd frontend && npm install && npm run dev`, abrir o endereço do Vite. Login fake define o papel.
> Legenda de status: **Aprovado** (verificado) · **Pendente** (depende de backend real) · **N/A** (não aplicável nesta fase).

## Pré-condições gerais
- `frontend/npm run build` (tsc + vite) passa. ✅ verificado em 2026-05-30.
- `backend/npm run build` (tsc) passa. ✅ verificado em 2026-05-30.
- Modo padrão: `VITE_USE_MOCKS=true` (mocks). Persistência é em memória (recarregar reseta).

---

### TC-01 — Cadastro / login simulado
- **Objetivo:** entrar no app escolhendo um papel.
- **Pré-condição:** app aberto na landing/login.
- **Passos:** acessar `/login` → escolher "Sou Paciente" ou "Sou Psicólogo" → enviar qualquer credencial.
- **Resultado esperado:** autenticação fake concluída; redireciona ao dashboard do papel escolhido.
- **Status:** Aprovado.
- **Observações:** não há validação real de credenciais (login fake). Backend `POST /auth/login` existe como esqueleto.

### TC-02 — Seleção de perfil do usuário
- **Objetivo:** o papel selecionado define a experiência.
- **Pré-condição:** tela de login.
- **Passos:** alternar entre Paciente e Psicólogo no seletor e entrar.
- **Resultado esperado:** Paciente → `/patient/dashboard`; Psicólogo → `/psychologist/dashboard`; topbar/sidebar mudam conforme o papel.
- **Status:** Aprovado.

### TC-03 — Proteção de rotas por perfil
- **Objetivo:** impedir acesso a rotas de outro papel / não autenticado.
- **Pré-condição:** logado como paciente.
- **Passos:** acessar manualmente `/psychologist/dashboard`; depois deslogar e tentar `/patient/dashboard`.
- **Resultado esperado:** papel incorreto → redireciona ao dashboard do próprio papel; não autenticado → redireciona a `/login` (`ProtectedRoute`).
- **Status:** Aprovado.

### TC-04 — Dashboard do paciente
- **Objetivo:** visão geral do paciente.
- **Pré-condição:** logado como paciente.
- **Passos:** abrir `/patient/dashboard`.
- **Resultado esperado:** humor, próxima consulta, gráfico de bem-estar (SVG), metas, acesso rápido e banner — todos renderizados.
- **Status:** Aprovado.
- **Observações:** dados de demonstração (mocks).

### TC-05 — Busca de psicólogos
- **Objetivo:** listar profissionais.
- **Pré-condição:** logado como paciente.
- **Passos:** acessar `/patient/search`.
- **Resultado esperado:** loading (skeletons) → grid com 6 psicólogos.
- **Status:** Aprovado.

### TC-06 — Filtros permitidos
- **Objetivo:** filtrar apenas por critérios profissionais.
- **Pré-condição:** busca aberta.
- **Passos:** aplicar Especialidade, Modalidade, Disponibilidade (dia), Localização e Faixa de valor; depois "Limpar filtros".
- **Resultado esperado:** lista reduz conforme cada filtro; limpar volta à lista completa. **Nenhum** filtro sensível/discriminatório disponível.
- **Status:** Aprovado.
- **Observações:** regra de negócio crítica respeitada.

### TC-07 — Estado vazio da busca
- **Objetivo:** feedback quando nada casa.
- **Pré-condição:** busca aberta.
- **Passos:** combinar filtros sem resultado.
- **Resultado esperado:** card "Nenhum psicólogo encontrado" + botão Limpar filtros (componente `EmptyState`).
- **Status:** Aprovado.

### TC-08 — Visualização do perfil do psicólogo
- **Objetivo:** ver detalhes e horários.
- **Pré-condição:** busca aberta.
- **Passos:** clicar "Ver perfil" em um card.
- **Resultado esperado:** `/patient/psychologist/:id` com CRP, abordagem, especialidade, modalidade, localização, faixa de valor, descrição e horários. Profissional sem horários (`p6`) mostra aviso e sem botão solicitar.
- **Status:** Aprovado.

### TC-09 — Solicitação de agendamento (PENDENTE)
- **Objetivo:** solicitar consulta sem confirmação automática.
- **Pré-condição:** perfil de psicólogo com horários aberto.
- **Passos:** selecionar horário → "Solicitar consulta" → confirmar no modal.
- **Resultado esperado:** notificação "Solicitação enviada"; consulta aparece em Minhas Consultas com badge **Pendente**. **Nunca** confirma automático.
- **Status:** Aprovado.
- **Observações:** regra de negócio crítica.

### TC-10 — Duplicidade de solicitação
- **Objetivo:** evitar pedido repetido do mesmo horário.
- **Pré-condição:** uma solicitação já feita.
- **Passos:** solicitar de novo o mesmo horário/psicólogo.
- **Resultado esperado:** erro "Você já tem uma solicitação para este horário."
- **Status:** Aprovado.

### TC-11 — Minhas Consultas (paciente)
- **Objetivo:** acompanhar consultas por status.
- **Pré-condição:** logado como paciente.
- **Passos:** abrir `/patient/appointments`; navegar pelas abas.
- **Resultado esperado:** abas Pendentes / Confirmadas / Realizadas / Recusadas+Canceladas com contadores; abas vazias mostram estado vazio.
- **Status:** Aprovado.

### TC-12 — Cancelamento (paciente)
- **Objetivo:** cancelar consulta cancelável.
- **Pré-condição:** consulta Pendente ou Confirmada.
- **Passos:** clicar "Cancelar".
- **Resultado esperado:** notificação "Consulta cancelada"; item migra para Canceladas. Realizada/Recusada/Cancelada não exibem botão Cancelar.
- **Status:** Aprovado.

### TC-13 — Dashboard do psicólogo
- **Objetivo:** indicadores do profissional.
- **Pré-condição:** logado como psicólogo.
- **Passos:** abrir `/psychologist/dashboard`.
- **Resultado esperado:** indicadores (pendentes, confirmadas, próximos atendimentos, pacientes vinculados), próximos atendimentos, feed de notificações e pacientes vinculados.
- **Status:** Aprovado.

### TC-14 — Aceite/recusa de solicitação (psicólogo)
- **Objetivo:** analisar pedido pendente.
- **Pré-condição:** logado como psicólogo; há solicitação pendente.
- **Passos:** abrir `/psychologist/requests`; clicar Aceitar (ou Recusar).
- **Resultado esperado:** Aceitar → status **CONFIRMADA**; Recusar → **RECUSADA**; toast de confirmação; reflete na visão do paciente (mesma fonte em memória).
- **Status:** Aprovado.
- **Observações:** regra "um horário, um paciente" validada no aceite.

### TC-15 — Gestão de disponibilidade
- **Objetivo:** CRUD de horários.
- **Pré-condição:** logado como psicólogo.
- **Passos:** `/psychologist/availability` → adicionar (data/hora/modalidade); editar via modal; remover.
- **Resultado esperado:** lista atualiza; duplicar data+hora gera erro; feedback em cada ação.
- **Status:** Aprovado.

### TC-16 — Agenda do psicólogo
- **Objetivo:** visão por data com status visual.
- **Pré-condição:** logado como psicólogo.
- **Passos:** abrir `/psychologist/schedule`; alternar filtro de status.
- **Resultado esperado:** consultas agrupadas por data, barra colorida por status; estado vazio quando não há itens.
- **Status:** Aprovado.

### TC-17 — Notificações simuladas
- **Objetivo:** feed interno sem tempo real.
- **Pré-condição:** logado como psicólogo.
- **Passos:** observar feed no dashboard e em `/psychologist/messages`; aceitar/recusar gera nova notificação ao paciente.
- **Resultado esperado:** notificações listadas; "marcar todas como lidas" funciona.
- **Status:** Aprovado.
- **Observações:** simulado (sem push/websocket).

### TC-18 — Mensagens administrativas simuladas
- **Objetivo:** caixa de mensagens sem tempo real.
- **Pré-condição:** logado como psicólogo.
- **Passos:** abrir `/psychologist/messages`; alternar lida/não lida.
- **Resultado esperado:** lista de comunicados com prioridade e estado de leitura.
- **Status:** Aprovado.

### TC-19 — Prontuário como placeholder seguro
- **Objetivo:** garantir que dados clínicos NÃO são expostos.
- **Pré-condição:** logado como psicólogo.
- **Passos:** abrir `/psychologist/record`.
- **Resultado esperado:** aviso de área restrita; prontuário **bloqueado** por paciente; texto exige backend, JWT, RBAC, `tenant_id`, vínculo terapêutico e auditoria. Nenhum dado clínico real.
- **Status:** Aprovado.
- **Observações:** backend `/medical-records` retorna `501` por design.

### TC-20 — Erro / retry
- **Objetivo:** tratamento de falha de carregamento.
- **Pré-condição:** forçar id inexistente (ex.: `/patient/psychologist/zzz`).
- **Resultado esperado:** `Alert` vermelho com "Tentar novamente" (`ErrorState`).
- **Status:** Aprovado.

### TC-21 — Fallback para mocks
- **Objetivo:** app funciona sem backend.
- **Pré-condição:** `VITE_USE_MOCKS` ausente ou `true`.
- **Passos:** usar o app com backend desligado.
- **Resultado esperado:** todas as telas operam com dados simulados; nenhuma chamada de rede obrigatória.
- **Status:** Aprovado.

### TC-22 — Integração real (toggle)
- **Objetivo:** validar caminho HTTP real.
- **Pré-condição:** backend migrado + `VITE_USE_MOCKS=false` + `VITE_API_URL`.
- **Passos:** repetir login/busca/agendamento contra a API.
- **Resultado esperado:** services chamam `/api/*` conforme contratos.
- **Status:** **Pendente** (depende de banco migrado/seed — 8º período).

### TC-23 — Responsividade mobile
- **Objetivo:** navegação utilizável em telas pequenas.
- **Pré-condição:** DevTools em largura ~390px.
- **Passos:** navegar pelas telas; usar a barra inferior.
- **Resultado esperado:** layout empilha; sidebar vira barra inferior funcional (rolável).
- **Status:** Aprovado.

---

## Resumo
- **Aprovados:** TC-01 a TC-21, TC-23 (fluxos do MVP com mocks).
- **Pendentes:** TC-22 (integração real — 8º período).
- **N/A:** nenhum nesta fase.
