/*
 * Planos de Estudo EM — Gestão e acompanhamento dos planos semanais dos alunos
 * Visualização por aluno, aderência ao plano, ajustes e relatórios
 */
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from "@/components/ui/table";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter
} from "@/components/ui/dialog";
import {
  Search, CalendarDays, Brain, TrendingUp, Users, CheckCircle2,
  Clock, AlertCircle, ChevronRight, BarChart3, Target, BookOpen
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from "recharts";
import { motion } from "framer-motion";

const planosData = [
  { id: 1, aluno: "Lucas Oliveira", escola: "Escola Nova Era", objetivo: "Top 10% ENEM", horasSemana: 14, diasConcluidos: 5, diasTotal: 7, aderencia: 71, materias: ["Matemática", "Português", "Redação"], dataEnem: "03/11/2025", status: "ativo" },
  { id: 2, aluno: "Maria Silva", escola: "Escola Nova Era", objetivo: "Medicina — USP", horasSemana: 20, diasConcluidos: 7, diasTotal: 7, aderencia: 100, materias: ["Ciências", "Matemática", "Redação", "Humanas"], dataEnem: "03/11/2025", status: "ativo" },
  { id: 3, aluno: "Pedro Lima", escola: "Instituto Tech", objetivo: "Engenharia — UNICAMP", horasSemana: 18, diasConcluidos: 6, diasTotal: 7, aderencia: 86, materias: ["Matemática", "Ciências", "Português"], dataEnem: "03/11/2025", status: "ativo" },
  { id: 4, aluno: "Ana Costa", escola: "Escola Criativa", objetivo: "Direito — PUC", horasSemana: 12, diasConcluidos: 3, diasTotal: 7, aderencia: 43, materias: ["Humanas", "Português", "Redação"], dataEnem: "03/11/2025", status: "atencao" },
  { id: 5, aluno: "Rafael Souza", escola: "Escola Nova Era", objetivo: "Top 25% ENEM", horasSemana: 10, diasConcluidos: 4, diasTotal: 7, aderencia: 57, materias: ["Matemática", "Português"], dataEnem: "03/11/2025", status: "ativo" },
  { id: 6, aluno: "Carla Mendes", escola: "Instituto Tech", objetivo: "Psicologia — UFMG", horasSemana: 8, diasConcluidos: 0, diasTotal: 7, aderencia: 0, materias: ["Humanas", "Português"], dataEnem: "03/11/2025", status: "inativo" },
];

const aderenciaData = [
  { semana: "Sem 1", alta: 45, media: 28, baixa: 12 },
  { semana: "Sem 2", alta: 52, media: 31, baixa: 10 },
  { semana: "Sem 3", alta: 48, media: 35, baixa: 8 },
  { semana: "Sem 4", alta: 61, media: 29, baixa: 7 },
  { semana: "Sem 5", alta: 58, media: 33, baixa: 9 },
  { semana: "Sem 6", alta: 67, media: 27, baixa: 6 },
];

const statusConfig: Record<string, { label: string; color: string; icon: typeof CheckCircle2 }> = {
  ativo: { label: "Em dia", color: "text-labia-green", icon: CheckCircle2 },
  atencao: { label: "Atenção", color: "text-labia-orange", icon: AlertCircle },
  inativo: { label: "Inativo", color: "text-muted-foreground", icon: Clock },
};

const aderenciaColor = (pct: number) => {
  if (pct >= 80) return "text-labia-green font-semibold";
  if (pct >= 50) return "text-labia-orange font-semibold";
  return "text-destructive font-semibold";
};

const metrics = [
  { label: "Planos Ativos", value: "287", icon: CalendarDays, color: "text-labia-purple", bg: "bg-labia-purple/10" },
  { label: "Aderência Média", value: "74%", icon: TrendingUp, color: "text-labia-green", bg: "bg-labia-green/10" },
  { label: "Precisam Atenção", value: "38", icon: AlertCircle, color: "text-labia-orange", bg: "bg-labia-orange/10" },
  { label: "Horas Estudadas/sem", value: "14h", icon: Clock, color: "text-labia-blue", bg: "bg-labia-blue/10" },
];

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.06 } } };
const item = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0, transition: { duration: 0.35 } } };

