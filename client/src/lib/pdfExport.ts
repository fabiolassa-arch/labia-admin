/*
 * PDF Export Utility — Geração de relatórios em PDF
 * Usa jsPDF + jspdf-autotable para criar PDFs profissionais
 */
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

// Cores do LabIA
const PURPLE = [124, 58, 237] as const;
const ORANGE = [249, 115, 22] as const;
const DARK = [28, 28, 46] as const;
const GRAY = [107, 114, 128] as const;
const LIGHT_GRAY = [243, 244, 246] as const;
const WHITE = [255, 255, 255] as const;

function drawHeader(doc: jsPDF, title: string, subtitle: string) {
  const pageWidth = doc.internal.pageSize.getWidth();

  // Header bar gradient (simulated with two rects)
  doc.setFillColor(...DARK);
  doc.rect(0, 0, pageWidth, 45, "F");
  doc.setFillColor(...PURPLE);
  doc.rect(0, 42, pageWidth, 3, "F");

  // Logo text
  doc.setTextColor(...WHITE);
  doc.setFontSize(22);
  doc.setFont("helvetica", "bold");
  doc.text("LabIA", 20, 22);
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(180, 180, 200);
  doc.text("Painel Administrativo", 20, 32);

  // Title
  doc.setTextColor(...DARK);
  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  doc.text(title, 20, 65);

  // Subtitle
  doc.setTextColor(...GRAY);
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text(subtitle, 20, 75);

  // Date
  const now = new Date();
  const dateStr = now.toLocaleDateString("pt-BR", {
    day: "2-digit", month: "long", year: "numeric"
  });
  doc.setFontSize(9);
  doc.text(`Gerado em ${dateStr}`, pageWidth - 20, 75, { align: "right" });

  // Separator
  doc.setDrawColor(...LIGHT_GRAY);
  doc.setLineWidth(0.5);
  doc.line(20, 80, pageWidth - 20, 80);

  return 85;
}

function drawFooter(doc: jsPDF, pageNum: number) {
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  doc.setDrawColor(...LIGHT_GRAY);
  doc.setLineWidth(0.3);
  doc.line(20, pageHeight - 20, pageWidth - 20, pageHeight - 20);

  doc.setFontSize(8);
  doc.setTextColor(...GRAY);
  doc.text("LabIA © 2026 — Alfabetização em Inteligência Artificial", 20, pageHeight - 12);
  doc.text(`Página ${pageNum}`, pageWidth - 20, pageHeight - 12, { align: "right" });
  doc.text("Documento confidencial — Uso interno", pageWidth / 2, pageHeight - 12, { align: "center" });
}

function drawSectionTitle(doc: jsPDF, title: string, y: number): number {
  doc.setFillColor(...PURPLE);
  doc.rect(20, y, 4, 14, "F");
  doc.setTextColor(...DARK);
  doc.setFontSize(13);
  doc.setFont("helvetica", "bold");
  doc.text(title, 28, y + 10);
  return y + 22;
}

function drawMetricCard(doc: jsPDF, x: number, y: number, w: number, label: string, value: string, sublabel?: string) {
  doc.setFillColor(...LIGHT_GRAY);
  doc.roundedRect(x, y, w, 35, 3, 3, "F");

  doc.setTextColor(...GRAY);
  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.text(label, x + 8, y + 12);

  doc.setTextColor(...DARK);
  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  doc.text(value, x + 8, y + 26);

  if (sublabel) {
    doc.setTextColor(16, 185, 129);
    doc.setFontSize(7);
    doc.setFont("helvetica", "normal");
    doc.text(sublabel, x + 8 + doc.getTextWidth(value) + 4, y + 26);
  }
}

