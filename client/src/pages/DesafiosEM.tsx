/*
 * Desafios EM — Gestão de questões do Desafio do Dia para Ensino Médio
 * CRUD de questões por matéria, dificuldade e status de publicação
 */
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from "@/components/ui/table";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {
  Search, Plus, MoreHorizontal, Edit, Trash2, Eye, Target,
  BookOpen, FlaskConical, Landmark, Newspaper, CheckCircle2, XCircle, Clock
} from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";

const MATERIAS = [
  { value: "matematica", label: "Matemática", icon: Target, color: "text-labia-orange", bg: "bg-labia-orange/10" },
  { value: "portugues", label: "Português", icon: BookOpen, color: "text-labia-purple", bg: "bg-labia-purple/10" },
  { value: "ciencias", label: "Ciências", icon: FlaskConical, color: "text-labia-green", bg: "bg-labia-green/10" },
  { value: "humanas", label: "Humanas", icon: Landmark, color: "text-labia-blue", bg: "bg-labia-blue/10" },
  { value: "atualidades", label: "Atualidades", icon: Newspaper, color: "text-labia-pink", bg: "bg-labia-pink/10" },
];

const questoesData = [
  { id: 1, enunciado: "Uma função f(x) = ax² + bx + c tem vértice no ponto (2, -1) e passa pelo ponto (0, 3). Qual é o valor de a?", materia: "matematica", dificuldade: "media", xp: 30, status: "publicada", respostas: 124, acertos: 78 },
  { id: 2, enunciado: "Identifique a figura de linguagem presente no verso: 'A vida é uma ilusão que a morte desfaz.'", materia: "portugues", dificuldade: "facil", xp: 20, status: "publicada", respostas: 98, acertos: 71 },
  { id: 3, enunciado: "Qual é o produto da reação entre ácido clorídrico (HCl) e hidróxido de sódio (NaOH)?", materia: "ciencias", dificuldade: "media", xp: 30, status: "publicada", respostas: 87, acertos: 52 },
  { id: 4, enunciado: "O movimento conhecido como 'Tenentismo' no Brasil teve como principal característica:", materia: "humanas", dificuldade: "dificil", xp: 40, status: "rascunho", respostas: 0, acertos: 0 },
  { id: 5, enunciado: "Em 2024, qual país sediou a COP29 — Conferência das Nações Unidas sobre Mudanças Climáticas?", materia: "atualidades", dificuldade: "facil", xp: 20, status: "publicada", respostas: 156, acertos: 134 },
  { id: 6, enunciado: "Calcule o determinante da matriz A = [[3, 1], [2, 4]].", materia: "matematica", dificuldade: "facil", xp: 20, status: "publicada", respostas: 203, acertos: 178 },
  { id: 7, enunciado: "Qual é a diferença entre sujeito simples e sujeito composto? Dê um exemplo de cada.", materia: "portugues", dificuldade: "media", xp: 30, status: "rascunho", respostas: 0, acertos: 0 },
  { id: 8, enunciado: "A fotossíntese ocorre em qual organela celular e qual é o pigmento responsável?", materia: "ciencias", dificuldade: "facil", xp: 20, status: "publicada", respostas: 145, acertos: 112 },
];

const dificuldadeConfig: Record<string, { label: string; color: string }> = {
  facil: { label: "Fácil", color: "bg-labia-green/10 text-labia-green border-labia-green/20" },
  media: { label: "Média", color: "bg-labia-orange/10 text-labia-orange border-labia-orange/20" },
  dificil: { label: "Difícil", color: "bg-destructive/10 text-destructive border-destructive/20" },
};

const statusConfig: Record<string, { label: string; icon: typeof CheckCircle2; color: string }> = {
  publicada: { label: "Publicada", icon: CheckCircle2, color: "text-labia-green" },
  rascunho: { label: "Rascunho", icon: Clock, color: "text-labia-orange" },
  arquivada: { label: "Arquivada", icon: XCircle, color: "text-muted-foreground" },
};