export default function PlanosEstudoEM() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("todos");
  const [selectedPlano, setSelectedPlano] = useState<typeof planosData[0] | null>(null);

  const filtered = planosData.filter(p => {
    const matchSearch = p.aluno.toLowerCase().includes(search.toLowerCase()) || p.escola.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "todos" || p.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
      {/* Header */}
      <motion.div variants={item} className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <CalendarDays className="w-7 h-7 text-labia-purple" />
            Planos de Estudo — EM
          </h1>
          <p className="text-muted-foreground text-sm mt-0.5">
            Acompanhe a aderência dos alunos aos planos semanais gerados por IA
          </p>
        </div>
        <Button size="sm" className="bg-labia-purple hover:bg-labia-purple/90">
          <BarChart3 className="w-4 h-4 mr-2" /> Relatório de Aderência
        </Button>
      </motion.div>

      {/* Metrics */}
      <motion.div variants={item} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((m) => (
          <Card key={m.label} className="border-0 shadow-sm">
            <CardContent className="p-4">
              <div className={`p-2 rounded-lg ${m.bg} w-fit`}>
                <m.icon className={`w-5 h-5 ${m.color}`} />
              </div>
              <p className="text-2xl font-bold mt-3">{m.value}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{m.label}</p>
            </CardContent>
          </Card>
        ))}
      </motion.div>

      {/* Aderência chart */}
      <motion.div variants={item}>
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold">Aderência Semanal aos Planos de Estudo</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={aderenciaData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="semana" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Legend iconSize={8} wrapperStyle={{ fontSize: 11 }} />
                <Bar dataKey="alta" name="Alta (≥80%)" fill="#10B981" radius={[3, 3, 0, 0]} stackId="a" />
                <Bar dataKey="media" name="Média (50–79%)" fill="#F97316" radius={[0, 0, 0, 0]} stackId="a" />
                <Bar dataKey="baixa" name="Baixa (<50%)" fill="#EF4444" radius={[3, 3, 0, 0]} stackId="a" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </motion.div>

      {/* Table */}
      <motion.div variants={item}>
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-3">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input placeholder="Buscar aluno ou escola..." className="pl-9" value={search} onChange={e => setSearch(e.target.value)} />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-36">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos</SelectItem>
                  <SelectItem value="ativo">Em dia</SelectItem>
                  <SelectItem value="atencao">Atenção</SelectItem>
                  <SelectItem value="inativo">Inativo</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Aluno</TableHead>
                  <TableHead>Objetivo</TableHead>
                  <TableHead className="w-32">Matérias</TableHead>
                  <TableHead className="w-24 text-center">Horas/sem</TableHead>
                  <TableHead className="w-36">Aderência</TableHead>
                  <TableHead className="w-28">Status</TableHead>
                  <TableHead className="w-12" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((p) => {
                  const st = statusConfig[p.status];
                  return (
                    <TableRow key={p.id} className="hover:bg-muted/30">
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Avatar className="h-7 w-7">
                            <AvatarFallback className="bg-gradient-to-br from-labia-purple to-labia-orange text-white text-xs">
                              {p.aluno.split(" ").map(n => n[0]).slice(0, 2).join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-sm font-medium">{p.aluno}</p>
                            <p className="text-xs text-muted-foreground">{p.escola}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <p className="text-sm">{p.objetivo}</p>
                        <p className="text-xs text-muted-foreground">ENEM: {p.dataEnem}</p>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {p.materias.slice(0, 2).map(m => (
                            <Badge key={m} variant="outline" className="text-xs px-1 py-0">{m}</Badge>
                          ))}
                          {p.materias.length > 2 && (
                            <Badge variant="outline" className="text-xs px-1 py-0">+{p.materias.length - 2}</Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-center text-sm font-medium">{p.horasSemana}h</TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center justify-between">
                            <span className={`text-xs ${aderenciaColor(p.aderencia)}`}>{p.aderencia}%</span>
                            <span className="text-xs text-muted-foreground">{p.diasConcluidos}/{p.diasTotal}d</span>
                          </div>
                          <Progress value={p.aderencia} className="h-1.5" />
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className={`flex items-center gap-1 text-xs ${st.color}`}>
                          <st.icon className="w-3.5 h-3.5" />
                          {st.label}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setSelectedPlano(p)}>
                          <ChevronRight className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </motion.div>

      {/* Dialog: detalhe do plano */}
      <Dialog open={!!selectedPlano} onOpenChange={() => setSelectedPlano(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Plano de Estudos — {selectedPlano?.aluno}</DialogTitle>
          </DialogHeader>
          {selectedPlano && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-muted/40 rounded-lg p-3">
                  <p className="text-xs text-muted-foreground">Objetivo</p>
                  <p className="text-sm font-semibold mt-0.5">{selectedPlano.objetivo}</p>
                </div>
                <div className="bg-muted/40 rounded-lg p-3">
                  <p className="text-xs text-muted-foreground">Data do ENEM</p>
                  <p className="text-sm font-semibold mt-0.5">{selectedPlano.dataEnem}</p>
                </div>
                <div className="bg-muted/40 rounded-lg p-3">
                  <p className="text-xs text-muted-foreground">Horas por semana</p>
                  <p className="text-sm font-semibold mt-0.5">{selectedPlano.horasSemana}h</p>
                </div>
                <div className="bg-muted/40 rounded-lg p-3">
                  <p className="text-xs text-muted-foreground">Aderência esta semana</p>
                  <p className={`text-sm mt-0.5 ${aderenciaColor(selectedPlano.aderencia)}`}>{selectedPlano.aderencia}%</p>
                </div>
              </div>
              <div>
                <p className="text-xs font-semibold text-muted-foreground mb-2">MATÉRIAS NO PLANO</p>
                <div className="flex flex-wrap gap-2">
                  {selectedPlano.materias.map(m => (
                    <Badge key={m} variant="outline" className="text-sm">{m}</Badge>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-xs font-semibold text-muted-foreground mb-2">PROGRESSO DA SEMANA</p>
                <div className="flex gap-1.5">
                  {["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"].map((d, i) => (
                    <div key={d} className="flex-1 text-center">
                      <div className={`h-8 rounded-md flex items-center justify-center text-xs font-medium ${i < selectedPlano.diasConcluidos ? "bg-labia-green/20 text-labia-green" : "bg-muted text-muted-foreground"}`}>
                        {i < selectedPlano.diasConcluidos ? "✓" : d[0]}
                      </div>
                      <p className="text-[10px] text-muted-foreground mt-1">{d}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedPlano(null)}>Fechar</Button>
            <Button className="bg-labia-purple hover:bg-labia-purple/90">
              <Brain className="w-4 h-4 mr-2" /> Reajustar com IA
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
