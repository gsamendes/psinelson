# PsiApp — Guia de Prints para a Documentação Acadêmica

> Telas recomendadas para anexar ao documento. Frontend com dados simulados.
> Preparar: `cd frontend && npm run dev` → abrir `http://localhost:5173`. Largura desktop (~1366px) para os prints principais; ~390px (DevTools) para o print mobile.
> Login fake: qualquer credencial; o seletor define o papel.

## Legenda
- **Funcional** = interação real com dados simulados em memória.
- **Simulado** = conteúdo de demonstração (mocks), sem backend/tempo real.
- **Placeholder** = tela ilustrativa, sem dados reais (segurança).

## Prints recomendados

| # | Tela | Rota | Objetivo | Requisito relacionado | Natureza |
|---|------|------|----------|-----------------------|----------|
| 1 | Login / tela inicial | `/login` | Entrada e seleção de perfil | Login simulado; seleção de papel | Funcional (login simulado) |
| 2 | Cadastro | `/register` | Criar conta e escolher papel | Cadastro simulado | Funcional (simulado) |
| 3 | Dashboard do paciente | `/patient/dashboard` | Visão geral do paciente | Dashboard do paciente | Funcional (dados simulados) |
| 4 | Busca de psicólogos | `/patient/search` | Listar profissionais | Busca de psicólogos | Funcional |
| 5 | Filtros de busca | `/patient/search` | Filtros permitidos aplicados | Filtros não discriminatórios | Funcional |
| 6 | Detalhe do psicólogo | `/patient/psychologist/p1` | Perfil + horários | Visualização de perfil | Funcional |
| 7 | Solicitação de agendamento | `/patient/psychologist/p1` | Modal de confirmação → PENDENTE | Solicitação não automática | Funcional (regra crítica) |
| 8 | Minhas Consultas | `/patient/appointments` | Acompanhar por status | Consultas do paciente | Funcional |
| 9 | Dashboard do psicólogo | `/psychologist/dashboard` | Indicadores + pacientes | Dashboard do psicólogo | Funcional (dados simulados) |
| 10 | Disponibilidade | `/psychologist/availability` | Cadastrar/editar/remover horários | Gestão de disponibilidade | Funcional |
| 11 | Solicitações recebidas | `/psychologist/requests` | Pedidos pendentes | Aceite/recusa | Funcional |
| 12 | Aceite/recusa de consulta | `/psychologist/requests` | Clicar Aceitar → CONFIRMADA | Fluxo solicitação→aceite | Funcional (regra crítica) |
| 13 | Agenda do psicólogo | `/psychologist/schedule` | Consultas por data + status visual | Agenda do psicólogo | Funcional |
| 14 | Notificações simuladas | `/psychologist/messages` | Feed interno de notificações | Notificações internas | Simulado (sem tempo real) |
| 15 | Mensagens simuladas | `/psychologist/messages` | Comunicados administrativos | Mensagens administrativas | Simulado (sem tempo real) |
| 16 | Prontuário (placeholder) | `/psychologist/record` | Aviso de segurança | Restrição de prontuário | Placeholder (seguro) |
| 17 | Tela responsiva / mobile | qualquer rota @ ~390px | Barra inferior + cards empilhados | Responsividade | Funcional |

## Roteiro ponta a ponta (sequência que conta a história)
1. `/patient/search` → aplicar um filtro (print 5).
2. `/patient/psychologist/p1` → escolher horário → confirmar (PENDENTE) (print 7).
3. Trocar para psicólogo → `/psychologist/requests` → **Aceitar** (print 12).
4. Voltar como paciente → `/patient/appointments` (aba Confirmadas) → consulta **CONFIRMADA**.

Demonstra a regra central: `solicitação → análise → aceite/recusa → notificação`.

## Observações para a banca
- Tudo roda com **dados simulados** (sem backend nesta entrega).
- **Prontuário é placeholder** — não apresentar como funcionalidade clínica completa.
- Notificações e mensagens são **simuladas** (sem tempo real/push).
