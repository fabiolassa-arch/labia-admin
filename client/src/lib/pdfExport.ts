/*
 * PDF Export Utility — Geração de relatórios em PDF
 * Usa jsPDF + jspdf-autotable para criar PDFs profissionais
 * Aceita dados dinâmicos por período via ReportDataSet
 */
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import type { ReportDataSet } from "./reportData";

// Sanitiza nome de arquivo removendo acentos e caracteres especiais
function sanitizeFilename(str: string): string {
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, "_")
    .replace(/[^a-zA-Z0-9_-]/g, "");
}

// Cores do LabIA
const PURPLE = [124, 58, 237] as const;
const ORANGE = [249, 115, 22] as const;
const DARK = [28, 28, 46] as const;
const GRAY = [107, 114, 128] as const;
const LIGHT_GRAY = [243, 244, 246] as const;
const WHITE = [255, 255, 255] as const;

function drawHeader(doc: jsPDF, title: string, subtitle: string) {
  const pageWidth = doc.internal.pageSize.getWidth();

  doc.setFillColor(...DARK);
  doc.rect(0, 0, pageWidth, 45, "F");
  doc.setFillColor(...PURPLE);
  doc.rect(0, 42, pageWidth, 3, "F");

  doc.setTextColor(...WHITE);
  doc.setFontSize(22);
  doc.setFont("helvetica", "bold");
  doc.text("LabIA", 20, 22);
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(180, 180, 200);
  doc.text("Painel Administrativo", 20, 32);

  doc.setTextColor(...DARK);
  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  doc.text(title, 20, 65);

  doc.setTextColor(...GRAY);
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text(subtitle, 20, 75);

  const now = new Date();
  const dateStr = now.toLocaleDateString("pt-BR", {
    day: "2-digit", month: "long", year: "numeric"
  });
  doc.setFontSize(9);
  doc.text(`Gerado em ${dateStr}`, pageWidth - 20, 75, { align: "right" });

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
  doc.text("LabIA \u00A9 2026 \u2014 Alfabetiza\u00E7\u00E3o em Intelig\u00EAncia Artificial", 20, pageHeight - 12);
  doc.text(`P\u00E1gina ${pageNum}`, pageWidth - 20, pageHeight - 12, { align: "right" });
  doc.text("Documento confidencial \u2014 Uso interno", pageWidth / 2, pageHeight - 12, { align: "center" });
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

function drawCover(
  doc: jsPDF,
  title1: string,
  title2: string,
  subtitle1: string,
  subtitle2: string,
  accentColor: readonly [number, number, number],
  secondColor: readonly [number, number, number],
  periodoLabel: string,
  periodoDesc: string,
) {
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  doc.setFillColor(...DARK);
  doc.rect(0, 0, pageWidth, pageHeight, "F");

  doc.setFillColor(accentColor[0], accentColor[1], accentColor[2]);
  doc.rect(0, 0, 6, pageHeight, "F");

  doc.setTextColor(...WHITE);
  doc.setFontSize(36);
  doc.setFont("helvetica", "bold");
  doc.text(title1, 30, 80);
  doc.text(title2, 30, 98);

  doc.setFillColor(accentColor[0], accentColor[1], accentColor[2]);
  doc.rect(30, 108, 60, 3, "F");
  doc.setFillColor(secondColor[0], secondColor[1], secondColor[2]);
  doc.rect(90, 108, 40, 3, "F");

  doc.setTextColor(180, 180, 200);
  doc.setFontSize(14);
  doc.setFont("helvetica", "normal");
  doc.text(subtitle1, 30, 125);
  if (subtitle2) doc.text(subtitle2, 30, 137);

  const now = new Date();
  doc.setFontSize(11);
  doc.text(`Per\u00EDodo: ${periodoDesc}`, 30, 165);
  doc.text(`Gerado em: ${now.toLocaleDateString("pt-BR")}`, 30, 177);

  // Period badge
  doc.setFillColor(accentColor[0], accentColor[1], accentColor[2]);
  doc.roundedRect(30, 190, 90, 20, 3, 3, "F");
  doc.setTextColor(...WHITE);
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.text(periodoLabel, 75, 203, { align: "center" });

  doc.setTextColor(100, 100, 120);
  doc.setFontSize(9);
  doc.text("LabIA \u2014 Alfabetiza\u00E7\u00E3o em Intelig\u00EAncia Artificial", 30, pageHeight - 30);
  doc.text("Documento confidencial \u2014 Uso interno", 30, pageHeight - 20);
}

// ============================================================
// RELAT\u00D3RIO 1: Desempenho Geral dos Alunos
// ============================================================
export function exportDesempenhoGeralPDF(data: ReportDataSet) {
  const doc = new jsPDF("p", "mm", "a4");
  const pageWidth = doc.internal.pageSize.getWidth();
  let y: number;

  // === CAPA ===
  drawCover(
    doc,
    "Relat\u00F3rio de",
    "Desempenho Geral",
    "An\u00E1lise completa do desempenho dos alunos",
    "na plataforma LabIA",
    PURPLE, ORANGE,
    data.periodo.label,
    data.periodo.descricao,
  );

  // === P\u00C1GINA 2: Resumo Executivo ===
  doc.addPage();
  y = drawHeader(doc, "Resumo Executivo", `Vis\u00E3o geral dos indicadores \u2014 ${data.periodo.label}`);

  drawMetricCard(doc, 20, y, 40, "Total de Alunos", data.resumo.totalAlunos, data.resumo.totalAlunosDelta);
  drawMetricCard(doc, 64, y, 40, "Miss\u00F5es Conclu\u00EDdas", data.resumo.missoesConc, data.resumo.missoesDelta);
  drawMetricCard(doc, 108, y, 40, "Taxa de Engajamento", data.resumo.taxaEngajamento, data.resumo.engajamentoDelta);
  drawMetricCard(doc, 152, y, 40, "Escolas Parceiras", data.resumo.escolasParceiras, data.resumo.escolasDelta);
  y += 45;

  y = drawSectionTitle(doc, "An\u00E1lise do Per\u00EDodo", y);
  doc.setTextColor(...DARK);
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  const lines = doc.splitTextToSize(data.analiseGeral, pageWidth - 48);
  doc.text(lines, 24, y);
  y += lines.length * 5 + 10;

  y = drawSectionTitle(doc, "Desempenho por Per\u00EDodo", y);

  autoTable(doc, {
    startY: y,
    margin: { left: 24, right: 24 },
    head: [["Per\u00EDodo", "Novos Alunos", "Miss\u00F5es Conclu\u00EDdas", "Taxa de Engajamento"]],
    body: data.desempenhoMensalTabela,
    foot: [data.desempenhoMensalTotal],
    headStyles: { fillColor: [124, 58, 237], textColor: [255, 255, 255], fontStyle: "bold", fontSize: 9 },
    footStyles: { fillColor: [243, 244, 246], textColor: [28, 28, 46], fontStyle: "bold", fontSize: 9 },
    bodyStyles: { fontSize: 9, textColor: [55, 65, 81] },
    alternateRowStyles: { fillColor: [249, 250, 251] },
    styles: { cellPadding: 4, lineColor: [229, 231, 235], lineWidth: 0.3 },
  });

  drawFooter(doc, 1);

  // === P\u00C1GINA 3: Distribui\u00E7\u00E3o por N\u00EDvel e Habilidades ===
  doc.addPage();
  y = drawHeader(doc, "Distribui\u00E7\u00E3o e Habilidades", `An\u00E1lise dos n\u00EDveis e habilidades \u2014 ${data.periodo.label}`);

  y = drawSectionTitle(doc, "Distribui\u00E7\u00E3o por N\u00EDvel", y);

  autoTable(doc, {
    startY: y,
    margin: { left: 24, right: 24 },
    head: [["N\u00EDvel", "Quantidade de Alunos", "Percentual", "Descri\u00E7\u00E3o"]],
    body: data.niveis.map(n => [n.name, String(n.value), n.percentual, n.descricao]),
    headStyles: { fillColor: [124, 58, 237], textColor: [255, 255, 255], fontStyle: "bold", fontSize: 9 },
    bodyStyles: { fontSize: 9, textColor: [55, 65, 81] },
    alternateRowStyles: { fillColor: [249, 250, 251] },
    styles: { cellPadding: 4, lineColor: [229, 231, 235], lineWidth: 0.3 },
  });

  y = (doc as any).lastAutoTable.finalY + 15;

  y = drawSectionTitle(doc, "Habilidades Desenvolvidas", y);

  autoTable(doc, {
    startY: y,
    margin: { left: 24, right: 24 },
    head: [["Habilidade", "M\u00E9dia Geral (%)", "Meta (%)", "Status"]],
    body: data.habilidadesTabela,
    headStyles: { fillColor: [124, 58, 237], textColor: [255, 255, 255], fontStyle: "bold", fontSize: 9 },
    bodyStyles: { fontSize: 9, textColor: [55, 65, 81] },
    alternateRowStyles: { fillColor: [249, 250, 251] },
    styles: { cellPadding: 4, lineColor: [229, 231, 235], lineWidth: 0.3 },
    didParseCell(cellData) {
      if (cellData.column.index === 3 && cellData.section === "body") {
        cellData.cell.styles.textColor = [16, 185, 129];
        cellData.cell.styles.fontStyle = "bold";
      }
    },
  });

  y = (doc as any).lastAutoTable.finalY + 15;

  doc.setTextColor(...DARK);
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  const analysisLines = doc.splitTextToSize(data.habilidadesAnalise, pageWidth - 48);
  doc.text(analysisLines, 24, y);

  drawFooter(doc, 2);

  // === P\u00C1GINA 4: Recomenda\u00E7\u00F5es ===
  doc.addPage();
  y = drawHeader(doc, "Recomenda\u00E7\u00F5es", `Sugest\u00F5es para melhoria \u2014 ${data.periodo.label}`);

  y = drawSectionTitle(doc, "A\u00E7\u00F5es Recomendadas", y);

  data.recomendacoes.forEach((rec, i) => {
    if (y > 240) {
      drawFooter(doc, doc.getNumberOfPages() - 1);
      doc.addPage();
      y = drawHeader(doc, "Recomenda\u00E7\u00F5es (cont.)", "");
    }

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

  drawFooter(doc, doc.getNumberOfPages() - 1);

  doc.save(`LabIA_Relatorio_Desempenho_Geral_${sanitizeFilename(data.periodo.label)}.pdf`);
}

// ============================================================
// RELAT\u00D3RIO 2: Progresso por Escola
// ============================================================
export function exportProgressoEscolasPDF(data: ReportDataSet) {
  const doc = new jsPDF("p", "mm", "a4");
  const pageWidth = doc.internal.pageSize.getWidth();
  let y: number;

  // === CAPA ===
  drawCover(
    doc,
    "Progresso",
    "por Escola",
    "Comparativo detalhado entre escolas parceiras",
    "da plataforma LabIA",
    ORANGE, PURPLE,
    data.periodo.label,
    data.periodo.descricao,
  );

  // === P\u00C1GINA 2: Vis\u00E3o Geral ===
  doc.addPage();
  y = drawHeader(doc, "Vis\u00E3o Geral das Escolas", `Comparativo de desempenho \u2014 ${data.periodo.label}`);

  drawMetricCard(doc, 20, y, 40, "Escolas Parceiras", data.escolasResumo.totalEscolas, "");
  drawMetricCard(doc, 64, y, 40, "Total de Alunos", data.escolasResumo.totalAlunos, data.escolasResumo.alunosDelta);
  drawMetricCard(doc, 108, y, 40, "Progresso M\u00E9dio", data.escolasResumo.progressoMedio, data.escolasResumo.progressoDelta);
  drawMetricCard(doc, 152, y, 40, "Engajamento M\u00E9dio", data.escolasResumo.engajamentoMedio, data.escolasResumo.engajamentoDelta);
  y += 45;

  y = drawSectionTitle(doc, "Comparativo Detalhado", y);

  autoTable(doc, {
    startY: y,
    margin: { left: 24, right: 24 },
    head: [["Escola", "Alunos", "Progresso (%)", "Engajamento (%)", "Miss\u00F5es/Aluno", "Ranking"]],
    body: data.escolasTabela,
    headStyles: { fillColor: [249, 115, 22], textColor: [255, 255, 255], fontStyle: "bold", fontSize: 9 },
    bodyStyles: { fontSize: 9, textColor: [55, 65, 81] },
    alternateRowStyles: { fillColor: [255, 247, 237] },
    styles: { cellPadding: 4, lineColor: [229, 231, 235], lineWidth: 0.3 },
    didParseCell(cellData) {
      if (cellData.column.index === 5 && cellData.section === "body") {
        const rank = cellData.cell.raw as string;
        if (rank === "1\u00BA") {
          cellData.cell.styles.textColor = [16, 185, 129];
          cellData.cell.styles.fontStyle = "bold";
        }
      }
    },
  });

  y = (doc as any).lastAutoTable.finalY + 15;

  y = drawSectionTitle(doc, "An\u00E1lise Comparativa", y);
  doc.setTextColor(...DARK);
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  const schoolAnalysis = `No per\u00EDodo de ${data.periodo.descricao}, o Instituto Tech lidera o ranking com ${data.escolasDetalhamento[0].progresso}% de progresso e ${data.escolasDetalhamento[0].engajamento}% de engajamento. A Escola Nova Era, com o maior n\u00FAmero de alunos (${data.escolasDetalhamento[1].alunos}), mant\u00E9m bom desempenho. O Col\u00E9gio Inova\u00E7\u00E3o apresenta os menores \u00EDndices e requer aten\u00E7\u00E3o especial com plano de a\u00E7\u00E3o dedicado.`;
  const schoolLines = doc.splitTextToSize(schoolAnalysis, pageWidth - 48);
  doc.text(schoolLines, 24, y);

  drawFooter(doc, 1);

  // === P\u00C1GINA 3: Detalhamento ===
  doc.addPage();
  y = drawHeader(doc, "Detalhamento por Escola", `An\u00E1lise individual \u2014 ${data.periodo.label}`);

  data.escolasDetalhamento.forEach((escola, i) => {
    if (y > 230) {
      drawFooter(doc, doc.getNumberOfPages() - 1);
      doc.addPage();
      y = drawHeader(doc, "Detalhamento por Escola (cont.)", "");
    }

    doc.setFillColor(...LIGHT_GRAY);
    doc.roundedRect(24, y, pageWidth - 48, 48, 3, 3, "F");

    doc.setFillColor(i === 0 ? 16 : i < 3 ? 124 : 156, i === 0 ? 185 : i < 3 ? 58 : 163, i === 0 ? 129 : i < 3 ? 237 : 175);
    doc.roundedRect(28, y + 4, 18, 14, 2, 2, "F");
    doc.setTextColor(...WHITE);
    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.text(`${i + 1}\u00BA`, 37, y + 13, { align: "center" });

    doc.setTextColor(...DARK);
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text(escola.nome, 50, y + 13);

    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...GRAY);
    doc.text(`${escola.alunos} alunos  |  Progresso: ${escola.progresso}%  |  Engajamento: ${escola.engajamento}%`, 50, y + 22);

    doc.setTextColor(16, 185, 129);
    doc.setFontSize(7);
    doc.setFont("helvetica", "bold");
    doc.text("Destaques: ", 28, y + 33);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...DARK);
    const destLines = doc.splitTextToSize(escola.destaques, pageWidth - 80);
    doc.text(destLines, 52, y + 33);

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

  doc.save(`LabIA_Progresso_por_Escola_${sanitizeFilename(data.periodo.label)}.pdf`);
}

// ============================================================
// RELAT\u00D3RIO 3: Engajamento Mensal
// ============================================================
export function exportEngajamentoMensalPDF(data: ReportDataSet) {
  const doc = new jsPDF("p", "mm", "a4");
  const pageWidth = doc.internal.pageSize.getWidth();
  let y: number;

  const GREEN: readonly [number, number, number] = [16, 185, 129];

  // === CAPA ===
  drawCover(
    doc,
    "Engajamento",
    "Mensal",
    "An\u00E1lise detalhada do engajamento dos alunos",
    "ao longo do per\u00EDodo",
    GREEN, PURPLE,
    data.periodo.label,
    data.periodo.descricao,
  );

  // === P\u00C1GINA 2 ===
  doc.addPage();
  y = drawHeader(doc, "M\u00E9tricas de Engajamento", `Indicadores de participa\u00E7\u00E3o \u2014 ${data.periodo.label}`);

  drawMetricCard(doc, 20, y, 40, "Sess\u00F5es Totais", data.engajamentoResumo.sessoesTotais, data.engajamentoResumo.sessoesDelta);
  drawMetricCard(doc, 64, y, 40, "Tempo M\u00E9dio/Sess\u00E3o", data.engajamentoResumo.tempoMedio, data.engajamentoResumo.tempoDelta);
  drawMetricCard(doc, 108, y, 40, "Taxa de Retorno", data.engajamentoResumo.taxaRetorno, data.engajamentoResumo.retornoDelta);
  drawMetricCard(doc, 152, y, 40, "NPS", data.engajamentoResumo.nps, data.engajamentoResumo.npsDelta);
  y += 45;

  y = drawSectionTitle(doc, "Engajamento por Per\u00EDodo", y);

  autoTable(doc, {
    startY: y,
    margin: { left: 24, right: 24 },
    head: [["Per\u00EDodo", "Sess\u00F5es", "Tempo M\u00E9dio", "Taxa Retorno", "Miss\u00F5es/Dia", "Chat IA (msgs)", "Engajamento"]],
    body: data.engajamentoTabela,
    headStyles: { fillColor: [16, 185, 129], textColor: [255, 255, 255], fontStyle: "bold", fontSize: 8 },
    bodyStyles: { fontSize: 8, textColor: [55, 65, 81] },
    alternateRowStyles: { fillColor: [236, 253, 245] },
    styles: { cellPadding: 3, lineColor: [229, 231, 235], lineWidth: 0.3 },
  });

  y = (doc as any).lastAutoTable.finalY + 15;

  y = drawSectionTitle(doc, "Insights e Tend\u00EAncias", y);
  doc.setTextColor(...DARK);
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  const engajLines = doc.splitTextToSize(data.engajamentoAnalise, pageWidth - 48);
  doc.text(engajLines, 24, y);

  drawFooter(doc, 1);

  doc.save(`LabIA_Engajamento_${sanitizeFilename(data.periodo.label)}.pdf`);
}

// ============================================================
// RELAT\u00D3RIO 4: An\u00E1lise de Trilhas
// ============================================================
export function exportAnaliseTrilhasPDF(data: ReportDataSet) {
  const doc = new jsPDF("p", "mm", "a4");
  const pageWidth = doc.internal.pageSize.getWidth();
  let y: number;

  const BLUE: readonly [number, number, number] = [59, 130, 246];

  // === CAPA ===
  drawCover(
    doc,
    "An\u00E1lise de",
    "Trilhas",
    "Desempenho detalhado por trilha e miss\u00E3o",
    "",
    BLUE, ORANGE,
    data.periodo.label,
    data.periodo.descricao,
  );

  // === P\u00C1GINA 2 ===
  doc.addPage();
  y = drawHeader(doc, "Desempenho por Trilha", `Taxa de conclus\u00E3o e engajamento \u2014 ${data.periodo.label}`);

  y = drawSectionTitle(doc, "Vis\u00E3o Geral das Trilhas", y);

  autoTable(doc, {
    startY: y,
    margin: { left: 24, right: 24 },
    head: [["Trilha", "Miss\u00F5es", "Alunos Inscritos", "Taxa Conclus\u00E3o", "Nota M\u00E9dia", "Tempo M\u00E9dio"]],
    body: data.trilhasTabela,
    headStyles: { fillColor: [59, 130, 246], textColor: [255, 255, 255], fontStyle: "bold", fontSize: 9 },
    bodyStyles: { fontSize: 9, textColor: [55, 65, 81] },
    alternateRowStyles: { fillColor: [239, 246, 255] },
    styles: { cellPadding: 4, lineColor: [229, 231, 235], lineWidth: 0.3 },
  });

  y = (doc as any).lastAutoTable.finalY + 15;

  y = drawSectionTitle(doc, "An\u00E1lise por Trilha", y);
  doc.setTextColor(...DARK);
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  const trilhaLines = doc.splitTextToSize(data.trilhasAnalise, pageWidth - 48);
  doc.text(trilhaLines, 24, y);

  drawFooter(doc, 1);

  doc.save(`LabIA_Analise_Trilhas_${sanitizeFilename(data.periodo.label)}.pdf`);
}
