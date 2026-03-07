/*
 * Dashboard Principal — Corporate Dashboard Minimal
 * Métricas, gráficos, atividades recentes, trilhas populares
 */
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Users, GraduationCap, Target, TrendingUp, ArrowUpRight, ArrowDownRight,
  School, Clock, Star, ChevronRight, Rocket, BookOpen
} from "lucide-react";
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from "recharts";
import { motion } from "framer-motion";

const HERO_BANNER = "https://d2xsxph8kpxj0f.cloudfront.net/310519663095527403/hvRHdmvAcSqkg2m8mRx5q8/admin-hero-banner-D797s63TemrxiRmYLJtzA6.webp";

// Mock data
const engagementData = [
  { name: "Seg", alunos: 120, missoes: 85 },
  { name: "Ter", alunos: 145, missoes: 102 },
  { name: "Qua", alunos: 132, missoes: 91 },
  { name: "Qui", alunos: 168, missoes: 124 },
  { name: "Sex", alunos: 155, missoes: 110 },
  { name: "Sáb", alunos: 78, missoes: 52 },
  { name: "Dom", alunos: 65, missoes: 38 },
];

const trilhasData = [
  { name: "Entendendo a IA", value: 42, color: "#7C3AED" },
  { name: "Criando Prompts", value: 28, color: "#F97316" },
  { name: "Criando Soluções", value: 18, color: "#10B981" },
  { name: "Meu Primeiro App", value: 12, color: "#3B82F6" },
];

const progressoMensal = [
  { mes: "Set", concluidas: 320 },
  { mes: "Out", concluidas: 480 },
  { mes: "Nov", concluidas: 620 },
  { mes: "Dez", concluidas: 540 },
  { mes: "Jan", concluidas: 750 },
  { mes: "Fev", concluidas: 890 },
  { mes: "Mar", concluidas: 1020 },
];

const recentActivities = [
  { user: "Maria Silva", action: "completou a missão", target: "O que é IA?", time: "2 min", avatar: "MS", color: "bg-labia-green" },
  { user: "João Santos", action: "iniciou a trilha", target: "Criando Prompts", time: "5 min", avatar: "JS", color: "bg-labia-purple" },
  { user: "Ana Costa", action: "subiu para nível", target: "Explorador", time: "12 min", avatar: "AC", color: "bg-labia-orange" },
  { user: "Pedro Lima", action: "completou a missão", target: "Estruture um prompt", time: "18 min", avatar: "PL", color: "bg-labia-blue" },
  { user: "Escola Nova Era", action: "cadastrou", target: "32 novos alunos", time: "1h", avatar: "EN", color: "bg-labia-pink" },
];

const topEscolas = [
  { nome: "Escola Nova Era", alunos: 245, progresso: 78 },
  { nome: "Colégio Futuro", alunos: 189, progresso: 65 },
  { nome: "Instituto Tech", alunos: 156, progresso: 82 },
  { nome: "Escola Criativa", alunos: 134, progresso: 71 },
];

const metrics = [
  { label: "Total de Alunos", value: "1.247", change: "+12%", up: true, icon: Users, color: "text-labia-purple", bg: "bg-labia-purple/10" },
  { label: "Missões Concluídas", value: "8.432", change: "+23%", up: true, icon: Target, color: "text-labia-orange", bg: "bg-labia-orange/10" },
  { label: "Escolas Ativas", value: "18", change: "+2", up: true, icon: School, color: "text-labia-green", bg: "bg-labia-green/10" },
  { label: "Taxa de Engajamento", value: "73%", change: "-2%", up: false, icon: TrendingUp, color: "text-labia-blue", bg: "bg-labia-blue/10" },
];

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.06 } }
};
const item = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35 } }
};

