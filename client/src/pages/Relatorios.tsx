/*
 * Relatórios — Gráficos de desempenho, engajamento e exportação PDF
 * Design: Cards com métricas, gráficos Recharts, botões de download PDF
 */
import { useState } from "react";
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
import { motion } from "framer-motion";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { useAudit } from "@/contexts/AuditContext";
import {
  exportDesempenhoGeralPDF,
  exportProgressoEscolasPDF,
  exportEngajamentoMensalPDF,
  exportAnaliseTrilhasPDF,
} from "@/lib/pdfExport";

const desempenhoMensal = [
  { mes: "Set", novosAlunos: 89, missoesConc: 320, taxaEngaj: 68 },
  { mes: "Out", novosAlunos: 124, missoesConc: 480, taxaEngaj: 72 },
  { mes: "Nov", novosAlunos: 156, missoesConc: 620, taxaEngaj: 75 },
  { mes: "Dez", novosAlunos: 98, missoesConc: 540, taxaEngaj: 70 },
  { mes: "Jan", novosAlunos: 178, missoesConc: 750, taxaEngaj: 78 },
  { mes: "Fev", novosAlunos: 203, missoesConc: 890, taxaEngaj: 76 },
  { mes: "Mar", novosAlunos: 189, missoesConc: 1020, taxaEngaj: 73 },
];

const escolasComparativo = [
  { escola: "Nova Era", alunos: 245, progresso: 78, engajamento: 82 },
  { escola: "C. Futuro", alunos: 189, progresso: 65, engajamento: 71 },
  { escola: "Inst. Tech", alunos: 156, progresso: 82, engajamento: 88 },
  { escola: "E. Criativa", alunos: 134, progresso: 71, engajamento: 75 },
  { escola: "C. Inovação", alunos: 98, progresso: 45, engajamento: 52 },
];

const niveisDistribuicao = [
  { name: "Iniciante", value: 312, color: "#9CA3AF" },
  { name: "Explorador", value: 428, color: "#7C3AED" },
  { name: "Inventor", value: 289, color: "#F97316" },
  { name: "Cientista", value: 156, color: "#10B981" },
  { name: "Mestre", value: 62, color: "#EC4899" },
];

const habilidadesRadar = [
  { skill: "Conceitos IA", A: 85, B: 72 },
  { skill: "Prompts", A: 78, B: 65 },
  { skill: "Pensamento Crítico", A: 72, B: 58 },
  { skill: "Criatividade", A: 88, B: 70 },
  { skill: "Resolução Prob.", A: 65, B: 55 },
  { skill: "Colaboração", A: 80, B: 68 },
];

interface ReportItem {
  id: string;
  nome: string;
  descricao: string;
  tipo: "PDF";
  icon: typeof FileText;
  iconColor: string;
  iconBg: string;
  exportFn: () => void;
}

