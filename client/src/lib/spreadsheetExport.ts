/*
 * Exportação de relatórios em Excel (XLSX) e CSV
 * Usa a biblioteca SheetJS (xlsx) para gerar planilhas profissionais
 * com múltiplas abas, formatação e dados dinâmicos por período.
 */
import * as XLSX from "xlsx";
import type { ReportDataSet } from "./reportData";

/* ── helpers ─────────────────────────────────────────────────── */

function sanitize(name: string): string {
  return name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9_\- ]/g, "")
    .replace(/\s+/g, "_");
}

function colWidths(data: string[][]): { wch: number }[] {
  if (!data.length) return [];
  const cols = data[0].length;
  const widths: number[] = new Array(cols).fill(10);
  for (const row of data) {
    for (let i = 0; i < cols; i++) {
      const len = String(row[i] ?? "").length;
      if (len > widths[i]) widths[i] = len;
    }
  }
  return widths.map((w) => ({ wch: Math.min(w + 4, 50) }));
}

function addSheet(
  wb: XLSX.WorkBook,
  name: string,
  headers: string[],
  rows: string[][],
  title?: string,
  subtitle?: string,
) {
  const sheetData: string[][] = [];

  if (title) {
    sheetData.push([title]);
    if (subtitle) sheetData.push([subtitle]);
    sheetData.push([]); // blank row
  }

  sheetData.push(headers);
  sheetData.push(...rows);

  const ws = XLSX.utils.aoa_to_sheet(sheetData);
  ws["!cols"] = colWidths(sheetData);

  XLSX.utils.book_append_sheet(wb, ws, name.substring(0, 31));
}

/* ── Desempenho Geral ────────────────────────────────────────── */

export function exportDesempenhoGeralXLSX(data: ReportDataSet) {
  const wb = XLSX.utils.book_new();
  const { periodo, resumo } = data;

  // Aba 1 — Resumo Executivo
  addSheet(
    wb,
    "Resumo Executivo",
    ["Indicador", "Valor", "Variação"],
    [
      ["Total de Alunos", resumo.totalAlunos, resumo.totalAlunosDelta],
      ["Missões Concluídas", resumo.missoesConc, resumo.missoesDelta],
      ["Taxa de Engajamento", resumo.taxaEngajamento, resumo.engajamentoDelta],
      ["Escolas Parceiras", resumo.escolasParceiras, resumo.escolasDelta],
    ],
    `Relatório de Desempenho Geral — ${periodo.label}`,
    `Período: ${periodo.descricao} | Gerado em: ${new Date().toLocaleDateString("pt-BR")}`,
  );

  // Aba 2 — Desempenho por Período
  const dHeaders = ["Período", "Novos Alunos", "Missões Concluídas", "Taxa de Engajamento"];
  const dRows = [...data.desempenhoMensalTabela];
  if (data.desempenhoMensalTotal.length) dRows.push(data.desempenhoMensalTotal);
  addSheet(wb, "Desempenho Periodo", dHeaders, dRows, `Desempenho por Período — ${periodo.label}`);

  // Aba 3 — Distribuição por Nível
  addSheet(
    wb,
    "Distribuicao Nivel",
    ["Nível", "Quantidade de Alunos", "Percentual", "Descrição"],
    data.niveis.map((n) => [n.name, String(n.value), n.percentual, n.descricao]),
    `Distribuição por Nível — ${periodo.label}`,
  );

  // Aba 4 — Habilidades
  addSheet(
    wb,
    "Habilidades",
    ["Habilidade", "Média Geral (%)", "Meta (%)", "Status"],
    data.habilidadesTabela,
    `Habilidades Desenvolvidas — ${periodo.label}`,
  );

  // Aba 5 — Recomendações
  addSheet(
    wb,
    "Recomendacoes",
    ["Recomendação", "Descrição"],
    data.recomendacoes.map((r) => [r.title, r.desc]),
    `Recomendações — ${periodo.label}`,
  );

  const filename = `LabIA_Desempenho_Geral_${sanitize(periodo.label)}.xlsx`;
  XLSX.writeFile(wb, filename);
}

