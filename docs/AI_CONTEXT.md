# PSIAPP - CONTEXTO OFICIAL PARA CLAUDE CODE
Este arquivo deve ser usado como contexto fixo do projeto para economizar tokens em novas 
conversas.
Sempre que abrir uma nova conversa no Claude Code, peça para ele ler este arquivo antes de 
alterar qualquer coisa.
## 1. Produto
O PsiApp e uma plataforma digital de conexao entre pacientes e psicologos. O objetivo do MVP e 
permitir que pacientes encontrem psicologos, visualizem informacoes relevantes, solicitem 
agendamentos e acompanhem suas consultas. Para psicologos, o sistema deve permitir gestao 
basica da agenda, recebimento de solicitacoes, controle de pacientes vinculados e, 
futuramente, prontuario com seguranca reforcada.
## 2. Contexto academico
O projeto esta no 7o periodo de Engenharia de Software. A entrega atual nao precisa representar 
o produto final completo. A versao final sera evoluida no 8o periodo. Portanto, a prioridade 
agora e criar uma base profissional, demonstravel, organizada e coerente com a documentacao, 
evitando prometer funcionalidades que ainda nao estao integradas.
## 3. Decisao arquitetural
Arquitetura do MVP: Client-Server + Monolito Modular Multi-Tenant + Stateless.
Frontend:- React- TypeScript- Vite- Mantine UI- TanStack Query- Zustand- React Router
Backend futuro:- Node.js- NestJS- TypeScript- Prisma ORM- PostgreSQL via Neon- JWT- RBAC- Guards
Deploy previsto:- Frontend: Vercel- Backend: Render- Banco: Neon- Versionamento: GitHub
## 4. Escopo recomendado para entrega inicial
Prioridade imediata: frontend basico funcional com dados simulados, preparado para integracao 
futura com API.
Funcionalidades frontend prioritarias:- Landing ou tela inicial simples do produto.- Login/cadastro simulado.- Selecao de perfil: paciente ou psicologo.- Rotas protegidas por papel de usuario.- Dashboard do paciente.- Busca de psicologos.- Filtros permitidos: especialidade, modalidade, disponibilidade, localizacao e faixa de valor.- Detalhe do psicologo.- Solicitacao de agendamento com status PENDENTE.- Agenda/minhas consultas do paciente.- Dashboard do psicologo.- Gestao de disponibilidade de horarios.- Tela de solicitacoes recebidas com aceitar/recusar.- Agenda do psicologo.- Mensagens administrativas simuladas.- Notificacoes internas simuladas.- Tela ou placeholder de prontuario basico, sem dados clinicos reais.
## 5. Regras criticas de negocio- Paciente precisa estar cadastrado/autenticado para solicitar consulta.- Psicologo precisa possuir cadastro ativo para disponibilizar horarios.
Página 3
- Um horario nao pode ser confirmado para mais de um paciente.- Paciente so pode solicitar horarios disponibilizados pelo psicologo.- Psicologo pode aceitar ou recusar solicitacoes.- Agendamento nao e automatico: fluxo correto e solicitacao -> analise pelo psicologo -> 
aceite/recusa -> notificacao ao paciente.- O sistema nao deve permitir filtros sensiveis ou discriminatorios.- Prontuario so pode ser acessado por psicologo vinculado ao paciente.- Dados clinicos exigem validacao por JWT, RBAC, tenant_id e vinculo terapeutico ativo.- Operacoes sensiveis devem gerar log de auditoria.
## 6. Nao escopo do MVP atual
Nao implementar agora:- Microsservicos.- Kubernetes.- Kafka.- Event Sourcing.- Banco por tenant ou schema por tenant.- Aplicativo mobile.- IA obrigatoria.- Pagamentos complexos.- Videochamada propria.- Chat em tempo real completo.- Prontuario clinico completo com dados reais.
## 7. Padrao esperado de codigo- Organizar o frontend em components, pages, services, stores, hooks, routes e types.- Criar dados simulados em arquivos separados, sem espalhar mocks pelas paginas.- Criar services que simulem chamadas de API, para facilitar troca futura por backend real.- Usar TypeScript com tipos claros.- Evitar componentes gigantes.- Priorizar telas demonstraveis, responsivas e consistentes.- Atualizar README e docs/PROGRESS_LOG.md ao final de cada etapa.
## 8. Regra para o Claude Code
Antes de editar codigo, o Claude deve:
1. Ler este arquivo.
2. Ler docs/PROGRESS_LOG.md, se existir.
3. Explicar rapidamente o plano de alteracao.
4. Implementar somente o escopo solicitado no prompt do dia.
5. Rodar verificacoes possiveis, como build, lint ou typecheck.
6. Informar arquivos alterados, comandos usados, pendencias e proximo passo.