export default function Relatorios() {
  const { user, hasPermission } = useAuth();
  const { addLog } = useAudit();
  const [exportingId, setExportingId] = useState<string | null>(null);
  const canExport = hasPermission("relatorios.export");

  const handleExport = async (report: ReportItem) => {
    if (!canExport) {
      toast.error("Você não tem permissão para exportar relatórios.");
      return;
    }

    setExportingId(report.id);

    try {
      // Small delay for UX feedback
      await new Promise((r) => setTimeout(r, 600));
      report.exportFn();

      // Log audit
      if (user) {
        addLog({
          action: "relatorio.exportar",
          category: "relatorios",
          severity: "info",
          userId: user.id,
          userName: user.nome,
          userRole: user.role,
          description: `Relatório exportado: ${report.nome}`,
          details: {
            "Formato": "PDF",
            "Relatório": report.nome,
            "Data de exportação": new Date().toLocaleString("pt-BR"),
          },
        });
      }

      toast.success(`${report.nome} exportado com sucesso!`, {
        description: "O arquivo PDF foi baixado para o seu computador.",
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
      descricao: "Análise completa com métricas mensais, distribuição por nível, habilidades e recomendações",
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
      exportDesempenhoGeralPDF();
      await new Promise((r) => setTimeout(r, 300));
      exportProgressoEscolasPDF();
      await new Promise((r) => setTimeout(r, 300));
      exportEngajamentoMensalPDF();
      await new Promise((r) => setTimeout(r, 300));
      exportAnaliseTrilhasPDF();

      if (user) {
        addLog({
          action: "relatorio.exportar",
          category: "relatorios",
          severity: "info",
          userId: user.id,
          userName: user.nome,
          userRole: user.role,
          description: "Exportação em lote: todos os relatórios (4 PDFs)",
          details: {
            "Formato": "PDF",
            "Quantidade": "4 relatórios",
            "Data de exportação": new Date().toLocaleString("pt-BR"),
          },
        });
      }

      toast.success("Todos os relatórios foram exportados!", {
        description: "4 arquivos PDF foram baixados.",
      });
    } catch (err) {
      toast.error("Erro ao exportar relatórios.");
    } finally {
      setExportingId(null);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display font-bold text-2xl">Relatórios</h1>
          <p className="text-muted-foreground text-sm mt-1">Análises de desempenho, engajamento e progresso</p>
        </div>
        <div className="flex items-center gap-2">
          <Select defaultValue="7d">
            <SelectTrigger className="h-9 w-40">
              <Calendar className="w-4 h-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Últimos 7 dias</SelectItem>
              <SelectItem value="30d">Últimos 30 dias</SelectItem>
              <SelectItem value="90d">Últimos 90 dias</SelectItem>
              <SelectItem value="1a">Último ano</SelectItem>
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

      {/* Export Cards */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base flex items-center gap-2">
              <FileDown className="w-4 h-4 text-[#7C3AED]" />
              Exportar Relatórios em PDF
            </CardTitle>
            {!canExport && (
              <Badge variant="outline" className="text-amber-600 border-amber-200 bg-amber-50 text-xs">
                Sem permissão de exportação
              </Badge>
            )}
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
                      <Badge variant="outline" className="text-[10px] px-1.5 py-0 shrink-0">PDF</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{r.descricao}</p>
                    {isExporting && (
                      <p className="text-xs text-[#7C3AED] mt-1 font-medium">Gerando PDF...</p>
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
        {/* Monthly Performance */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Desempenho Mensal</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={desempenhoMensal}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                <XAxis dataKey="mes" tick={{ fontSize: 12 }} stroke="#9ca3af" />
                <YAxis tick={{ fontSize: 12 }} stroke="#9ca3af" />
                <Tooltip contentStyle={{ borderRadius: "8px", border: "1px solid #e5e7eb", fontSize: "13px" }} />
                <Legend />
                <Line type="monotone" dataKey="novosAlunos" stroke="#7C3AED" strokeWidth={2} dot={{ r: 4 }} name="Novos Alunos" />
                <Line type="monotone" dataKey="missoesConc" stroke="#F97316" strokeWidth={2} dot={{ r: 4 }} name="Missões Concluídas" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Schools Comparison */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Comparativo por Escola</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={escolasComparativo} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 12 }} stroke="#9ca3af" />
                <YAxis type="category" dataKey="escola" tick={{ fontSize: 11 }} stroke="#9ca3af" width={80} />
                <Tooltip contentStyle={{ borderRadius: "8px", border: "1px solid #e5e7eb", fontSize: "13px" }} />
                <Legend />
                <Bar dataKey="progresso" fill="#7C3AED" radius={[0, 4, 4, 0]} name="Progresso %" />
                <Bar dataKey="engajamento" fill="#F97316" radius={[0, 4, 4, 0]} name="Engajamento %" />
              </BarChart>
            </ResponsiveContainer>
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
                <Pie data={niveisDistribuicao} cx="50%" cy="50%" innerRadius={45} outerRadius={75} paddingAngle={3} dataKey="value">
                  {niveisDistribuicao.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: "8px", border: "1px solid #e5e7eb", fontSize: "13px" }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-1.5 mt-2">
              {niveisDistribuicao.map((n) => (
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
              <RadarChart data={habilidadesRadar}>
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
                  <p className="text-xs text-muted-foreground">Todos prontos para exportação em PDF</p>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Conteúdo dos relatórios</p>
                {[
                  { label: "Desempenho Geral", pages: "4 páginas", color: "bg-[#7C3AED]" },
                  { label: "Progresso por Escola", pages: "3 páginas", color: "bg-[#F97316]" },
                  { label: "Engajamento Mensal", pages: "2 páginas", color: "bg-emerald-500" },
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
                  Cada relatório inclui capa profissional, tabelas detalhadas, análises e recomendações.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
}
