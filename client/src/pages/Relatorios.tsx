/*
 * Relatórios — Gráficos de desempenho, engajamento e exportação PDF / Excel / CSV
 * Design: Cards com métricas, gráficos Recharts, botões de download multi-formato
 * O filtro de período (7d, 30d, 90d, 1a) controla tanto os gráficos quanto os exports
 */
import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from "@/components/ui/select";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuTrigger, DropdownMenuSeparator, DropdownMenuLabel
} from "@/components/ui/dropdown-menu";
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, RadarChart, Radar,
  PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from "recharts";
import {
  Download, FileText, Calendar, TrendingUp, Users, Target,
  Loader2, FileDown, BarChart3, School, BookOpen, CheckCircle2,
  FileSpreadsheet, ChevronDown, Table2, File
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { useAudit } from "@/contexts/AuditContext";
import {
  exportDesempenhoGeralPDF,
  exportProgressoEscolasPDF,
  exportEngajamentoMensalPDF,
  exportAnaliseTrilhasPDF,
} from "@/lib/pdfExport";
import {
  exportDesempenhoGeralXLSX, exportDesempenhoGeralCSV,
  exportProgressoEscolasXLSX, exportProgressoEscolasCSV,
  exportEngajamentoMensalXLSX, exportEngajamentoMensalCSV,
  exportAnaliseTrilhasXLSX, exportAnaliseTrilhasCSV,
  exportDadosCompletosXLSX,
} from "@/lib/spreadsheetExport";
import { getReportData, type PeriodoKey, type ReportDataSet } from "@/lib/reportData";

type ExportFormat = "pdf" | "xlsx" | "csv";

const PERIODO_OPTIONS: { value: PeriodoKey; label: string }[] = [
  { value: "7d", label: "Últimos 7 dias" },
  { value: "30d", label: "Últimos 30 dias" },
  { value: "90d", label: "Últimos 90 dias" },
  { value: "1a", label: "Último ano" },
];

const FORMAT_LABELS: Record<ExportFormat, string> = {
  pdf: "PDF",
  xlsx: "Excel",
  csv: "CSV",
};

interface ReportItem {
  id: string;
  nome: string;
  descricao: string;
  icon: typeof FileText;
  iconColor: string;
  iconBg: string;
  exportFns: Record<ExportFormat, (data: ReportDataSet) => void>;
}

export default function Relatorios() {
  const { user, hasPermission } = useAuth();
  const { addLog } = useAudit();
  const [exportingId, setExportingId] = useState<string | null>(null);
  const [periodo, setPeriodo] = useState<PeriodoKey>("7d");
  const canExport = hasPermission("relatorios.export");

  // Dados reativos ao período selecionado
  const data = useMemo(() => getReportData(periodo), [periodo]);

  const doExport = async (reportId: string, reportName: string, format: ExportFormat, fn: (d: ReportDataSet) => void) => {
    if (!canExport) {
      toast.error("Você não tem permissão para exportar relatórios.");
      return;
    }
    setExportingId(reportId);
    try {
      await new Promise((r) => setTimeout(r, 500));
      fn(data);

      if (user) {
        addLog({
          action: "relatorio.exportar",
          category: "relatorios",
          severity: "info",
          userId: user.id,
          userName: user.nome,
          userRole: user.role,
          description: `Relatório exportado: ${reportName} em ${FORMAT_LABELS[format]} (${data.periodo.label})`,
          details: {
            "Formato": FORMAT_LABELS[format],
            "Relatório": reportName,
            "Período": data.periodo.label,
            "Intervalo": data.periodo.descricao,
            "Data de exportação": new Date().toLocaleString("pt-BR"),
          },
        });
      }

      toast.success(`${reportName} exportado com sucesso!`, {
        description: `Formato: ${FORMAT_LABELS[format]} | Período: ${data.periodo.label}`,
      });
    } catch (err) {
      toast.error("Erro ao gerar o relatório. Tente novamente.");
      console.error(err);
    } finally {
      setExportingId(null);
    }
  };

  const relatorios: ReportItem[] = [
    {
      id: "desempenho",
      nome: "Relatório de Desempenho Geral",
      descricao: "Análise completa com métricas, distribuição por nível, habilidades e recomendações",
      icon: BarChart3,
      iconColor: "text-[#7C3AED]",
      iconBg: "bg-[#7C3AED]/10",
      exportFns: {
        pdf: exportDesempenhoGeralPDF,
        xlsx: exportDesempenhoGeralXLSX,
        csv: exportDesempenhoGeralCSV,
      },
    },
    {
      id: "escolas",
      nome: "Progresso por Escola",
      descricao: "Comparativo detalhado entre escolas parceiras com ranking, métricas e análise individual",
      icon: School,
      iconColor: "text-[#F97316]",
      iconBg: "bg-[#F97316]/10",
      exportFns: {
        pdf: exportProgressoEscolasPDF,
        xlsx: exportProgressoEscolasXLSX,
        csv: exportProgressoEscolasCSV,
      },
    },
    {
      id: "engajamento",
      nome: "Engajamento Mensal",
      descricao: "Sessões, tempo médio, taxa de retorno, uso do Chat IA e tendências de engajamento",
      icon: TrendingUp,
      iconColor: "text-emerald-600",
      iconBg: "bg-emerald-50",
      exportFns: {
        pdf: exportEngajamentoMensalPDF,
        xlsx: exportEngajamentoMensalXLSX,
        csv: exportEngajamentoMensalCSV,
      },
    },
    {
      id: "trilhas",
      nome: "Análise de Trilhas",
      descricao: "Desempenho por trilha e missão com taxas de conclusão, notas médias e tempo de estudo",
      icon: BookOpen,
      iconColor: "text-blue-600",
      iconBg: "bg-blue-50",
      exportFns: {
        pdf: exportAnaliseTrilhasPDF,
        xlsx: exportAnaliseTrilhasXLSX,
        csv: exportAnaliseTrilhasCSV,
      },
    },
  ];

  const handleExportAll = async (format: ExportFormat) => {
    if (!canExport) {
      toast.error("Você não tem permissão para exportar relatórios.");
      return;
    }
    setExportingId("all");
    try {
      if (format === "xlsx") {
        // Exportar tudo em um único arquivo Excel com múltiplas abas
        await new Promise((r) => setTimeout(r, 400));
        exportDadosCompletosXLSX(data);
      } else {
        // PDF e CSV: exportar individualmente
        for (const r of relatorios) {
          await new Promise((res) => setTimeout(res, 300));
          r.exportFns[format](data);
        }
      }

      if (user) {
        addLog({
          action: "relatorio.exportar",
          category: "relatorios",
          severity: "info",
          userId: user.id,
          userName: user.nome,
          userRole: user.role,
          description: `Exportação em lote: ${format === "xlsx" ? "Dados Completos" : "todos os relatórios"} em ${FORMAT_LABELS[format]} (${data.periodo.label})`,
          details: {
            "Formato": FORMAT_LABELS[format],
            "Quantidade": format === "xlsx" ? "1 arquivo (7 abas)" : "4 relatórios",
            "Período": data.periodo.label,
            "Intervalo": data.periodo.descricao,
            "Data de exportação": new Date().toLocaleString("pt-BR"),
          },
        });
      }

      toast.success(
        format === "xlsx"
          ? "Dados completos exportados em Excel!"
          : `Todos os relatórios exportados em ${FORMAT_LABELS[format]}!`,
        {
          description: `Período: ${data.periodo.label}${format === "xlsx" ? " — 7 abas em 1 arquivo" : ` — 4 arquivos ${FORMAT_LABELS[format]}`}`,
        },
      );
    } catch (err) {
      toast.error("Erro ao exportar relatórios.");
      console.error(err);
    } finally {
      setExportingId(null);
    }
  };

  const periodoLabel = PERIODO_OPTIONS.find((p) => p.value === periodo)?.label ?? "";

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display font-bold text-2xl">Relatórios</h1>
          <p className="text-muted-foreground text-sm mt-1">Análises de desempenho, engajamento e progresso</p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={periodo} onValueChange={(v) => setPeriodo(v as PeriodoKey)}>
            <SelectTrigger className="h-9 w-44">
              <Calendar className="w-4 h-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {PERIODO_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {canExport && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  className="bg-[#7C3AED] hover:bg-[#6D28D9] text-white"
                  disabled={!!exportingId}
                >
                  {exportingId === "all" ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Download className="w-4 h-4 mr-2" />
                  )}
                  Exportar Todos
                  <ChevronDown className="w-3.5 h-3.5 ml-1" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel className="text-xs text-muted-foreground">Exportar todos os relatórios</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => handleExportAll("pdf")} className="gap-2">
                  <FileText className="w-4 h-4 text-red-500" />
                  <div>
                    <p className="text-sm font-medium">PDF</p>
                    <p className="text-xs text-muted-foreground">4 arquivos individuais</p>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleExportAll("xlsx")} className="gap-2">
                  <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                  <div>
                    <p className="text-sm font-medium">Excel (XLSX)</p>
                    <p className="text-xs text-muted-foreground">1 arquivo com 7 abas</p>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleExportAll("csv")} className="gap-2">
                  <Table2 className="w-4 h-4 text-blue-500" />
                  <div>
                    <p className="text-sm font-medium">CSV</p>
                    <p className="text-xs text-muted-foreground">4 arquivos individuais</p>
                  </div>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>

      {/* Period indicator */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/50 rounded-lg px-4 py-2.5 border border-border/50">
        <Calendar className="w-4 h-4 text-[#7C3AED]" />
        <span>Exibindo dados de <strong className="text-foreground">{periodoLabel}</strong></span>
        <span className="text-xs">({data.periodo.descricao})</span>
        <span className="ml-auto text-xs">Gráficos e exportações refletem este período</span>
      </div>

      {/* Export Cards */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base flex items-center gap-2">
              <FileDown className="w-4 h-4 text-[#7C3AED]" />
              Exportar Relatórios
            </CardTitle>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-[#7C3AED] border-[#7C3AED]/20 bg-[#7C3AED]/5 text-xs">
                {periodoLabel}
              </Badge>
              <div className="flex items-center gap-1">
                <Badge variant="secondary" className="text-[10px] px-1.5 py-0 h-4 bg-red-50 text-red-600 border-red-200">PDF</Badge>
                <Badge variant="secondary" className="text-[10px] px-1.5 py-0 h-4 bg-emerald-50 text-emerald-600 border-emerald-200">XLSX</Badge>
                <Badge variant="secondary" className="text-[10px] px-1.5 py-0 h-4 bg-blue-50 text-blue-600 border-blue-200">CSV</Badge>
              </div>
              {!canExport && (
                <Badge variant="outline" className="text-amber-600 border-amber-200 bg-amber-50 text-xs">
                  Sem permissão
                </Badge>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {relatorios.map((r) => {
              const Icon = r.icon;
              const isExporting = exportingId === r.id;
              return (
                <div
                  key={r.id}
                  className={`flex items-start gap-3 p-4 rounded-xl border transition-all ${
                    isExporting ? "border-[#7C3AED]/40 bg-[#7C3AED]/[0.04]" : ""
                  }`}
                >
                  <div className={`w-10 h-10 rounded-lg ${r.iconBg} flex items-center justify-center shrink-0`}>
                    {isExporting ? (
                      <Loader2 className={`w-5 h-5 ${r.iconColor} animate-spin`} />
                    ) : (
                      <Icon className={`w-5 h-5 ${r.iconColor}`} />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold truncate">{r.nome}</p>
                    <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{r.descricao}</p>
                    {isExporting && (
                      <p className="text-xs text-[#7C3AED] mt-1 font-medium">Gerando arquivo ({periodoLabel})...</p>
                    )}
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-8 px-2 gap-1"
                          disabled={!canExport || !!exportingId}
                        >
                          <Download className="w-3.5 h-3.5" />
                          <ChevronDown className="w-3 h-3" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-44">
                        <DropdownMenuLabel className="text-xs text-muted-foreground">Formato de exportação</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => doExport(r.id, r.nome, "pdf", r.exportFns.pdf)}
                          className="gap-2"
                        >
                          <FileText className="w-4 h-4 text-red-500" />
                          <span className="text-sm">PDF</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => doExport(r.id, r.nome, "xlsx", r.exportFns.xlsx)}
                          className="gap-2"
                        >
                          <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                          <span className="text-sm">Excel (XLSX)</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => doExport(r.id, r.nome, "csv", r.exportFns.csv)}
                          className="gap-2"
                        >
                          <Table2 className="w-4 h-4 text-blue-500" />
                          <span className="text-sm">CSV</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Performance Chart */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Desempenho — {periodoLabel}</CardTitle>
          </CardHeader>
          <CardContent>
            <AnimatePresence mode="wait">
              <motion.div
                key={periodo + "-perf"}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <ResponsiveContainer width="100%" height={280}>
                  <LineChart data={data.desempenhoMensal}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                    <XAxis dataKey="mes" tick={{ fontSize: 12 }} stroke="#9ca3af" />
                    <YAxis tick={{ fontSize: 12 }} stroke="#9ca3af" />
                    <Tooltip contentStyle={{ borderRadius: "8px", border: "1px solid #e5e7eb", fontSize: "13px" }} />
                    <Legend />
                    <Line type="monotone" dataKey="novosAlunos" stroke="#7C3AED" strokeWidth={2} dot={{ r: 4 }} name="Novos Alunos" />
                    <Line type="monotone" dataKey="missoesConc" stroke="#F97316" strokeWidth={2} dot={{ r: 4 }} name="Missões Concluídas" />
                  </LineChart>
                </ResponsiveContainer>
              </motion.div>
            </AnimatePresence>
          </CardContent>
        </Card>

        {/* Schools Comparison */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Comparativo por Escola — {periodoLabel}</CardTitle>
          </CardHeader>
          <CardContent>
            <AnimatePresence mode="wait">
              <motion.div
                key={periodo + "-schools"}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={data.escolas} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" horizontal={false} />
                    <XAxis type="number" tick={{ fontSize: 12 }} stroke="#9ca3af" />
                    <YAxis type="category" dataKey="escola" tick={{ fontSize: 11 }} stroke="#9ca3af" width={80} />
                    <Tooltip contentStyle={{ borderRadius: "8px", border: "1px solid #e5e7eb", fontSize: "13px" }} />
                    <Legend />
                    <Bar dataKey="progresso" fill="#7C3AED" radius={[0, 4, 4, 0]} name="Progresso %" />
                    <Bar dataKey="engajamento" fill="#F97316" radius={[0, 4, 4, 0]} name="Engajamento %" />
                  </BarChart>
                </ResponsiveContainer>
              </motion.div>
            </AnimatePresence>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Level Distribution */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Distribuição por Nível</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={data.niveis} cx="50%" cy="50%" innerRadius={45} outerRadius={75} paddingAngle={3} dataKey="value">
                  {data.niveis.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: "8px", border: "1px solid #e5e7eb", fontSize: "13px" }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-1.5 mt-2">
              {data.niveis.map((n) => (
                <div key={n.name} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: n.color }} />
                    <span className="text-muted-foreground">{n.name}</span>
                  </div>
                  <span className="font-semibold">{n.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Skills Radar */}
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Habilidades Desenvolvidas</CardTitle>
              <div className="flex items-center gap-3 text-xs">
                <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-[#7C3AED]" /> Média geral</div>
                <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-[#F97316]" /> Meta</div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <RadarChart data={data.habilidades}>
                <PolarGrid stroke="#e5e7eb" />
                <PolarAngleAxis dataKey="skill" tick={{ fontSize: 11 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 10 }} />
                <Radar name="Média" dataKey="A" stroke="#7C3AED" fill="#7C3AED" fillOpacity={0.2} />
                <Radar name="Meta" dataKey="B" stroke="#F97316" fill="#F97316" fillOpacity={0.1} />
              </RadarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Export Summary */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Resumo de Exportações</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-[#7C3AED]/5 border border-[#7C3AED]/10">
                <CheckCircle2 className="w-5 h-5 text-[#7C3AED] shrink-0" />
                <div>
                  <p className="text-sm font-medium">4 relatórios disponíveis</p>
                  <p className="text-xs text-muted-foreground">Período: {periodoLabel}</p>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-muted/50 border border-border/50">
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="w-3.5 h-3.5 text-[#7C3AED]" />
                  <p className="text-xs font-medium">Intervalo selecionado</p>
                </div>
                <p className="text-sm font-semibold">{data.periodo.descricao}</p>
                <p className="text-xs text-muted-foreground mt-0.5">Todos os arquivos refletem este período</p>
              </div>

              <div className="space-y-2">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Formatos disponíveis</p>
                {[
                  { label: "PDF", desc: "Relatório visual com capa e tabelas", icon: FileText, color: "text-red-500", bg: "bg-red-50" },
                  { label: "Excel (XLSX)", desc: "Planilha com múltiplas abas", icon: FileSpreadsheet, color: "text-emerald-600", bg: "bg-emerald-50" },
                  { label: "CSV", desc: "Dados tabulares para análise", icon: Table2, color: "text-blue-500", bg: "bg-blue-50" },
                ].map((item) => (
                  <div key={item.label} className="flex items-center gap-2.5 text-sm">
                    <div className={`w-6 h-6 rounded flex items-center justify-center ${item.bg}`}>
                      <item.icon className={`w-3.5 h-3.5 ${item.color}`} />
                    </div>
                    <div>
                      <span className="font-medium text-xs">{item.label}</span>
                      <p className="text-[10px] text-muted-foreground leading-tight">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-2">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Conteúdo</p>
                {[
                  { label: "Desempenho Geral", color: "bg-[#7C3AED]" },
                  { label: "Progresso por Escola", color: "bg-[#F97316]" },
                  { label: "Engajamento", color: "bg-emerald-500" },
                  { label: "Análise de Trilhas", color: "bg-blue-500" },
                ].map((item) => (
                  <div key={item.label} className="flex items-center gap-2 text-sm">
                    <div className={`w-2 h-2 rounded-full ${item.color}`} />
                    <span className="text-muted-foreground text-xs">{item.label}</span>
                  </div>
                ))}
              </div>

              <div className="pt-2 border-t">
                <p className="text-xs text-muted-foreground">
                  Use o dropdown em cada card para escolher o formato ou exporte tudo de uma vez pelo botão acima.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
}