export default function Home() {
  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
      {/* Hero Banner */}
      <motion.div variants={item} className="relative rounded-xl overflow-hidden h-40 lg:h-48">
        <img src={HERO_BANNER} alt="" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
        <div className="relative h-full flex flex-col justify-center px-6 lg:px-8">
          <div className="flex items-center gap-2 mb-2">
            <Rocket className="w-5 h-5 text-labia-orange" />
            <span className="text-white/70 text-sm font-medium">Painel Administrativo</span>
          </div>
          <h1 className="font-display font-bold text-2xl lg:text-3xl text-white">
            Bem-vinda, Fabíola!
          </h1>
          <p className="text-white/70 text-sm mt-1 max-w-lg">
            Acompanhe o progresso dos alunos, gerencie trilhas e missões, e monitore o desempenho das escolas.
          </p>
        </div>
      </motion.div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((m) => (
          <motion.div key={m.label} variants={item}>
            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground font-medium">{m.label}</p>
                    <p className="text-2xl font-bold mt-1 tracking-tight">{m.value}</p>
                  </div>
                  <div className={`p-2.5 rounded-xl ${m.bg}`}>
                    <m.icon className={`w-5 h-5 ${m.color}`} />
                  </div>
                </div>
                <div className="flex items-center gap-1 mt-3">
                  {m.up ? (
                    <ArrowUpRight className="w-3.5 h-3.5 text-labia-green" />
                  ) : (
                    <ArrowDownRight className="w-3.5 h-3.5 text-destructive" />
                  )}
                  <span className={`text-xs font-semibold ${m.up ? "text-labia-green" : "text-destructive"}`}>
                    {m.change}
                  </span>
                  <span className="text-xs text-muted-foreground">vs. mês anterior</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Engagement Chart */}
        <motion.div variants={item} className="lg:col-span-2">
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-semibold">Engajamento Semanal</CardTitle>
                <Badge variant="secondary" className="text-xs">Esta semana</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={260}>
                <AreaChart data={engagementData}>
                  <defs>
                    <linearGradient id="gradAlunos" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#7C3AED" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#7C3AED" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="gradMissoes" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#F97316" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#F97316" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} stroke="#9ca3af" />
                  <YAxis tick={{ fontSize: 12 }} stroke="#9ca3af" />
                  <Tooltip
                    contentStyle={{ borderRadius: "8px", border: "1px solid #e5e7eb", fontSize: "13px" }}
                  />
                  <Area type="monotone" dataKey="alunos" stroke="#7C3AED" fill="url(#gradAlunos)" strokeWidth={2} name="Alunos ativos" />
                  <Area type="monotone" dataKey="missoes" stroke="#F97316" fill="url(#gradMissoes)" strokeWidth={2} name="Missões concluídas" />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        {/* Trilhas Distribution */}
        <motion.div variants={item}>
          <Card className="h-full">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-semibold">Distribuição por Trilha</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={180}>
                <PieChart>
                  <Pie
                    data={trilhasData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={75}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {trilhasData.map((entry, index) => (
                      <Cell key={index} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: "8px", border: "1px solid #e5e7eb", fontSize: "13px" }} />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-2 mt-2">
                {trilhasData.map((t) => (
                  <div key={t.name} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: t.color }} />
                      <span className="text-muted-foreground">{t.name}</span>
                    </div>
                    <span className="font-semibold">{t.value}%</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Monthly Progress */}
        <motion.div variants={item}>
          <Card className="h-full">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-semibold">Missões Concluídas (Mensal)</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={progressoMensal}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                  <XAxis dataKey="mes" tick={{ fontSize: 12 }} stroke="#9ca3af" />
                  <YAxis tick={{ fontSize: 12 }} stroke="#9ca3af" />
                  <Tooltip contentStyle={{ borderRadius: "8px", border: "1px solid #e5e7eb", fontSize: "13px" }} />
                  <Bar dataKey="concluidas" fill="#7C3AED" radius={[4, 4, 0, 0]} name="Concluídas" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        {/* Recent Activity */}
        <motion.div variants={item}>
          <Card className="h-full">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-semibold">Atividade Recente</CardTitle>
                <Button variant="ghost" size="sm" className="text-xs h-7">
                  Ver tudo <ChevronRight className="w-3 h-3 ml-1" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivities.map((a, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className={`w-8 h-8 rounded-full ${a.color} flex items-center justify-center text-white text-[10px] font-bold shrink-0`}>
                      {a.avatar}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm leading-snug">
                        <span className="font-semibold">{a.user}</span>{" "}
                        <span className="text-muted-foreground">{a.action}</span>{" "}
                        <span className="font-medium text-primary">{a.target}</span>
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {a.time} atrás
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Top Schools */}
        <motion.div variants={item}>
          <Card className="h-full">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-semibold">Top Escolas</CardTitle>
                <Button variant="ghost" size="sm" className="text-xs h-7">
                  Ver todas <ChevronRight className="w-3 h-3 ml-1" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topEscolas.map((e, i) => (
                  <div key={i} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-muted flex items-center justify-center">
                          <School className="w-3.5 h-3.5 text-muted-foreground" />
                        </div>
                        <div>
                          <p className="text-sm font-medium leading-tight">{e.nome}</p>
                          <p className="text-[11px] text-muted-foreground">{e.alunos} alunos</p>
                        </div>
                      </div>
                      <span className="text-sm font-semibold text-primary">{e.progresso}%</span>
                    </div>
                    <Progress value={e.progresso} className="h-1.5" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
}
