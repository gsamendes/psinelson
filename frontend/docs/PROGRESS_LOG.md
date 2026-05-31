# PsiApp — Progress Log

## Etapa 1 — Base do frontend + Dashboard do Paciente

Data: 2026-05-30

### O que foi implementado

- **Scaffold Vite + React + TypeScript** em `/frontend` (sem template interativo; arquivos criados manualmente).
- **Stack instalada e configurada**: `@mantine/core`, `@mantine/hooks`, `@tabler/icons-react`, `react-router-dom`, `zustand`, `@tanstack/react-query`.
- **Providers globais** (`src/main.tsx`): `MantineProvider` (tema custom), `QueryClientProvider`, `BrowserRouter`.
- **Tema PsiApp** (`src/theme.ts`): paletas `psiGreen` e `psiTeal`, raio padrão alto (18–26px), fonte Inter, objeto `palette` com cores da referência.
- **Autenticação fake** (`src/stores/authStore.ts`): Zustand + `persist`. Papéis `patient` / `psychologist`. `login(role)` / `logout()`.
- **Rota protegida por papel** (`src/routes/ProtectedRoute.tsx`) + tabela de rotas (`AppRoutes.tsx`).
- **Layout principal**: `AppLayout` (topbar fixa + sidebar + área de conteúdo), `Topbar`, `Sidebar`.
- **Dashboard do paciente completo** (`/patient/dashboard`) replicando a imagem de referência.
- **Páginas skeleton** com identidade visual: Login, Register, Landing, Patient Search/Appointments, Psychologist Dashboard/Availability/Requests.

### Componentes do dashboard (todos os exigidos)

`MoodSelector`, `AppointmentCard`, `WellnessChartCard` (gráfico em SVG puro — sem lib extra), `PsychologistCard` (card gradiente verde/teal), `QuickAccessCard`, `SelfCareJourneyCard` (RingProgress 7/10), `GoalsCard`, `RecentHistoryCard`, `FindPsychologistBanner` (ilustração poltrona+planta em SVG), `SupportBar`.

### Decisões visuais

- Fundo bege `#F7F3ED`; cards brancos com raio 22px e sombra muito sutil.
- Verde principal `#5F7F62`, verde escuro `#2F5D50`, teal `#2F6F73`; borda `#E6DED4`.
- Pill verde no item "Início" ativo da topbar; sidebar de ícones circulares (botão ativo verde).
- Gráfico de bem-estar feito em **SVG inline** (gridlines tracejadas, área com gradiente, marcador "3,8 Hoje") para evitar dependência extra (Recharts não foi adicionado).
- Ilustração do banner desenhada em SVG (poltrona + planta) para fidelidade sem assets externos.
- Avatares usam imagens Unsplash (placeholder); trocar por assets próprios depois.
- Grid: linha superior 3/5/4 (consulta / gráfico / psicólogo+acesso rápido); linha inferior 8/4 (3 cards / banner); SupportBar full-width.

### Estrutura de pastas

```
src/components/layout   AppLayout, Topbar, Sidebar, PageSkeleton (+ .module.css)
src/components/dashboard 11 componentes do dashboard (+ .module.css)
src/pages               Dashboard, Auth (Login/Register/AuthShell), Landing, skeletons
src/routes              AppRoutes, ProtectedRoute
src/stores              authStore (zustand)
src/mocks               data.ts (dados simulados)
src/types               index.ts
src/styles              global.css
src/theme.ts
```

### Qualidade

- `npm run build` (tsc -b + vite build): **OK** (sem erros de tipo/lint).
- `strict`, `noUnusedLocals`, `noUnusedParameters` ativos.

### Pendências / próximos passos

- Conteúdo real das telas skeleton (busca, agenda, painel do psicólogo).
- Responsividade mobile refinada (sidebar vira barra inferior — já esboçado).
- Substituir avatares Unsplash por assets/iniciais.
- Integração futura com backend real (hoje tudo é mock).
- Considerar React Query para dados quando houver API.

### Como rodar

```
cd frontend
npm install
npm run dev      # http://localhost:5173
npm run build    # gera dist/
npm run preview  # serve o build
```

Login fake: qualquer credencial entra; o seletor "Sou Paciente / Sou Psicólogo" define o papel e o redirecionamento.