function drawBarChart(doc: jsPDF, data: { label: string; value: number; color: number[] }[], x: number, y: number, w: number, h: number, maxVal: number) {
  const barCount = data.length;
  const barWidth = (w - 40) / barCount;
  const chartBottom = y + h - 15;
  const chartTop = y + 5;
  const chartHeight = chartBottom - chartTop;

  // Y axis line
  doc.setDrawColor(200, 200, 200);
  doc.setLineWidth(0.3);
  doc.line(x + 30, chartTop, x + 30, chartBottom);
  doc.line(x + 30, chartBottom, x + w, chartBottom);

  // Y axis labels
  doc.setFontSize(7);
  doc.setTextColor(...GRAY);
  for (let i = 0; i <= 4; i++) {
    const val = Math.round((maxVal / 4) * i);
    const yPos = chartBottom - (chartHeight * i / 4);
    doc.text(String(val), x + 27, yPos + 2, { align: "right" });
    doc.setDrawColor(240, 240, 240);
    doc.line(x + 30, yPos, x + w, yPos);
  }

  // Bars
  data.forEach((item, i) => {
    const barH = (item.value / maxVal) * chartHeight;
    const barX = x + 35 + i * barWidth + barWidth * 0.15;
    const bw = barWidth * 0.7;

    doc.setFillColor(item.color[0], item.color[1], item.color[2]);
    doc.roundedRect(barX, chartBottom - barH, bw, barH, 2, 2, "F");

    // Label
    doc.setFontSize(6);
    doc.setTextColor(...GRAY);
    doc.text(item.label, barX + bw / 2, chartBottom + 8, { align: "center" });

    // Value on top
    doc.setFontSize(7);
    doc.setTextColor(...DARK);
    doc.text(String(item.value), barX + bw / 2, chartBottom - barH - 3, { align: "center" });
  });
}