export function exportDesempenhoGeralCSV(data: ReportDataSet) {
  const { periodo, resumo } = data;
  const rows: string[][] = [
    ["# Relatório de Desempenho Geral"],
    [`# Período: ${periodo.label} (${periodo.descricao})`],
    [`# Gerado em: ${new Date().toLocaleDateString("pt-BR")}`],
    [],
    ["== RESUMO EXECUTIVO =="],
    ["Indicador", "Valor", "Variação"],
    ["Total de Alunos", resumo.totalAlunos, resumo.totalAlunosDelta],
    ["Missões Concluídas", resumo.missoesConc, resumo.missoesDelta],
    ["Taxa de Engajamento", resumo.taxaEngajamento, resumo.engajamentoDelta],
    ["Escolas Parceiras", resumo.escolasParceiras, resumo.escolasDelta],
    [],
    ["== DESEMPENHO POR PERÍODO =="],
    ["Período", "Novos Alunos", "Missões Concluídas", "Taxa de Engajamento"],
    ...data.desempenhoMensalTabela,
    ...(data.desempenhoMensalTotal.length ? [data.desempenhoMensalTotal] : []),
    [],
    ["== DISTRIBUIÇÃO POR NÍVEL =="],
    ["Nível", "Quantidade", "Percentual", "Descrição"],
    ...data.niveis.map((n) => [n.name, String(n.value), n.percentual, n.descricao]),
    [],
    ["== HABILIDADES =="],
    ["Habilidade", "Média Geral (%)", "Meta (%)", "Status"],
    ...data.habilidadesTabela,
    [],
    ["== RECOMENDAÇÕES =="],
    ["Recomendação", "Descrição"],
    ...data.recomendacoes.map((r) => [r.title, r.desc]),
  ];

  downloadCSV(rows, `LabIA_Desempenho_Geral_${sanitize(periodo.label)}.csv`);
}

/* ── Progresso por Escola ────────────────────────────────────── */

export function exportProgressoEscolasXLSX(data: ReportDataSet) {
  const wb = XLSX.utils.book_new();
  const { periodo, escolasResumo } = data;

  // Aba 1 — Resumo
  addSheet(
    wb,
    "Resumo Escolas",
    ["Indicador", "Valor", "Variação"],
    [
      ["Total de Escolas", escolasResumo.totalEscolas, ""],
      ["Total de Alunos", escolasResumo.totalAlunos, escolasResumo.alunosDelta],
      ["Progresso Médio", escolasResumo.progressoMedio, escolasResumo.progressoDelta],
      ["Engajamento Médio", escolasResumo.engajamentoMedio, escolasResumo.engajamentoDelta],
    ],
    `Progresso por Escola — ${periodo.label}`,
    `Período: ${periodo.descricao} | Gerado em: ${new Date().toLocaleDateString("pt-BR")}`,
  );

  // Aba 2 — Ranking de Escolas
  addSheet(
    wb,
    "Ranking Escolas",
    ["Escola", "Alunos", "Progresso (%)", "Engajamento (%)", "Missões/Aluno", "Ranking"],
    data.escolasTabela,
    `Ranking de Escolas — ${periodo.label}`,
  );

  // Aba 3 — Detalhamento por Escola
  addSheet(
    wb,
    "Detalhamento",
    ["Escola", "Alunos", "Progresso (%)", "Engajamento (%)", "Destaques", "Desafios"],
    data.escolasDetalhamento.map((e) => [
      e.nome,
      String(e.alunos),
      String(e.progresso),
      String(e.engajamento),
      e.destaques,
      e.desafios,
    ]),
    `Detalhamento por Escola — ${periodo.label}`,
  );

  const filename = `LabIA_Progresso_Escolas_${sanitize(periodo.label)}.xlsx`;
  XLSX.writeFile(wb, filename);
}

