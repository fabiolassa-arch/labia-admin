/*
 * Ensino Médio — Dashboard do módulo EM
 * Visão geral: alunos EM, desempenho, ENEM, redações, planos de estudo
 */
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  GraduationCap, BookOpen, PenLine, Target, TrendingUp, Users,
  Trophy, Brain, CalendarDays, ChevronRight, ArrowUpRight, Star, Clock
} from "lucide-react";
import {
  AreaChart, Area, BarChart, Bar, RadarChart, Radar, PolarGrid,
  PolarAngleAxis, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from "recharts";
import { motion } from "framer-motion";

const engagementData = [
  { name: "Seg", alunos: 98, desafios: 72, redacoes: 18 },
  { name: "Ter", alunos: 115, desafios: 89, redacoes: 24 },
  { name: "Qua", alunos: 107, desafios: 81, redacoes: 21 },
  { name: "Qui", alunos: 134, desafios: 103, redacoes: 31 },
  { name: "Sex", alunos: 122, desafios: 95, redacoes: 28 },
  { name: "Sáb", alunos: 56, desafios: 41, redacoes: 12 },
  { name: "Dom", alunos: 43, desafios: 29, redacoes: 8 },
];

const materiaData = [
  { materia: "Matemática", media: 72, meta: 80 },
  { materia: "Português", media: 65, meta: 75 },
  { materia: "Ciências", media: 58, meta: 70 },
  { materia: "Humanas", media: 61, meta: 70 },
  { materia: "Redação", media: 680, meta: 800 },
];

const radarData = [
  { subject: "Matemática", A: 72, fullMark: 100 },
  { subject: "Português", A: 65, fullMark: 100 },
  { subject: "Ciências", A: 58, fullMark: 100 },
  { subject: "Humanas", A: 61, fullMark: 100 },
  { subject: "Redação", A: 68, fullMark: 100 },
  { subject: "Atualidades", A: 54, fullMark: 100 },
];

const topAlunos = [
  { nome: "Lucas Oliveira", escola: "Escola Nova Era", xp: 1240, nivel: 3, streak: 7, redacoes: 3 },
  { nome: "Maria Silva", escola: "Colégio Futuro", xp: 1890, nivel: 4, streak: 14, redacoes: 5 },
  { nome: "Pedro Lima", escola: "Instituto Tech", xp: 2100, nivel: 5, streak: 21, redacoes: 7 },
  { nome: "Ana Costa", escola: "Escola Criativa", xp: 980, nivel: 3, streak: 5, redacoes: 2 },
  { nome: "Rafael Souza", escola: "Escola Nova Era", xp: 1560, nivel: 4, streak: 10, redacoes: 4 },
];

const recentRedacoes = [
  { aluno: "Maria Silva", tema: "Saúde mental entre jovens", nota: 820, status: "corrigida", data: "Hoje" },
  { aluno: "Pedro Lima", tema: "Tecnologia na educação pública", nota: 760, status: "corrigida", data: "Hoje" },
  { aluno: "Lucas Oliveira", tema: "Desigualdade social e cultura", nota: null, status: "pendente", data: "Hoje" },
  { aluno: "Ana Costa", tema: "Saúde mental entre jovens", nota: 680, status: "corrigida", data: "Ontem" },
  { aluno: "Rafael Souza", tema: "Tecnologia na educação pública", nota: null, status: "revisao", data: "Ontem" },
];

const metrics = [
  { label: "Alunos EM", value: "342", change: "+18%", up: true, icon: GraduationCap, color: "text-labia-purple", bg: "bg-labia-purple/10" },
  { label: "Desafios Hoje", value: "410", change: "+31%", up: true, icon: Target, color: "text-labia-orange", bg: "bg-labia-orange/10" },
  { label: "Redações Enviadas", value: "127", change: "+22%", up: true, icon: PenLine, color: "text-labia-pink", bg: "bg-labia-pink/10" },
  { label: "Média ENEM (sim.)", value: "672", change: "+8pts", up: true, icon: Trophy, color: "text-labia-green", bg: "bg-labia-green/10" },
];

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.06 } } };
const item = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0, transition: { duration: 0.35 } } };

const notaColor = (nota: number | null) => {
  if (!nota) return "text-muted-foreground";
  if (nota >= 800) return "text-labia-green font-semibold";
  if (nota >= 600) return "text-labia-orange font-semibold";
  return "text-destructive font-semibold";
};