// ============================================================
// RELATÓRIO 1: Desempenho Geral dos Alunos
// ============================================================
export function exportDesempenhoGeralPDF() {
  const doc = new jsPDF("p", "mm", "a4");
  const pageWidth = doc.internal.pageSize.getWidth();
  let y: number;

  // === CAPA ===
  doc.setFillColor(...DARK);
  doc.rect(0, 0, pageWidth, doc.internal.pageSize.getHeight(), "F");

  // Accent bar
  doc.setFillColor(...PURPLE);
  doc.rect(0, 0, 6, doc.internal.pageSize.getHeight(), "F");

  // Title
  doc.setTextColor(...WHITE);
  doc.setFontSize(36);
  doc.setFont("helvetica", "bold");
  doc.text("Relatório de", 30, 80);
  doc.text("Desempenho Geral", 30, 98);

  // Gradient line
  doc.setFillColor(...PURPLE);
  doc.rect(30, 108, 60, 3, "F");
  doc.setFillColor(...ORANGE);
  doc.rect(90, 108, 40, 3, "F");

  // Subtitle
  doc.setTextColor(180, 180, 200);
  doc.setFontSize(14);
  doc.setFont("helvetica", "normal");
  doc.text("Análise completa do desempenho dos alunos", 30, 125);
  doc.text("na plataforma LabIA", 30, 137);

  // Date
  const now = new Date();
  doc.setFontSize(11);
  doc.text(`Período: Setembro 2025 — Março 2026`, 30, 165);
  doc.text(`Gerado em: ${now.toLocaleDateString("pt-BR")}`, 30, 177);

  // Footer
  doc.setTextColor(100, 100, 120);
  doc.setFontSize(9);
  doc.text("LabIA — Alfabetização em Inteligência Artificial", 30, doc.internal.pageSize.getHeight() - 30);
  doc.text("Documento confidencial — Uso interno", 30, doc.internal.pageSize.getHeight() - 20);

  // === PÁGINA 2: Resumo Executivo ===
  doc.addPage();
  y = drawHeader(doc, "Resumo Executivo", "Visão geral dos indicadores de desempenho da plataforma");

  // Metric cards
  drawMetricCard(doc, 20, y, 40, "Total de Alunos", "1.247", "+15%");
  drawMetricCard(doc, 64, y, 40, "Missões Concluídas", "4.620", "+22%");
  drawMetricCard(doc, 108, y, 40, "Taxa de Engajamento", "76%", "+4%");
  drawMetricCard(doc, 152, y, 40, "Escolas Parceiras", "12", "+3");
  y += 45;

  // Summary text
  y = drawSectionTitle(doc, "Análise do Período", y);
  doc.setTextColor(...DARK);
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  const summaryText = "A plataforma LabIA apresentou crescimento consistente ao longo do período analisado. O número de alunos ativos cresceu 15% em relação ao período anterior, com destaque para o mês de fevereiro que registrou 203 novos cadastros. A taxa de engajamento manteve-se acima de 70% em todos os meses, indicando boa retenção dos alunos nas trilhas de aprendizado. O total de missões concluídas ultrapassou 4.600, com média de 3,7 missões por aluno ativo.";
  const lines = doc.splitTextToSize(summaryText, pageWidth - 48);
  doc.text(lines, 24, y);
  y += lines.length * 5 + 10;

  // Desempenho Mensal table
  y = drawSectionTitle(doc, "Desempenho Mensal", y);

  autoTable(doc, {
    startY: y,
    margin: { left: 24, right: 24 },
    head: [["Mês", "Novos Alunos", "Missões Concluídas", "Taxa de Engajamento"]],
    body: [
      ["Setembro 2025", "89", "320", "68%"],
      ["Outubro 2025", "124", "480", "72%"],
      ["Novembro 2025", "156", "620", "75%"],
      ["Dezembro 2025", "98", "540", "70%"],
      ["Janeiro 2026", "178", "750", "78%"],
      ["Fevereiro 2026", "203", "890", "76%"],
      ["Março 2026", "189", "1.020", "73%"],
    ],
    foot: [["Total / Média", "1.037", "4.620", "73,1%"]],
    headStyles: {
      fillColor: [124, 58, 237],
      textColor: [255, 255, 255],
      fontStyle: "bold",
      fontSize: 9,
    },
    footStyles: {
      fillColor: [243, 244, 246],
      textColor: [28, 28, 46],
      fontStyle: "bold",
      fontSize: 9,
    },
    bodyStyles: {
      fontSize: 9,
      textColor: [55, 65, 81],
    },
    alternateRowStyles: {
      fillColor: [249, 250, 251],
    },
    styles: {
      cellPadding: 4,
      lineColor: [229, 231, 235],
      lineWidth: 0.3,
    },
  });

  drawFooter(doc, 1);

  // === PÁGINA 3: Distribuição por Nível e Habilidades ===
  doc.addPage();
  y = drawHeader(doc, "Distribuição e Habilidades", "Análise dos níveis dos alunos e habilidades desenvolvidas");

  // Distribuição por nível
  y = drawSectionTitle(doc, "Distribuição por Nível", y);

  autoTable(doc, {
    startY: y,
    margin: { left: 24, right: 24 },
    head: [["Nível", "Quantidade de Alunos", "Percentual", "Descrição"]],
    body: [
      ["Iniciante", "312", "25%", "Alunos que estão começando a jornada"],
      ["Explorador", "428", "34,3%", "Alunos explorando conceitos de IA"],
      ["Inventor", "289", "23,2%", "Alunos criando soluções com IA"],
      ["Cientista", "156", "12,5%", "Alunos com domínio avançado"],
      ["Mestre", "62", "5%", "Alunos que completaram todas as trilhas"],
    ],
    headStyles: {
      fillColor: [124, 58, 237],
      textColor: [255, 255, 255],
      fontStyle: "bold",
      fontSize: 9,
    },
    bodyStyles: { fontSize: 9, textColor: [55, 65, 81] },
    alternateRowStyles: { fillColor: [249, 250, 251] },
    styles: { cellPadding: 4, lineColor: [229, 231, 235], lineWidth: 0.3 },
  });

  y = (doc as any).lastAutoTable.finalY + 15;

  // Habilidades
  y = drawSectionTitle(doc, "Habilidades Desenvolvidas", y);

  autoTable(doc, {
    startY: y,
    margin: { left: 24, right: 24 },
    head: [["Habilidade", "Média Geral (%)", "Meta (%)", "Status"]],
    body: [
      ["Conceitos de IA", "85", "72", "Acima da meta"],
      ["Criação de Prompts", "78", "65", "Acima da meta"],
      ["Pensamento Crítico", "72", "58", "Acima da meta"],
      ["Criatividade", "88", "70", "Acima da meta"],
      ["Resolução de Problemas", "65", "55", "Acima da meta"],
      ["Colaboração", "80", "68", "Acima da meta"],
    ],
    headStyles: {
      fillColor: [124, 58, 237],
      textColor: [255, 255, 255],
      fontStyle: "bold",
      fontSize: 9,
    },
    bodyStyles: { fontSize: 9, textColor: [55, 65, 81] },
    alternateRowStyles: { fillColor: [249, 250, 251] },
    styles: { cellPadding: 4, lineColor: [229, 231, 235], lineWidth: 0.3 },
    didParseCell(data) {
      if (data.column.index === 3 && data.section === "body") {
        data.cell.styles.textColor = [16, 185, 129];
        data.cell.styles.fontStyle = "bold";
      }
    },
  });

  y = (doc as any).lastAutoTable.finalY + 15;

  // Analysis text
  doc.setTextColor(...DARK);
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  const analysisText = "Todas as habilidades avaliadas estão acima das metas estabelecidas, com destaque para Criatividade (88%) e Conceitos de IA (85%). A habilidade de Resolução de Problemas (65%) apresenta a menor pontuação, mas ainda assim supera a meta de 55%. Recomenda-se intensificar atividades práticas para fortalecer essa competência.";
  const analysisLines = doc.splitTextToSize(analysisText, pageWidth - 48);
  doc.text(analysisLines, 24, y);

  drawFooter(doc, 2);

  // === PÁGINA 4: Recomendações ===
  doc.addPage();
  y = drawHeader(doc, "Recomendações", "Sugestões para melhoria contínua da plataforma");

  y = drawSectionTitle(doc, "Ações Recomendadas", y);

  const recommendations = [
    { title: "Aumentar atividades de Resolução de Problemas", desc: "Criar missões adicionais focadas em desafios práticos para fortalecer essa habilidade, que apresenta a menor pontuação entre todas as avaliadas." },
    { title: "Programa de mentoria para nível Iniciante", desc: "Implementar um sistema de mentoria onde alunos de nível Cientista e Mestre auxiliem os Iniciantes, reduzindo a taxa de abandono nos primeiros dias." },
    { title: "Gamificação avançada", desc: "Adicionar competições semanais entre escolas e rankings dinâmicos para aumentar o engajamento, especialmente no Colégio Inovação que apresenta a menor taxa (52%)." },
    { title: "Conteúdo adaptativo por escola", desc: "Personalizar trilhas de acordo com o perfil de cada escola parceira, considerando as diferenças de desempenho identificadas no comparativo." },
    { title: "Relatórios para pais e responsáveis", desc: "Criar uma versão simplificada do relatório de progresso para compartilhar com as famílias, aumentando o engajamento fora da plataforma." },
  ];

  recommendations.forEach((rec, i) => {
    doc.setFillColor(...LIGHT_GRAY);
    doc.roundedRect(24, y, pageWidth - 48, 28, 2, 2, "F");

    doc.setFillColor(...PURPLE);
    doc.circle(32, y + 10, 4, "F");
    doc.setTextColor(...WHITE);
    doc.setFontSize(8);
    doc.setFont("helvetica", "bold");
    doc.text(String(i + 1), 32, y + 12, { align: "center" });

    doc.setTextColor(...DARK);
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text(rec.title, 40, y + 10);

    doc.setTextColor(...GRAY);
    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    const descLines = doc.splitTextToSize(rec.desc, pageWidth - 72);
    doc.text(descLines, 40, y + 18);

    y += 34;
  });

  drawFooter(doc, 3);

  doc.save("LabIA_Relatorio_Desempenho_Geral.pdf");
}

