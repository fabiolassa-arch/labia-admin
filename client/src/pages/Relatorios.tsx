/*
 * Relatórios — Gráficos de desempenho, engajamento e exportação PDF
 * Design: Cards com métricas, gráficos Recharts, botões de download PDF
 * O filtro de período (7d, 30d, 90d, 1a) controla tanto os gráficos quanto os PDFs
 */
import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from "@/components/ui/select";
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, RadarChart, Radar,
  PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from "recharts";
import {
  Download, FileText, Calendar, TrendingUp, Users, Target,
  Loader2, FileDown, BarChart3, School, BookOpen, CheckCircle2
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
import { getReportData, type PeriodoKey, type ReportDataSet } from "@/lib/reportData";

const PERIODO_OPTIONS: { value: PeriodoKey; label: string }[] = [
  { value: "7d", label: "Últimos 7 dias" },
  { value: "30d", label: "Últimos 30 dias" },
  { value: "90d", label: "Últimos 90 dias" },
  { value: "1a", label: "Último ano" },
];

interface ReportItem {
  id: string;
  nome: string;
  descricao: string;
  tipo: "PDF";
  icon: typeof FileText;
  iconColor: string;
  iconBg: string;
  exportFn: (data: ReportDataSet) => void;
}

export default function Relatorios() {
  const { user, hasPermission } = useAuth();
  const { addLog } = useAudit();
  const [exportingId, setExportingId] = useState<string | null>(null);
  const [periodo, setPeriodo] = useState<PeriodoKey>("7d");
  const canExport = hasPermission("relatorios.export");

  // Dados reativos ao período selecionado
  const data = useMemo(() => getReportData(periodo), [periodo]);

  const handleExport = async (report: ReportItem) => {
    if (!canExport) {
      toast.error("Você não tem permissão para exportar relatórios.");
      return;
    }

    setExportingId(report.id);

    try {
      await new Promise((r) => setTimeout(r, 600));
      report.exportFn(data);

      if (user) {
        addLog({
          action: "relatorio.exportar",
          category: "relatorios",
          severity: "info",
          userId: user.id,
          userName: user.nome,
          userRole: user.role,
          description: `Relatório exportado: ${report.nome} (${data.periodo.label})`,
          details: {
            "Formato": "PDF",
            "Relatório": report.nome,
            "Período": data.periodo.label,
            "Intervalo": data.periodo.descricao,
            "Data de exportação": new Date().toLocaleString("pt-BR"),
          },
        });
      }

      toast.success(`${report.nome} exportado com sucesso!`, {
        description: `Período: ${data.periodo.label} (${data.periodo.descricao})`,
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
      tipo: "PDF",
      icon: BarChart3,
      iconColor: "text-[#7C3AED]",
      iconBg: "bg-[#7C3AED]/10",
      exportFn: exportDesempenhoGeralPDF,
    },
    {
      id: "escolas",
      nome: "Progresso por Escola",
      descricao: "Comparativo detalhado entre escolas parceiras com ranking, métricas e análise individual",
      tipo: "PDF",
      icon: School,
      iconColor: "text-[#F97316]",
      iconBg: "bg-[#F97316]/10",
      exportFn: exportProgressoEscolasPDF,
    },
    {
      id: "engajamento",
      nome: "Engajamento Mensal",
      descricao: "Sessões, tempo médio, taxa de retorno, uso do Chat IA e tendências de engajamento",
      tipo: "PDF",
      icon: TrendingUp,
      iconColor: "text-emerald-600",
      iconBg: "bg-emerald-50",
      exportFn: exportEngajamentoMensalPDF,
    },
    {
      id: "trilhas",
      nome: "Análise de Trilhas",
      descricao: "Desempenho por trilha e missão com taxas de conclusão, notas médias e tempo de estudo",
      tipo: "PDF",
      icon: BookOpen,
      iconColor: "text-blue-600",
      iconBg: "bg-blue-50",
      exportFn: exportAnaliseTrilhasPDF,
    },
  ];

  const handleExportAll = async () => {
    if (!canExport) {
      toast.error("Você não tem permissão para exportar relatórios.");
      return;
    }

    setExportingId("all");
    try {
      await new Promise((r) => setTimeout(r, 400));
      exportDesempenhoGeralPDF(data);
      await new Promise((r) => setTimeout(r, 300));
      exportProgressoEscolasPDF(data);
      await new Promise((r) => setTimeout(r, 300));
      exportEngajamentoMensalPDF(data);
      await new Promise((r) => setTimeout(r, 300));
      exportAnaliseTrilhasPDF(data);

      if (user) {
        addLog({
          action: "relatorio.exportar",
          category: "relatorios",
          severity: "info",
          userId: user.id,
          userName: user.nome,
          userRole: user.role,
          description: `Exportação em lote: todos os relatórios (${data.periodo.label})`,
          details: {
            "Formato": "PDF",
            "Quantidade": "4 relatórios",
            "Período": data.periodo.label,
            "Intervalo": data.periodo.descricao,
            "Data de exportação": new Date().toLocaleString("pt-BR"),
          },
        });
      }

      toast.success("Todos os relatórios foram exportados!", {
        description: `Período: ${data.periodo.label} — 4 arquivos PDF baixados.`,
      });
    } catch (err) {
      toast.error("Erro ao exportar relatórios.");
    } finally {
      setExportingId(null);
    }
  };

  // Período label para exibição
  const periodoLabel = PERIODO_OPTIONS.find(p => p.value === periodo)?.label ?? "";

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
            <Button
              className="bg-[#7C3AED] hover:bg-[#6D28D9] text-white"
              onClick={handleExportAll}
              disabled={!!exportingId}
            >
              {exportingId === "all" ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Download className="w-4 h-4 mr-2" />
              )}
              Exportar Todos
            </Button>
          )}
        </div>
      </div>

      {/* Period indicator */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/50 rounded-lg px-4 py-2.5 border border-border/50">
        <Calendar className="w-4 h-4 text-[#7C3AED]" />
        <span>Exibindo dados de <strong className="text-foreground">{periodoLabel}</strong></span>
        <span className="text-xs">({data.periodo.descricao})</span>
        <span className="ml-auto text-xs">Gráficos e PDFs refletem este período</span>
      </div>

      {/* Export Cards */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base flex items-center gap-2">
              <FileDown className="w-4 h-4 text-[#7C3AED]" />
              Exportar Relatórios em PDF
            </CardTitle>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-[#7C3AED] border-[#7C3AED]/20 bg-[#7C3AED]/5 text-xs">
                {periodoLabel}
              </Badge>
              {!canExport && (
                <Badge variant="outline" className="text-amber-600 border-amber-200 bg-amber-50 text-xs">
                  Sem permissão de exportação
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
                <motion.div
                  key={r.id}
                  whileHover={canExport ? { scale: 1.01 } : {}}
                  whileTap={canExport ? { scale: 0.99 } : {}}
                  className={`flex items-start gap-3 p-4 rounded-xl border transition-all ${
                    canExport
                      ? "hover:border-[#7C3AED]/30 hover:bg-[#7C3AED]/[0.02] cursor-pointer"
                      : "opacity-60 cursor-not-allowed"
                  } ${isExporting ? "border-[#7C3AED]/40 bg-[#7C3AED]/[0.04]" : ""}`}
                  onClick={() => !isExporting && canExport && handleExport(r)}
                >
                  <div className={`w-10 h-10 rounded-lg ${r.iconBg} flex items-center justify-center shrink-0`}>
                    {isExporting ? (
                      <Loader2 className={`w-5 h-5 ${r.iconColor} animate-spin`} />
                    ) : (
                      <Icon className={`w-5 h-5 ${r.iconColor}`} />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold truncate">{r.nome}</p>
                      <Badge variant="secondary" className="text-[10px] px-1.5 py-0 h-4 shrink-0">{r.tipo}</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{r.descricao}</p>
                    {isExporting && (
                      <p className="text-xs text-[#7C3AED] mt-1 font-medium">Gerando PDF ({periodoLabel})...</p>
                    )}
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="shrink-0 h-8 w-8 p-0"
                    disabled={!canExport || !!exportingId}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleExport(r);
                    }}
                  >
                    {isExporting ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Download className="w-4 h-4" />
                    )}
                  </Button>
                </motion.div>
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
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Desempenho — {periodoLabel}</CardTitle>
            </div>
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
                <p className="text-xs text-muted-foreground mt-0.5">Todos os PDFs refletem este período</p>
              </div>

              <div className="space-y-2">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Conteúdo dos relatórios</p>
                {[
                  { label: "Desempenho Geral", pages: "4 páginas", color: "bg-[#7C3AED]" },
                  { label: "Progresso por Escola", pages: "3 páginas", color: "bg-[#F97316]" },
                  { label: "Engajamento", pages: "2 páginas", color: "bg-emerald-500" },
                  { label: "Análise de Trilhas", pages: "2 páginas", color: "bg-blue-500" },
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${item.color}`} />
                      <span className="text-muted-foreground">{item.label}</span>
                    </div>
                    <span className="text-xs text-muted-foreground">{item.pages}</span>
                  </div>
                ))}
              </div>

              <div className="pt-2 border-t">
                <p className="text-xs text-muted-foreground">
                  Cada relatório inclui capa com período, tabelas detalhadas, análises e recomendações.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
}