export default function EnsinoMedio() {
  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
      {/* Header */}
      <motion.div variants={item} className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <GraduationCap className="w-7 h-7 text-labia-purple" />
            Ensino Médio
          </h1>
          <p className="text-muted-foreground text-sm mt-0.5">
            Visão geral do módulo EM — desempenho, redações, desafios e ENEM
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <CalendarDays className="w-4 h-4 mr-2" /> Esta semana
          </Button>
          <Button size="sm" className="bg-labia-purple hover:bg-labia-purple/90">
            <TrendingUp className="w-4 h-4 mr-2" /> Relatório EM
          </Button>
        </div>
      </motion.div>

      {/* Metrics */}
      <motion.div variants={item} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((m) => (
          <Card key={m.label} className="border-0 shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className={`p-2 rounded-lg ${m.bg}`}>
                  <m.icon className={`w-5 h-5 ${m.color}`} />
                </div>
                <span className={`text-xs font-medium flex items-center gap-0.5 ${m.up ? "text-labia-green" : "text-destructive"}`}>
                  <ArrowUpRight className="w-3 h-3" />{m.change}
                </span>
              </div>
              <p className="text-2xl font-bold mt-3">{m.value}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{m.label}</p>
            </CardContent>
          </Card>
        ))}
      </motion.div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Engajamento semanal */}
        <motion.div variants={item} className="lg:col-span-2">
          <Card className="border-0 shadow-sm h-full">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold">Engajamento Semanal — Ensino Médio</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={220}>
                <AreaChart data={engagementData}>
                  <defs>
                    <linearGradient id="colorAlunos" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#7C3AED" stopOpacity={0.15} />
                      <stop offset="95%" stopColor="#7C3AED" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorDesafios" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#F97316" stopOpacity={0.15} />
                      <stop offset="95%" stopColor="#F97316" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorRedacoes" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#EC4899" stopOpacity={0.15} />
                      <stop offset="95%" stopColor="#EC4899" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Legend iconSize={8} wrapperStyle={{ fontSize: 11 }} />
                  <Area type="monotone" dataKey="alunos" name="Alunos ativos" stroke="#7C3AED" strokeWidth={2} fill="url(#colorAlunos)" />
                  <Area type="monotone" dataKey="desafios" name="Desafios feitos" stroke="#F97316" strokeWidth={2} fill="url(#colorDesafios)" />
                  <Area type="monotone" dataKey="redacoes" name="Redações" stroke="#EC4899" strokeWidth={2} fill="url(#colorRedacoes)" />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        {/* Radar por matéria */}
        <motion.div variants={item}>
          <Card className="border-0 shadow-sm h-full">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold">Desempenho por Matéria</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={220}>
                <RadarChart data={radarData}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10 }} />
                  <Radar name="Média" dataKey="A" stroke="#7C3AED" fill="#7C3AED" fillOpacity={0.25} strokeWidth={2} />
                  <Tooltip />
                </RadarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Bottom row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Top alunos EM */}
        <motion.div variants={item}>
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-3 flex flex-row items-center justify-between">
              <CardTitle className="text-sm font-semibold">Top Alunos — Ensino Médio</CardTitle>
              <Button variant="ghost" size="sm" className="text-xs text-labia-purple h-7 px-2">
                Ver todos <ChevronRight className="w-3 h-3 ml-1" />
              </Button>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-border">
                {topAlunos.map((aluno, i) => (
                  <div key={aluno.nome} className="flex items-center gap-3 px-4 py-3 hover:bg-muted/30 transition-colors">
                    <span className={`w-5 text-xs font-bold ${i === 0 ? "text-yellow-500" : i === 1 ? "text-slate-400" : i === 2 ? "text-amber-600" : "text-muted-foreground"}`}>
                      #{i + 1}
                    </span>
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-labia-purple to-labia-orange flex items-center justify-center text-white text-xs font-bold shrink-0">
                      {aluno.nome.split(" ").map(n => n[0]).slice(0, 2).join("")}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{aluno.nome}</p>
                      <p className="text-xs text-muted-foreground truncate">{aluno.escola}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-sm font-semibold text-labia-purple">{aluno.xp.toLocaleString()} XP</p>
                      <div className="flex items-center gap-1 justify-end">
                        <span className="text-xs text-labia-orange">🔥 {aluno.streak}d</span>
                        <span className="text-xs text-muted-foreground">· Nv.{aluno.nivel}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Redações recentes */}
        <motion.div variants={item}>
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-3 flex flex-row items-center justify-between">
              <CardTitle className="text-sm font-semibold">Redações Recentes</CardTitle>
              <Button variant="ghost" size="sm" className="text-xs text-labia-purple h-7 px-2">
                Ver todas <ChevronRight className="w-3 h-3 ml-1" />
              </Button>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-border">
                {recentRedacoes.map((r, i) => (
                  <div key={i} className="flex items-center gap-3 px-4 py-3 hover:bg-muted/30 transition-colors">
                    <div className="w-8 h-8 rounded-full bg-labia-pink/10 flex items-center justify-center shrink-0">
                      <PenLine className="w-4 h-4 text-labia-pink" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{r.aluno}</p>
                      <p className="text-xs text-muted-foreground truncate">{r.tema}</p>
                    </div>
                    <div className="text-right shrink-0 space-y-1">
                      {r.nota ? (
                        <p className={`text-sm ${notaColor(r.nota)}`}>{r.nota} pts</p>
                      ) : (
                        <Badge variant="outline" className={`text-xs ${r.status === "pendente" ? "border-labia-orange text-labia-orange" : "border-labia-blue text-labia-blue"}`}>
                          {r.status === "pendente" ? "Pendente" : "Em revisão"}
                        </Badge>
                      )}
                      <p className="text-xs text-muted-foreground">{r.data}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Progresso por matéria */}
      <motion.div variants={item}>
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold">Média de Desempenho por Matéria — Todos os Alunos EM</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {materiaData.map((m) => (
                <div key={m.materia} className="space-y-1.5">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">{m.materia}</span>
                    <span className="text-muted-foreground text-xs">
                      {m.materia === "Redação" ? `${m.media} / ${m.meta} pts` : `${m.media}% · meta ${m.meta}%`}
                    </span>
                  </div>
                  <div className="relative">
                    <Progress
                      value={m.materia === "Redação" ? (m.media / m.meta) * 100 : (m.media / m.meta) * 100}
                      className="h-2"
                    />
                    <div
                      className="absolute top-0 h-2 w-0.5 bg-labia-orange/60"
                      style={{ left: "100%" }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