// ============================================================
// RELATÓRIO 2: Progresso por Escola
// ============================================================
export function exportProgressoEscolasPDF() {
  const doc = new jsPDF("p", "mm", "a4");
  const pageWidth = doc.internal.pageSize.getWidth();
  let y: number;

  // === CAPA ===
  doc.setFillColor(...DARK);
  doc.rect(0, 0, pageWidth, doc.internal.pageSize.getHeight(), "F");

  doc.setFillColor(...ORANGE);
  doc.rect(0, 0, 6, doc.internal.pageSize.getHeight(), "F");

  doc.setTextColor(...WHITE);
  doc.setFontSize(36);
  doc.setFont("helvetica", "bold");
  doc.text("Progresso", 30, 80);
  doc.text("por Escola", 30, 98);

  doc.setFillColor(...ORANGE);
  doc.rect(30, 108, 60, 3, "F");
  doc.setFillColor(...PURPLE);
  doc.rect(90, 108, 40, 3, "F");

  doc.setTextColor(180, 180, 200);
  doc.setFontSize(14);
  doc.setFont("helvetica", "normal");
  doc.text("Comparativo detalhado entre escolas parceiras", 30, 125);
  doc.text("da plataforma LabIA", 30, 137);

  const now = new Date();
  doc.setFontSize(11);
  doc.text(`Período: Setembro 2025 — Março 2026`, 30, 165);
  doc.text(`Gerado em: ${now.toLocaleDateString("pt-BR")}`, 30, 177);

  doc.setTextColor(100, 100, 120);
  doc.setFontSize(9);
  doc.text("LabIA — Alfabetização em Inteligência Artificial", 30, doc.internal.pageSize.getHeight() - 30);
  doc.text("Documento confidencial — Uso interno", 30, doc.internal.pageSize.getHeight() - 20);

  // === PÁGINA 2: Visão Geral das Escolas ===
  doc.addPage();
  y = drawHeader(doc, "Visão Geral das Escolas", "Comparativo de desempenho entre as escolas parceiras");

  // Metrics
  drawMetricCard(doc, 20, y, 40, "Escolas Parceiras", "5", "");
  drawMetricCard(doc, 64, y, 40, "Total de Alunos", "822", "+18%");
  drawMetricCard(doc, 108, y, 40, "Progresso Médio", "68,2%", "+8%");
  drawMetricCard(doc, 152, y, 40, "Engajamento Médio", "73,6%", "+5%");
  y += 45;

  // Tabela comparativa
  y = drawSectionTitle(doc, "Comparativo Detalhado", y);

  autoTable(doc, {
    startY: y,
    margin: { left: 24, right: 24 },
    head: [["Escola", "Alunos", "Progresso (%)", "Engajamento (%)", "Missões/Aluno", "Ranking"]],
    body: [
      ["Instituto Tech", "156", "82%", "88%", "4.8", "1º"],
      ["Escola Nova Era", "245", "78%", "82%", "4.2", "2º"],
      ["Escola Criativa", "134", "71%", "75%", "3.6", "3º"],
      ["Colégio Futuro", "189", "65%", "71%", "3.1", "4º"],
      ["Colégio Inovação", "98", "45%", "52%", "2.1", "5º"],
    ],
    headStyles: {
      fillColor: [249, 115, 22],
      textColor: [255, 255, 255],
      fontStyle: "bold",
      fontSize: 9,
    },
    bodyStyles: { fontSize: 9, textColor: [55, 65, 81] },
    alternateRowStyles: { fillColor: [255, 247, 237] },
    styles: { cellPadding: 4, lineColor: [229, 231, 235], lineWidth: 0.3 },
    didParseCell(data) {
      if (data.column.index === 5 && data.section === "body") {
        const rank = data.cell.raw as string;
        if (rank === "1º") {
          data.cell.styles.textColor = [16, 185, 129];
          data.cell.styles.fontStyle = "bold";
        }
      }
    },
  });

  y = (doc as any).lastAutoTable.finalY + 15;

  // Analysis
  y = drawSectionTitle(doc, "Análise Comparativa", y);
  doc.setTextColor(...DARK);
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  const schoolAnalysis = "O Instituto Tech lidera o ranking com 82% de progresso e 88% de engajamento, apesar de ter menos alunos (156). A Escola Nova Era, com o maior número de alunos (245), mantém bom desempenho com 78% de progresso. O Colégio Inovação apresenta os menores índices (45% progresso, 52% engajamento) e requer atenção especial com plano de ação dedicado.";
  const schoolLines = doc.splitTextToSize(schoolAnalysis, pageWidth - 48);
  doc.text(schoolLines, 24, y);

  drawFooter(doc, 1);

  // === PÁGINA 3: Detalhamento por Escola ===
  doc.addPage();
  y = drawHeader(doc, "Detalhamento por Escola", "Análise individual de cada escola parceira");

  const escolas = [
    {
      nome: "Instituto Tech",
      alunos: 156, progresso: 82, engajamento: 88,
      destaques: "Maior taxa de engajamento. 23 alunos no nível Cientista. Programa de monitoria ativo.",
      desafios: "Capacidade limitada para novos alunos. Necessita de mais trilhas avançadas.",
    },
    {
      nome: "Escola Nova Era",
      alunos: 245, progresso: 78, engajamento: 82,
      destaques: "Maior número de alunos. Boa distribuição entre níveis. Professores engajados.",
      desafios: "Taxa de conclusão de missões abaixo da média em turmas do 6º ano.",
    },
    {
      nome: "Escola Criativa",
      alunos: 134, progresso: 71, engajamento: 75,
      destaques: "Forte em atividades criativas. Bom uso do Chat IA. Projetos interdisciplinares.",
      desafios: "Baixa frequência de acesso nos finais de semana. Necessita de gamificação.",
    },
    {
      nome: "Colégio Futuro",
      alunos: 189, progresso: 65, engajamento: 71,
      destaques: "Crescimento constante mês a mês. Boa infraestrutura tecnológica.",
      desafios: "Alta rotatividade de professores. Necessita de treinamento docente.",
    },
    {
      nome: "Colégio Inovação",
      alunos: 98, progresso: 45, engajamento: 52,
      destaques: "Escola mais recente na plataforma. Direção comprometida com o projeto.",
      desafios: "Baixo engajamento geral. Infraestrutura limitada. Necessita de plano de ação urgente.",
    },
  ];

  escolas.forEach((escola, i) => {
    if (y > 230) {
      drawFooter(doc, doc.getNumberOfPages() - 1);
      doc.addPage();
      y = drawHeader(doc, "Detalhamento por Escola (cont.)", "");
    }

    // School card
    doc.setFillColor(...LIGHT_GRAY);
    doc.roundedRect(24, y, pageWidth - 48, 48, 3, 3, "F");

    // Rank badge
    doc.setFillColor(i === 0 ? 16 : i < 3 ? 124 : 156, i === 0 ? 185 : i < 3 ? 58 : 163, i === 0 ? 129 : i < 3 ? 237 : 175);
    doc.roundedRect(28, y + 4, 18, 14, 2, 2, "F");
    doc.setTextColor(...WHITE);
    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.text(`${i + 1}º`, 37, y + 13, { align: "center" });

    // Name
    doc.setTextColor(...DARK);
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text(escola.nome, 50, y + 13);

    // Stats
    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...GRAY);
    doc.text(`${escola.alunos} alunos  |  Progresso: ${escola.progresso}%  |  Engajamento: ${escola.engajamento}%`, 50, y + 22);

    // Destaques
    doc.setTextColor(16, 185, 129);
    doc.setFontSize(7);
    doc.setFont("helvetica", "bold");
    doc.text("Destaques: ", 28, y + 33);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...DARK);
    const destLines = doc.splitTextToSize(escola.destaques, pageWidth - 80);
    doc.text(destLines, 52, y + 33);

    // Desafios
    doc.setTextColor(239, 68, 68);
    doc.setFontSize(7);
    doc.setFont("helvetica", "bold");
    doc.text("Desafios: ", 28, y + 42);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...DARK);
    const desLines = doc.splitTextToSize(escola.desafios, pageWidth - 80);
    doc.text(desLines, 52, y + 42);

    y += 56;
  });

  drawFooter(doc, doc.getNumberOfPages() - 1);

  doc.save("LabIA_Progresso_por_Escola.pdf");
}

