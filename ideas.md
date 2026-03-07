# LabIA Admin — Ideias de Design para o Painel Administrativo

## Contexto
Painel administrativo (retaguarda) do app LabIA para gestão de trilhas, missões, alunos, escolas, relatórios e configurações. Público: administradores, coordenadores pedagógicos e professores.

---

<response>
<text>
**Abordagem A — "Corporate Dashboard Minimal"**
Design Movement: Swiss/International Style aplicado a dashboards SaaS, inspirado em Stripe Dashboard + Linear.
Core Principles: Tipografia como elemento principal; grid rigoroso de 8px; superfícies brancas com sombras sutis; dados como protagonistas.
Color Philosophy: Fundo branco (#FAFAFA) com superfícies (#FFFFFF), texto escuro (#1A1A2E), roxo LabIA (#7C3AED) como cor de ação primária, laranja (#F97316) como acento para alertas e métricas de destaque. Cores semânticas para status (verde sucesso, amarelo atenção, vermelho erro).
Layout Paradigm: Sidebar fixa à esquerda com navegação vertical colapsável + área de conteúdo principal com header fixo. Sidebar escura (#1C1C2E) para contraste com a área de conteúdo clara.
Signature Elements: Sidebar dark com ícones e labels em branco; cards de métricas com bordas sutis e ícones coloridos; tabelas com hover states elegantes; breadcrumbs para navegação contextual.
Interaction Philosophy: Transições suaves de 200ms; hover states com elevação sutil; modais para ações destrutivas; toasts para feedback.
Animation: Entrada escalonada de cards; transição de sidebar collapse; loading skeletons em tabelas; contadores animados nas métricas.
Typography System: Inter (headings semibold 600) + Inter (body regular 400) — profissional e legível para dados densos.
</text>
<probability>0.07</probability>
</response>

<response>
<text>
**Abordagem B — "Edu-Tech Command Center"**
Design Movement: Mission Control moderno inspirado em Notion + Figma Admin, com toques educacionais.
Core Principles: Dark mode profissional com acentos vibrantes; hierarquia visual por cor e peso; dados organizados em cards modulares; identidade visual forte do LabIA.
Color Philosophy: Fundo dark (#0F0F1A), superfícies (#1C1C2E / #252538), roxo (#7C3AED) como primária, laranja (#F97316) como acento, com gradiente roxo→laranja nos CTAs. Verde (#10B981) para sucesso, azul (#3B82F6) para informação, rosa (#EC4899) para destaque.
Layout Paradigm: Sidebar dark com gradiente sutil no header + área de conteúdo com fundo levemente mais claro. Cards com bordas semi-transparentes e glow sutil.
Signature Elements: Logo do LabIA com foguete na sidebar; gradiente roxo→laranja nos headers de seção; gráficos com cores das trilhas; badges de status coloridos.
Interaction Philosophy: Micro-animações em hover; transições de página com fade; modais com backdrop blur; drag-and-drop para reordenar missões.
Animation: Framer Motion para entradas; contadores de métricas animados; gráficos com animação de desenho; sidebar com transição suave.
Typography System: Nunito (headings bold 700) + Inter (body regular 400) — mantendo a identidade do app LabIA.
</text>
<probability>0.05</probability>
</response>

<response>
<text>
**Abordagem C — "Clean Professional Admin"**
Design Movement: Material Design 3 + Vercel Dashboard, foco em clareza e produtividade.
Core Principles: Light mode com sidebar escura para contraste; tipografia clara e hierárquica; espaçamento generoso; dados acessíveis em até 2 cliques.
Color Philosophy: Fundo claro (#F8FAFC), sidebar dark (#1E1E2E) com acentos roxo LabIA, cards brancos (#FFFFFF) com sombras suaves, roxo (#7C3AED) para ações primárias, laranja (#F97316) para métricas de destaque e alertas.
Layout Paradigm: Sidebar colapsável escura à esquerda + top bar com busca e perfil + conteúdo principal em grid responsivo. Breadcrumbs para contexto.
Signature Elements: Sidebar com logo LabIA e gradiente sutil; cards de métricas com ícones em círculos coloridos; tabelas com filtros inline; gráficos recharts com paleta LabIA.
Interaction Philosophy: Feedback imediato em todas as ações; confirmação para ações destrutivas; filtros e busca em tempo real; paginação suave.
Animation: Transições de 150ms para hover; skeleton loading; contadores numéricos animados; sidebar collapse com transição.
Typography System: Inter (headings semibold 600, body regular 400) — clean e profissional para ambiente administrativo.
</text>
<probability>0.08</probability>
</response>

## Escolha: Abordagem A — "Corporate Dashboard Minimal"
Melhor equilíbrio entre profissionalismo, legibilidade de dados e identidade visual do LabIA. A sidebar escura cria um contraste elegante com a área de conteúdo clara, facilitando a leitura de tabelas e métricas. A tipografia Inter garante legibilidade em interfaces densas com dados.