const metrics = [
  { label: "Total de Questões", value: "48", icon: Target, color: "text-labia-purple", bg: "bg-labia-purple/10" },
  { label: "Publicadas", value: "36", icon: CheckCircle2, color: "text-labia-green", bg: "bg-labia-green/10" },
  { label: "Rascunhos", value: "12", icon: Clock, color: "text-labia-orange", bg: "bg-labia-orange/10" },
  { label: "Taxa de Acerto", value: "68%", icon: Target, color: "text-labia-blue", bg: "bg-labia-blue/10" },
];

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.06 } } };
const item = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0, transition: { duration: 0.35 } } };

export default function DesafiosEM() {
  const [search, setSearch] = useState("");
  const [materiaFilter, setMateriaFilter] = useState("todas");
  const [statusFilter, setStatusFilter] = useState("todos");
  const [dialogOpen, setDialogOpen] = useState(false);

  const filtered = questoesData.filter(q => {
    const matchSearch = q.enunciado.toLowerCase().includes(search.toLowerCase());
    const matchMateria = materiaFilter === "todas" || q.materia === materiaFilter;
    const matchStatus = statusFilter === "todos" || q.status === statusFilter;
    return matchSearch && matchMateria && matchStatus;
  });

  const getMateriaInfo = (value: string) => MATERIAS.find(m => m.value === value);

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
      {/* Header */}
      <motion.div variants={item} className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Target className="w-7 h-7 text-labia-orange" />
            Desafios do Dia — EM
          </h1>
          <p className="text-muted-foreground text-sm mt-0.5">
            Gerencie as questões diárias de Matemática, Português, Ciências, Humanas e Atualidades
          </p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="bg-labia-orange hover:bg-labia-orange/90">
              <Plus className="w-4 h-4 mr-2" /> Nova Questão
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Nova Questão — Desafio do Dia</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-2">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label>Matéria</Label>
                  <Select>
                    <SelectTrigger><SelectValue placeholder="Selecione..." /></SelectTrigger>
                    <SelectContent>
                      {MATERIAS.map(m => (
                        <SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label>Dificuldade</Label>
                  <Select>
                    <SelectTrigger><SelectValue placeholder="Selecione..." /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="facil">Fácil (+20 XP)</SelectItem>
                      <SelectItem value="media">Média (+30 XP)</SelectItem>
                      <SelectItem value="dificil">Difícil (+40 XP)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-1.5">
                <Label>Enunciado da Questão</Label>
                <Textarea placeholder="Digite o enunciado completo da questão..." className="min-h-[100px]" />
              </div>
              <div className="space-y-3">
                <Label>Alternativas</Label>
                {["A", "B", "C", "D"].map(letra => (
                  <div key={letra} className="flex items-center gap-2">
                    <span className="w-7 h-7 rounded-full bg-muted flex items-center justify-center text-xs font-bold shrink-0">{letra}</span>
                    <Input placeholder={`Alternativa ${letra}`} />
                  </div>
                ))}
              </div>
              <div className="space-y-1.5">
                <Label>Resposta Correta</Label>
                <Select>
                  <SelectTrigger><SelectValue placeholder="Selecione a alternativa correta..." /></SelectTrigger>
                  <SelectContent>
                    {["A", "B", "C", "D"].map(l => <SelectItem key={l} value={l}>Alternativa {l}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Explicação (exibida após responder)</Label>
                <Textarea placeholder="Explique por que a resposta correta é a correta..." className="min-h-[80px]" />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancelar</Button>
              <Button className="bg-labia-orange hover:bg-labia-orange/90" onClick={() => {
                toast.success("Questão salva como rascunho!");
                setDialogOpen(false);
              }}>Salvar Rascunho</Button>
              <Button className="bg-labia-purple hover:bg-labia-purple/90" onClick={() => {
                toast.success("Questão publicada com sucesso!");
                setDialogOpen(false);
              }}>Publicar</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
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

      {/* Matérias summary */}
      <motion.div variants={item} className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {MATERIAS.map(m => {
          const total = questoesData.filter(q => q.materia === m.value).length;
          const publicadas = questoesData.filter(q => q.materia === m.value && q.status === "publicada").length;
          return (
            <Card key={m.value} className="border-0 shadow-sm cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => setMateriaFilter(m.value === materiaFilter ? "todas" : m.value)}>
              <CardContent className="p-3 text-center">
                <div className={`w-10 h-10 rounded-full ${m.bg} flex items-center justify-center mx-auto mb-2`}>
                  <m.icon className={`w-5 h-5 ${m.color}`} />
                </div>
                <p className="text-xs font-semibold">{m.label}</p>
                <p className="text-lg font-bold">{total}</p>
                <p className="text-xs text-muted-foreground">{publicadas} publicadas</p>
              </CardContent>
            </Card>
          );
        })}
      </motion.div>

      {/* Filters + Table */}
      <motion.div variants={item}>
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-3">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar questões..."
                  className="pl-9"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
              </div>
              <Select value={materiaFilter} onValueChange={setMateriaFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Matéria" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todas">Todas as matérias</SelectItem>
                  {MATERIAS.map(m => <SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>)}
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-36">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos</SelectItem>
                  <SelectItem value="publicada">Publicadas</SelectItem>
                  <SelectItem value="rascunho">Rascunhos</SelectItem>
                  <SelectItem value="arquivada">Arquivadas</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">#</TableHead>
                  <TableHead>Enunciado</TableHead>
                  <TableHead className="w-32">Matéria</TableHead>
                  <TableHead className="w-24">Dificuldade</TableHead>
                  <TableHead className="w-16 text-center">XP</TableHead>
                  <TableHead className="w-24 text-center">Respostas</TableHead>
                  <TableHead className="w-20 text-center">Acertos</TableHead>
                  <TableHead className="w-28">Status</TableHead>
                  <TableHead className="w-12" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((q) => {
                  const mat = getMateriaInfo(q.materia);
                  const dif = dificuldadeConfig[q.dificuldade];
                  const st = statusConfig[q.status];
                  const taxaAcerto = q.respostas > 0 ? Math.round((q.acertos / q.respostas) * 100) : null;
                  return (
                    <TableRow key={q.id} className="hover:bg-muted/30">
                      <TableCell className="text-muted-foreground text-xs">{q.id}</TableCell>
                      <TableCell>
                        <p className="text-sm line-clamp-2 max-w-xs">{q.enunciado}</p>
                      </TableCell>
                      <TableCell>
                        {mat && (
                          <div className={`flex items-center gap-1.5 text-xs font-medium ${mat.color}`}>
                            <mat.icon className="w-3.5 h-3.5" />
                            {mat.label}
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={`text-xs ${dif.color}`}>{dif.label}</Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        <span className="text-xs font-semibold text-labia-orange">+{q.xp}</span>
                      </TableCell>
                      <TableCell className="text-center text-sm">{q.respostas || "—"}</TableCell>
                      <TableCell className="text-center">
                        {taxaAcerto !== null ? (
                          <span className={`text-xs font-semibold ${taxaAcerto >= 70 ? "text-labia-green" : taxaAcerto >= 50 ? "text-labia-orange" : "text-destructive"}`}>
                            {taxaAcerto}%
                          </span>
                        ) : "—"}
                      </TableCell>
                      <TableCell>
                        <div className={`flex items-center gap-1 text-xs ${st.color}`}>
                          <st.icon className="w-3.5 h-3.5" />
                          {st.label}
                        </div>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-7 w-7">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem><Eye className="w-4 h-4 mr-2" />Visualizar</DropdownMenuItem>
                            <DropdownMenuItem><Edit className="w-4 h-4 mr-2" />Editar</DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive"><Trash2 className="w-4 h-4 mr-2" />Excluir</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
            {filtered.length === 0 && (
              <div className="py-12 text-center text-muted-foreground text-sm">
                Nenhuma questão encontrada com os filtros aplicados.
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