// ============================================================
// RELATÓRIO 3: Engajamento Mensal
// ============================================================
export function exportEngajamentoMensalPDF() {
  const doc = new jsPDF("p", "mm", "a4");
  const pageWidth = doc.internal.pageSize.getWidth();
  let y: number;

  // === CAPA ===
  doc.setFillColor(...DARK);
  doc.rect(0, 0, pageWidth, doc.internal.pageSize.getHeight(), "F");
  doc.setFillColor(16, 185, 129);
  doc.rect(0, 0, 6, doc.internal.pageSize.getHeight(), "F");

  doc.setTextColor(...WHITE);
  doc.setFontSize(36);
  doc.setFont("helvetica", "bold");
  doc.text("Engajamento", 30, 80);
  doc.text("Mensal", 30, 98);

  doc.setFillColor(16, 185, 129);
  doc.rect(30, 108, 60, 3, "F");
  doc.setFillColor(...PURPLE);
  doc.rect(90, 108, 40, 3, "F");

  doc.setTextColor(180, 180, 200);
  doc.setFontSize(14);
  doc.setFont("helvetica", "normal");
  doc.text("Análise detalhada do engajamento dos alunos", 30, 125);
  doc.text("ao longo dos meses", 30, 137);

  const now = new Date();
  doc.setFontSize(11);
  doc.text(`Período: Setembro 2025 — Março 2026`, 30, 165);
  doc.text(`Gerado em: ${now.toLocaleDateString("pt-BR")}`, 30, 177);

  doc.setTextColor(100, 100, 120);
  doc.setFontSize(9);
  doc.text("LabIA — Alfabetização em Inteligência Artificial", 30, doc.internal.pageSize.getHeight() - 30);

  // === PÁGINA 2 ===
  doc.addPage();
  y = drawHeader(doc, "Métricas de Engajamento", "Indicadores detalhados de participação e retenção");

  drawMetricCard(doc, 20, y, 40, "Sessões Totais", "18.450", "+25%");
  drawMetricCard(doc, 64, y, 40, "Tempo Médio/Sessão", "12 min", "+2 min");
  drawMetricCard(doc, 108, y, 40, "Taxa de Retorno", "68%", "+7%");
  drawMetricCard(doc, 152, y, 40, "NPS", "72", "+5");
  y += 45;

  y = drawSectionTitle(doc, "Engajamento por Mês", y);

  autoTable(doc, {
    startY: y,
    margin: { left: 24, right: 24 },
    head: [["Mês", "Sessões", "Tempo Médio", "Taxa Retorno", "Missões/Dia", "Chat IA (msgs)", "Engajamento"]],
    body: [
      ["Set/25", "1.890", "9 min", "58%", "45", "320", "68%"],
      ["Out/25", "2.340", "10 min", "62%", "56", "480", "72%"],
      ["Nov/25", "2.780", "11 min", "65%", "68", "620", "75%"],
      ["Dez/25", "2.150", "10 min", "60%", "52", "410", "70%"],
      ["Jan/26", "3.120", "12 min", "70%", "78", "750", "78%"],
      ["Fev/26", "3.450", "13 min", "72%", "85", "890", "76%"],
      ["Mar/26", "2.720", "12 min", "68%", "72", "680", "73%"],
    ],
    headStyles: {
      fillColor: [16, 185, 129],
      textColor: [255, 255, 255],
      fontStyle: "bold",
      fontSize: 8,
    },
    bodyStyles: { fontSize: 8, textColor: [55, 65, 81] },
    alternateRowStyles: { fillColor: [236, 253, 245] },
    styles: { cellPadding: 3, lineColor: [229, 231, 235], lineWidth: 0.3 },
  });

  y = (doc as any).lastAutoTable.finalY + 15;

  y = drawSectionTitle(doc, "Insights e Tendências", y);
  doc.setTextColor(...DARK);
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  const engajText = "O engajamento apresentou tendência de alta consistente, com pico em janeiro (78%). A queda em dezembro é sazonal (férias escolares). O tempo médio por sessão cresceu de 9 para 13 minutos, indicando que os alunos estão dedicando mais tempo às atividades. O uso do Chat IA triplicou no período, mostrando forte adoção dessa funcionalidade. Recomenda-se manter campanhas de engajamento durante períodos de férias para minimizar quedas sazonais.";
  const engajLines = doc.splitTextToSize(engajText, pageWidth - 48);
  doc.text(engajLines, 24, y);

  drawFooter(doc, 1);

  doc.save("LabIA_Engajamento_Mensal.pdf");
}