export function exportProgressoEscolasCSV(data: ReportDataSet) {
  const { periodo, escolasResumo } = data;
  const rows: string[][] = [
    ["# Progresso por Escola"],
    [`# Período: ${periodo.label} (${periodo.descricao})`],
    [`# Gerado em: ${new Date().toLocaleDateString("pt-BR")}`],
    [],
    ["== RESUMO =="],
    ["Indicador", "Valor", "Variação"],
    ["Total de Escolas", escolasResumo.totalEscolas, ""],
    ["Total de Alunos", escolasResumo.totalAlunos, escolasResumo.alunosDelta],
    ["Progresso Médio", escolasResumo.progressoMedio, escolasResumo.progressoDelta],
    ["Engajamento Médio", escolasResumo.engajamentoMedio, escolasResumo.engajamentoDelta],
    [],
    ["== RANKING DE ESCOLAS =="],
    ["Escola", "Alunos", "Progresso (%)", "Engajamento (%)", "Missões/Aluno", "Ranking"],
    ...data.escolasTabela,
    [],
    ["== DETALHAMENTO =="],
    ["Escola", "Alunos", "Progresso (%)", "Engajamento (%)", "Destaques", "Desafios"],
    ...data.escolasDetalhamento.map((e) => [
      e.nome, String(e.alunos), String(e.progresso), String(e.engajamento), e.destaques, e.desafios,
    ]),
  ];

  downloadCSV(rows, `LabIA_Progresso_Escolas_${sanitize(periodo.label)}.csv`);
}

/* ── Engajamento Mensal ──────────────────────────────────────── */

export function exportEngajamentoMensalXLSX(data: ReportDataSet) {
  const wb = XLSX.utils.book_new();
  const { periodo, engajamentoResumo } = data;

  // Aba 1 — Resumo
  addSheet(
    wb,
    "Resumo Engajamento",
    ["Indicador", "Valor", "Variação"],
    [
      ["Sessões Totais", engajamentoResumo.sessoesTotais, engajamentoResumo.sessoesDelta],
      ["Tempo Médio por Sessão", engajamentoResumo.tempoMedio, engajamentoResumo.tempoDelta],
      ["Taxa de Retorno", engajamentoResumo.taxaRetorno, engajamentoResumo.retornoDelta],
      ["NPS", engajamentoResumo.nps, engajamentoResumo.npsDelta],
    ],
    `Engajamento Mensal — ${periodo.label}`,
    `Período: ${periodo.descricao} | Gerado em: ${new Date().toLocaleDateString("pt-BR")}`,
  );

  // Aba 2 — Dados Detalhados
  addSheet(
    wb,
    "Dados Engajamento",
    ["Período", "Sessões", "Tempo Médio", "Taxa de Retorno", "Missões/Dia", "Chat IA", "Engajamento"],
    data.engajamentoTabela,
    `Dados de Engajamento — ${periodo.label}`,
  );

  const filename = `LabIA_Engajamento_Mensal_${sanitize(periodo.label)}.xlsx`;
  XLSX.writeFile(wb, filename);
}

export function exportEngajamentoMensalCSV(data: ReportDataSet) {
  const { periodo, engajamentoResumo } = data;
  const rows: string[][] = [
    ["# Engajamento Mensal"],
    [`# Período: ${periodo.label} (${periodo.descricao})`],
    [`# Gerado em: ${new Date().toLocaleDateString("pt-BR")}`],
    [],
    ["== RESUMO =="],
    ["Indicador", "Valor", "Variação"],
    ["Sessões Totais", engajamentoResumo.sessoesTotais, engajamentoResumo.sessoesDelta],
    ["Tempo Médio por Sessão", engajamentoResumo.tempoMedio, engajamentoResumo.tempoDelta],
    ["Taxa de Retorno", engajamentoResumo.taxaRetorno, engajamentoResumo.retornoDelta],
    ["NPS", engajamentoResumo.nps, engajamentoResumo.npsDelta],
    [],
    ["== DADOS DETALHADOS =="],
    ["Período", "Sessões", "Tempo Médio", "Taxa de Retorno", "Missões/Dia", "Chat IA", "Engajamento"],
    ...data.engajamentoTabela,
  ];

  downloadCSV(rows, `LabIA_Engajamento_Mensal_${sanitize(periodo.label)}.csv`);
}

/* ── Análise de Trilhas ──────────────────────────────────────── */

export function exportAnaliseTrilhasXLSX(data: ReportDataSet) {
  const wb = XLSX.utils.book_new();
  const { periodo } = data;

  addSheet(
    wb,
    "Analise Trilhas",
    ["Trilha", "Missões", "Alunos Inscritos", "Taxa de Conclusão", "Nota Média", "Tempo Médio"],
    data.trilhasTabela,
    `Análise de Trilhas — ${periodo.label}`,
    `Período: ${periodo.descricao} | Gerado em: ${new Date().toLocaleDateString("pt-BR")}`,
  );

  const filename = `LabIA_Analise_Trilhas_${sanitize(periodo.label)}.xlsx`;
  XLSX.writeFile(wb, filename);
}

