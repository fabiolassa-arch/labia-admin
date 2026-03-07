/*
 * Relatórios — Gráficos de desempenho, engajamento e exportação
 */
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
import { Download, FileText, Calendar, TrendingUp, Users, Target } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";

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

const relatoriosDisponiveis = [
  { nome: "Relatório de Desempenho Geral", tipo: "PDF", tamanho: "2.4 MB", data: "Mar 2026" },
  { nome: "Progresso por Escola", tipo: "XLSX", tamanho: "1.8 MB", data: "Mar 2026" },
  { nome: "Engajamento Mensal", tipo: "PDF", tamanho: "3.1 MB", data: "Fev 2026" },
  { nome: "Análise de Trilhas", tipo: "PDF", tamanho: "1.5 MB", data: "Fev 2026" },
];

export default function Relatorios() {
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
          <Button variant="outline" onClick={() => toast.success("Relatório exportado!")}>
            <Download className="w-4 h-4 mr-2" /> Exportar
          </Button>
        </div>
      </div>

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

        {/* Available Reports */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Relatórios Disponíveis</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {relatoriosDisponiveis.map((r, i) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-lg border hover:bg-muted/30 transition-colors cursor-pointer"
                  onClick={() => toast.info("Funcionalidade em breve!")}>
                  <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <FileText className="w-4 h-4 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{r.nome}</p>
                    <p className="text-xs text-muted-foreground">{r.tipo} • {r.tamanho} • {r.data}</p>
                  </div>
                  <Download className="w-4 h-4 text-muted-foreground shrink-0" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
}