// ============================================================
// RELATÓRIO 4: Análise de Trilhas
// ============================================================
export function exportAnaliseTrilhasPDF() {
  const doc = new jsPDF("p", "mm", "a4");
  const pageWidth = doc.internal.pageSize.getWidth();
  let y: number;

  // === CAPA ===
  doc.setFillColor(...DARK);
  doc.rect(0, 0, pageWidth, doc.internal.pageSize.getHeight(), "F");
  doc.setFillColor(59, 130, 246);
  doc.rect(0, 0, 6, doc.internal.pageSize.getHeight(), "F");

  doc.setTextColor(...WHITE);
  doc.setFontSize(36);
  doc.setFont("helvetica", "bold");
  doc.text("Análise de", 30, 80);
  doc.text("Trilhas", 30, 98);

  doc.setFillColor(59, 130, 246);
  doc.rect(30, 108, 60, 3, "F");
  doc.setFillColor(...ORANGE);
  doc.rect(90, 108, 40, 3, "F");

  doc.setTextColor(180, 180, 200);
  doc.setFontSize(14);
  doc.setFont("helvetica", "normal");
  doc.text("Desempenho detalhado por trilha e missão", 30, 125);

  const now = new Date();
  doc.setFontSize(11);
  doc.text(`Período: Setembro 2025 — Março 2026`, 30, 155);
  doc.text(`Gerado em: ${now.toLocaleDateString("pt-BR")}`, 30, 167);

  doc.setTextColor(100, 100, 120);
  doc.setFontSize(9);
  doc.text("LabIA — Alfabetização em Inteligência Artificial", 30, doc.internal.pageSize.getHeight() - 30);

  // === PÁGINA 2 ===
  doc.addPage();
  y = drawHeader(doc, "Desempenho por Trilha", "Taxa de conclusão e engajamento em cada trilha de aprendizado");

  y = drawSectionTitle(doc, "Visão Geral das Trilhas", y);

  autoTable(doc, {
    startY: y,
    margin: { left: 24, right: 24 },
    head: [["Trilha", "Missões", "Alunos Inscritos", "Taxa Conclusão", "Nota Média", "Tempo Médio"]],
    body: [
      ["Entendendo a IA", "4", "1.247", "72%", "8.5", "45 min"],
      ["Criando Prompts", "4", "892", "58%", "7.8", "60 min"],
      ["Criando Soluções", "4", "534", "41%", "8.2", "75 min"],
      ["Meu Primeiro App", "4", "312", "28%", "8.7", "90 min"],
    ],
    headStyles: {
      fillColor: [59, 130, 246],
      textColor: [255, 255, 255],
      fontStyle: "bold",
      fontSize: 9,
    },
    bodyStyles: { fontSize: 9, textColor: [55, 65, 81] },
    alternateRowStyles: { fillColor: [239, 246, 255] },
    styles: { cellPadding: 4, lineColor: [229, 231, 235], lineWidth: 0.3 },
  });

  y = (doc as any).lastAutoTable.finalY + 15;

  y = drawSectionTitle(doc, "Análise por Trilha", y);
  doc.setTextColor(...DARK);
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  const trilhaText = "A trilha 'Entendendo a IA' apresenta a maior taxa de conclusão (72%), sendo a porta de entrada da plataforma. A taxa de conclusão diminui progressivamente nas trilhas seguintes, o que é esperado dado o aumento de complexidade. A trilha 'Meu Primeiro App' tem a menor taxa de conclusão (28%), mas a maior nota média (8.7), indicando que os alunos que chegam até ela estão altamente engajados. Recomenda-se criar conteúdos de transição entre trilhas para reduzir a evasão.";
  const trilhaLines = doc.splitTextToSize(trilhaText, pageWidth - 48);
  doc.text(trilhaLines, 24, y);

  drawFooter(doc, 1);

  doc.save("LabIA_Analise_Trilhas.pdf");
}