export function exportAnaliseTrilhasCSV(data: ReportDataSet) {
  const { periodo } = data;
  const rows: string[][] = [
    ["# Análise de Trilhas"],
    [`# Período: ${periodo.label} (${periodo.descricao})`],
    [`# Gerado em: ${new Date().toLocaleDateString("pt-BR")}`],
    [],
    ["Trilha", "Missões", "Alunos Inscritos", "Taxa de Conclusão", "Nota Média", "Tempo Médio"],
    ...data.trilhasTabela,
  ];

  downloadCSV(rows, `LabIA_Analise_Trilhas_${sanitize(periodo.label)}.csv`);
}

/* ── Dados Completos (todas as abas em um único arquivo) ───── */

export function exportDadosCompletosXLSX(data: ReportDataSet) {
  const wb = XLSX.utils.book_new();
  const { periodo, resumo, escolasResumo, engajamentoResumo } = data;

  // Aba 1 — Resumo Geral
  addSheet(
    wb,
    "Resumo Geral",
    ["Indicador", "Valor", "Variação"],
    [
      ["Total de Alunos", resumo.totalAlunos, resumo.totalAlunosDelta],
      ["Missões Concluídas", resumo.missoesConc, resumo.missoesDelta],
      ["Taxa de Engajamento", resumo.taxaEngajamento, resumo.engajamentoDelta],
      ["Escolas Parceiras", resumo.escolasParceiras, resumo.escolasDelta],
      ["Sessões Totais", engajamentoResumo.sessoesTotais, engajamentoResumo.sessoesDelta],
      ["Tempo Médio/Sessão", engajamentoResumo.tempoMedio, engajamentoResumo.tempoDelta],
      ["Taxa de Retorno", engajamentoResumo.taxaRetorno, engajamentoResumo.retornoDelta],
      ["NPS", engajamentoResumo.nps, engajamentoResumo.npsDelta],
    ],
    `LabIA — Dados Completos — ${periodo.label}`,
    `Período: ${periodo.descricao} | Gerado em: ${new Date().toLocaleDateString("pt-BR")}`,
  );

  // Aba 2 — Desempenho
  const dRows = [...data.desempenhoMensalTabela];
  if (data.desempenhoMensalTotal.length) dRows.push(data.desempenhoMensalTotal);
  addSheet(wb, "Desempenho", ["Período", "Novos Alunos", "Missões Concluídas", "Taxa de Engajamento"], dRows);

  // Aba 3 — Escolas
  addSheet(wb, "Escolas", ["Escola", "Alunos", "Progresso (%)", "Engajamento (%)", "Missões/Aluno", "Ranking"], data.escolasTabela);

  // Aba 4 — Níveis
  addSheet(wb, "Niveis", ["Nível", "Quantidade", "Percentual", "Descrição"], data.niveis.map((n) => [n.name, String(n.value), n.percentual, n.descricao]));

  // Aba 5 — Habilidades
  addSheet(wb, "Habilidades", ["Habilidade", "Média Geral (%)", "Meta (%)", "Status"], data.habilidadesTabela);

  // Aba 6 — Engajamento
  addSheet(wb, "Engajamento", ["Período", "Sessões", "Tempo Médio", "Taxa de Retorno", "Missões/Dia", "Chat IA", "Engajamento"], data.engajamentoTabela);

  // Aba 7 — Trilhas
  addSheet(wb, "Trilhas", ["Trilha", "Missões", "Alunos Inscritos", "Taxa de Conclusão", "Nota Média", "Tempo Médio"], data.trilhasTabela);

  const filename = `LabIA_Dados_Completos_${sanitize(periodo.label)}.xlsx`;
  XLSX.writeFile(wb, filename);
}

/* ── CSV helper ──────────────────────────────────────────────── */

function escapeCSV(val: string): string {
  const s = String(val ?? "");
  if (s.includes(",") || s.includes('"') || s.includes("\n")) {
    return `"${s.replace(/"/g, '""')}"`;
  }
  return s;
}

function downloadCSV(rows: string[][], filename: string) {
  const bom = "\uFEFF"; // UTF-8 BOM for Excel compatibility
  const csv = bom + rows.map((row) => row.map(escapeCSV).join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
