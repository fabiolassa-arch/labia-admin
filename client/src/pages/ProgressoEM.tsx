/*
 * Progresso EM — Acompanhamento detalhado do progresso dos alunos do Ensino Médio
 * XP, streaks, desafios, redações, evolução por matéria
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
  Search, Trophy, TrendingUp, Star, Flame, Target, Download, ChevronRight, Medal
} from "lucide-react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from "recharts";
import { motion } from "framer-motion";

const alunosProgressoData = [
  { id: 1, nome: "Pedro Lima", escola: "Instituto Tech", nivel: 5, titulo: "Mestre", xp: 2100, streak: 21, desafios: 24, redacoes: 7, mediaRedacao: 820, progresso: { mat: 88, port: 75, cien: 82, hum: 70, red: 85 }, evolucao: [400, 650, 900, 1200, 1600, 1900, 2100] },
  { id: 2, nome: "Maria Silva", escola: "Escola Nova Era", nivel: 4, titulo: "Cientista", xp: 1890, streak: 14, desafios: 19, redacoes: 5, mediaRedacao: 780, progresso: { mat: 72, port: 80, cien: 68, hum: 75, red: 90 }, evolucao: [200, 450, 700, 1000, 1400, 1700, 1890] },
  { id: 3, nome: "Lucas Oliveira", escola: "Escola Nova Era", nivel: 3, titulo: "Inventor", xp: 1240, streak: 7, desafios: 12, redacoes: 3, mediaRedacao: 680, progresso: { mat: 72, port: 65, cien: 48, hum: 55, red: 80 }, evolucao: [100, 250, 450, 700, 900, 1100, 1240] },
  { id: 4, nome: "Rafael Souza", escola: "Escola Nova Era", nivel: 4, titulo: "Cientista", xp: 1560, streak: 10, desafios: 16, redacoes: 4, mediaRedacao: 720, progresso: { mat: 80, port: 60, cien: 75, hum: 65, red: 70 }, evolucao: [150, 350, 600, 900, 1200, 1400, 1560] },
  { id: 5, nome: "Ana Costa", escola: "Escola Criativa", nivel: 3, titulo: "Inventor", xp: 980, streak: 5, desafios: 10, redacoes: 2, mediaRedacao: 640, progresso: { mat: 55, port: 70, cien: 45, hum: 68, red: 75 }, evolucao: [80, 200, 380, 550, 720, 880, 980] },
  { id: 6, nome: "Beatriz Alves", escola: "Escola Criativa", nivel: 4, titulo: "Cientista", xp: 1720, streak: 12, desafios: 18, redacoes: 6, mediaRedacao: 860, progresso: { mat: 65, port: 88, cien: 60, hum: 72, red: 95 }, evolucao: [180, 400, 680, 1000, 1300, 1550, 1720] },
];

const evolucaoGeral = [
  { semana: "Sem 1", xpMedio: 280, desafiosMedio: 4.2 },
  { semana: "Sem 2", xpMedio: 420, desafiosMedio: 6.1 },
  { semana: "Sem 3", xpMedio: 610, desafiosMedio: 8.4 },
  { semana: "Sem 4", xpMedio: 850, desafiosMedio: 10.8 },
  { semana: "Sem 5", xpMedio: 1080, desafiosMedio: 13.2 },
  { semana: "Sem 6", xpMedio: 1320, desafiosMedio: 15.7 },
  { semana: "Sem 7", xpMedio: 1582, desafiosMedio: 17.9 },
];

const nivelConfig: Record<number, { label: string; color: string; bg: string }> = {
  1: { label: "Iniciante", color: "text-gray-500", bg: "bg-gray-100" },
  2: { label: "Explorador", color: "text-labia-purple", bg: "bg-labia-purple/10" },
  3: { label: "Inventor", color: "text-labia-orange", bg: "bg-labia-orange/10" },
  4: { label: "Cientista", color: "text-labia-green", bg: "bg-labia-green/10" },
  5: { label: "Mestre", color: "text-labia-pink", bg: "bg-labia-pink/10" },
};

const MATERIAS_LABELS: Record<string, string> = {
  mat: "Matemática", port: "Português", cien: "Ciências", hum: "Humanas", red: "Redação"
};

const metrics = [
  { label: "XP Médio", value: "1.582", icon: Star, color: "text-labia-orange", bg: "bg-labia-orange/10" },
  { label: "Streak Médio", value: "11 dias", icon: Flame, color: "text-labia-pink", bg: "bg-labia-pink/10" },
  { label: "Desafios/Aluno", value: "16,5", icon: Target, color: "text-labia-purple", bg: "bg-labia-purple/10" },
  { label: "Nota Média ENEM", value: "750", icon: Trophy, color: "text-labia-green", bg: "bg-labia-green/10" },
];

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.06 } } };
const item = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0, transition: { duration: 0.35 } } };

export default function ProgressoEM() {
  const [search, setSearch] = useState("");
  const [nivelFilter, setNivelFilter] = useState("todos");
  const [selectedAluno, setSelectedAluno] = useState<typeof alunosProgressoData[0] | null>(null);

  const filtered = alunosProgressoData.filter(a => {
    const matchSearch = a.nome.toLowerCase().includes(search.toLowerCase()) || a.escola.toLowerCase().includes(search.toLowerCase());
    const matchNivel = nivelFilter === "todos" || a.nivel === parseInt(nivelFilter);
    return matchSearch && matchNivel;
  });

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
      {/* Header */}
      <motion.div variants={item} className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <TrendingUp className="w-7 h-7 text-labia-green" />
            Progresso dos Alunos — EM
          </h1>
          <p className="text-muted-foreground text-sm mt-0.5">
            Acompanhe a evolução individual e coletiva dos alunos do Ensino Médio
          </p>
        </div>
        <Button size="sm" variant="outline">
          <Download className="w-4 h-4 mr-2" /> Exportar Relatório
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

      {/* Evolução geral */}
      <motion.div variants={item}>
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold">Evolução Geral — XP Médio e Desafios por Semana</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={evolucaoGeral}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="semana" tick={{ fontSize: 11 }} />
                <YAxis yAxisId="left" tick={{ fontSize: 11 }} />
                <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11 }} />
                <Tooltip />
                <Legend iconSize={8} wrapperStyle={{ fontSize: 11 }} />
                <Line yAxisId="left" type="monotone" dataKey="xpMedio" name="XP Médio" stroke="#7C3AED" strokeWidth={2} dot={false} />
                <Line yAxisId="right" type="monotone" dataKey="desafiosMedio" name="Desafios/Aluno" stroke="#F97316" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </motion.div>

      {/* Ranking + Table */}
      <motion.div variants={item}>
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-3">
            <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
              <CardTitle className="text-sm font-semibold">Ranking de Alunos — Ensino Médio</CardTitle>
              <div className="flex gap-2 w-full sm:w-auto">
                <div className="relative flex-1 sm:w-56">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input placeholder="Buscar aluno..." className="pl-9 h-8 text-sm" value={search} onChange={e => setSearch(e.target.value)} />
                </div>
                <Select value={nivelFilter} onValueChange={setNivelFilter}>
                  <SelectTrigger className="w-32 h-8 text-sm">
                    <SelectValue placeholder="Nível" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos</SelectItem>
                    {[1, 2, 3, 4, 5].map(n => (
                      <SelectItem key={n} value={String(n)}>Nível {n}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-10">#</TableHead>
                  <TableHead>Aluno</TableHead>
                  <TableHead className="w-28">Nível</TableHead>
                  <TableHead className="w-24 text-center">XP Total</TableHead>
                  <TableHead className="w-20 text-center">Streak</TableHead>
                  <TableHead className="w-20 text-center">Desafios</TableHead>
                  <TableHead className="w-24 text-center">Nota ENEM</TableHead>
                  <TableHead className="w-12" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered
                  .sort((a, b) => b.xp - a.xp)
                  .map((a, i) => {
                    const nv = nivelConfig[a.nivel];
                    return (
                      <TableRow key={a.id} className="hover:bg-muted/30">
                        <TableCell>
                          {i === 0 ? <Medal className="w-4 h-4 text-yellow-500" /> :
                           i === 1 ? <Medal className="w-4 h-4 text-slate-400" /> :
                           i === 2 ? <Medal className="w-4 h-4 text-amber-600" /> :
                           <span className="text-xs text-muted-foreground">#{i + 1}</span>}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Avatar className="h-7 w-7">
                              <AvatarFallback className="bg-gradient-to-br from-labia-purple to-labia-orange text-white text-xs">
                                {a.nome.split(" ").map(n => n[0]).slice(0, 2).join("")}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="text-sm font-medium">{a.nome}</p>
                              <p className="text-xs text-muted-foreground">{a.escola}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className={`text-xs ${nv.color} border-current`}>
                            Nv.{a.nivel} · {nv.label}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-center">
                          <span className="text-sm font-semibold text-labia-purple">{a.xp.toLocaleString()}</span>
                        </TableCell>
                        <TableCell className="text-center">
                          <span className="text-sm text-labia-orange">🔥 {a.streak}d</span>
                        </TableCell>
                        <TableCell className="text-center text-sm">{a.desafios}</TableCell>
                        <TableCell className="text-center">
                          <span className={`text-sm font-semibold ${a.mediaRedacao >= 800 ? "text-labia-green" : a.mediaRedacao >= 600 ? "text-labia-orange" : "text-destructive"}`}>
                            {a.mediaRedacao}
                          </span>
                        </TableCell>
                        <TableCell>
                          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setSelectedAluno(a)}>
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

      {/* Dialog: detalhe do aluno */}
      <Dialog open={!!selectedAluno} onOpenChange={() => setSelectedAluno(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Progresso Detalhado — {selectedAluno?.nome}</DialogTitle>
          </DialogHeader>
          {selectedAluno && (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Avatar className="h-12 w-12">
                  <AvatarFallback className="bg-gradient-to-br from-labia-purple to-labia-orange text-white text-sm font-bold">
                    {selectedAluno.nome.split(" ").map(n => n[0]).slice(0, 2).join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold">{selectedAluno.nome}</p>
                  <p className="text-sm text-muted-foreground">{selectedAluno.escola}</p>
                  <Badge variant="outline" className={`text-xs mt-1 ${nivelConfig[selectedAluno.nivel].color} border-current`}>
                    Nível {selectedAluno.nivel} · {nivelConfig[selectedAluno.nivel].label}
                  </Badge>
                </div>
                <div className="ml-auto text-right">
                  <p className="text-2xl font-bold text-labia-purple">{selectedAluno.xp.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">XP Total</p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div className="bg-muted/40 rounded-lg p-2 text-center">
                  <p className="text-lg font-bold text-labia-orange">🔥 {selectedAluno.streak}</p>
                  <p className="text-xs text-muted-foreground">dias streak</p>
                </div>
                <div className="bg-muted/40 rounded-lg p-2 text-center">
                  <p className="text-lg font-bold">{selectedAluno.desafios}</p>
                  <p className="text-xs text-muted-foreground">desafios</p>
                </div>
                <div className="bg-muted/40 rounded-lg p-2 text-center">
                  <p className="text-lg font-bold text-labia-pink">{selectedAluno.mediaRedacao}</p>
                  <p className="text-xs text-muted-foreground">nota ENEM</p>
                </div>
              </div>
              <div>
                <p className="text-xs font-semibold text-muted-foreground mb-2">PROGRESSO POR MATÉRIA</p>
                <div className="space-y-2">
                  {Object.entries(selectedAluno.progresso).map(([key, val]) => (
                    <div key={key} className="flex items-center gap-3">
                      <span className="text-xs text-muted-foreground w-24 shrink-0">{MATERIAS_LABELS[key]}</span>
                      <Progress value={val} className="flex-1 h-1.5" />
                      <span className="text-xs font-semibold w-8 text-right">{val}%</span>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-xs font-semibold text-muted-foreground mb-2">EVOLUÇÃO DE XP (últimas 7 semanas)</p>
                <ResponsiveContainer width="100%" height={100}>
                  <LineChart data={selectedAluno.evolucao.map((xp, i) => ({ sem: `S${i + 1}`, xp }))}>
                    <XAxis dataKey="sem" tick={{ fontSize: 10 }} />
                    <YAxis tick={{ fontSize: 10 }} />
                    <Tooltip />
                    <Line type="monotone" dataKey="xp" stroke="#7C3AED" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedAluno(null)}>Fechar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
