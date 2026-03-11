/*
 * Redações EM — Gestão de redações ENEM enviadas pelos alunos
 * Visualização, correção manual, temas e estatísticas
 */
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from "@/components/ui/table";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter
} from "@/components/ui/dialog";
import {
  Tabs, TabsContent, TabsList, TabsTrigger
} from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {
  Search, PenLine, MoreHorizontal, Eye, CheckCircle2, Clock, Plus,
  Star, TrendingUp, FileText, Image, AlertCircle, ChevronRight
} from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";

const temasData = [
  { id: 1, titulo: "Desafios da saúde mental entre jovens brasileiros", ativo: true, redacoes: 48, mediaGeral: 680, tags: ["Saúde", "Sociedade"] },
  { id: 2, titulo: "O papel da tecnologia na educação pública", ativo: true, redacoes: 35, mediaGeral: 720, tags: ["Tecnologia", "Educação"] },
  { id: 3, titulo: "Desigualdade social e acesso à cultura no Brasil", ativo: false, redacoes: 44, mediaGeral: 650, tags: ["Sociedade", "Cultura"] },
];

const redacoesData = [
  { id: 1, aluno: "Maria Silva", escola: "Escola Nova Era", tema: "Saúde mental entre jovens", tipo: "texto", nota: 820, c1: 160, c2: 180, c3: 160, c4: 160, c5: 160, status: "corrigida", data: "10/03/2026" },
  { id: 2, aluno: "Pedro Lima", escola: "Instituto Tech", tema: "Tecnologia na educação pública", tipo: "texto", nota: 760, c1: 160, c2: 160, c3: 140, c4: 160, c5: 140, status: "corrigida", data: "10/03/2026" },
  { id: 3, aluno: "Lucas Oliveira", escola: "Escola Nova Era", tema: "Desigualdade social e cultura", tipo: "foto", nota: null, c1: null, c2: null, c3: null, c4: null, c5: null, status: "pendente", data: "10/03/2026" },
  { id: 4, aluno: "Ana Costa", escola: "Escola Criativa", tema: "Saúde mental entre jovens", tipo: "texto", nota: 680, c1: 120, c2: 140, c3: 140, c4: 140, c5: 140, status: "corrigida", data: "09/03/2026" },
  { id: 5, aluno: "Rafael Souza", escola: "Escola Nova Era", tema: "Tecnologia na educação pública", tipo: "foto", nota: null, c1: null, c2: null, c3: null, c4: null, c5: null, status: "revisao", data: "09/03/2026" },
  { id: 6, aluno: "Beatriz Alves", escola: "Escola Criativa", tema: "Saúde mental entre jovens", tipo: "texto", nota: 900, c1: 180, c2: 200, c3: 180, c4: 180, c5: 160, status: "corrigida", data: "08/03/2026" },
  { id: 7, aluno: "Gabriel Rocha", escola: "Escola Nova Era", tema: "Desigualdade social e cultura", tipo: "texto", nota: 560, c1: 100, c2: 120, c3: 120, c4: 100, c5: 120, status: "corrigida", data: "08/03/2026" },
];

const competencias = ["C1 — Língua Portuguesa", "C2 — Tema e Gênero", "C3 — Argumentação", "C4 — Coesão", "C5 — Proposta de Intervenção"];

const statusConfig: Record<string, { label: string; color: string; icon: typeof CheckCircle2 }> = {
  corrigida: { label: "Corrigida", color: "text-labia-green", icon: CheckCircle2 },
  pendente: { label: "Pendente", color: "text-labia-orange", icon: Clock },
  revisao: { label: "Em revisão", color: "text-labia-blue", icon: AlertCircle },
};

const notaColor = (nota: number | null) => {
  if (!nota) return "text-muted-foreground";
  if (nota >= 800) return "text-labia-green font-bold";
  if (nota >= 600) return "text-labia-orange font-bold";
  return "text-destructive font-bold";
};

const metrics = [
  { label: "Total de Redações", value: "127", icon: PenLine, color: "text-labia-pink", bg: "bg-labia-pink/10" },
  { label: "Corrigidas", value: "98", icon: CheckCircle2, color: "text-labia-green", bg: "bg-labia-green/10" },
  { label: "Pendentes", value: "29", icon: Clock, color: "text-labia-orange", bg: "bg-labia-orange/10" },
  { label: "Média Geral", value: "683", icon: TrendingUp, color: "text-labia-purple", bg: "bg-labia-purple/10" },
];

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.06 } } };
const item = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0, transition: { duration: 0.35 } } };

export default function RedacoesEM() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("todos");
  const [selectedRedacao, setSelectedRedacao] = useState<typeof redacoesData[0] | null>(null);
  const [temaDialogOpen, setTemaDialogOpen] = useState(false);

  const filtered = redacoesData.filter(r => {
    const matchSearch = r.aluno.toLowerCase().includes(search.toLowerCase()) || r.tema.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "todos" || r.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
      {/* Header */}
      <motion.div variants={item} className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <PenLine className="w-7 h-7 text-labia-pink" />
            Redações ENEM — EM
          </h1>
          <p className="text-muted-foreground text-sm mt-0.5">
            Gerencie temas, visualize e corrija as redações dos alunos do Ensino Médio
          </p>
        </div>
        <Dialog open={temaDialogOpen} onOpenChange={setTemaDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="bg-labia-pink hover:bg-labia-pink/90">
              <Plus className="w-4 h-4 mr-2" /> Novo Tema
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Novo Tema de Redação</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-2">
              <div className="space-y-1.5">
                <Label>Título do Tema</Label>
                <Input placeholder="Ex: Desafios da saúde mental entre jovens brasileiros" />
              </div>
              <div className="space-y-1.5">
                <Label>Texto de Apoio (opcional)</Label>
                <Textarea placeholder="Cole aqui os textos motivadores para o tema..." className="min-h-[100px]" />
              </div>
              <div className="space-y-1.5">
                <Label>Tags</Label>
                <Input placeholder="Ex: Saúde, Sociedade, ENEM 2024" />
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" id="ativo" className="rounded" defaultChecked />
                <Label htmlFor="ativo">Publicar tema imediatamente</Label>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setTemaDialogOpen(false)}>Cancelar</Button>
              <Button className="bg-labia-pink hover:bg-labia-pink/90" onClick={() => {
                toast.success("Tema criado com sucesso!");
                setTemaDialogOpen(false);
              }}>Criar Tema</Button>
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

      <Tabs defaultValue="redacoes">
        <motion.div variants={item}>
          <TabsList>
            <TabsTrigger value="redacoes">Redações Enviadas</TabsTrigger>
            <TabsTrigger value="temas">Temas Ativos</TabsTrigger>
          </TabsList>
        </motion.div>

        {/* Tab: Redações */}
        <TabsContent value="redacoes" className="mt-4">
          <motion.div variants={item}>
            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-3">
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input placeholder="Buscar por aluno ou tema..." className="pl-9" value={search} onChange={e => setSearch(e.target.value)} />
                  </div>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-36">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todos">Todos</SelectItem>
                      <SelectItem value="corrigida">Corrigidas</SelectItem>
                      <SelectItem value="pendente">Pendentes</SelectItem>
                      <SelectItem value="revisao">Em revisão</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Aluno</TableHead>
                      <TableHead>Tema</TableHead>
                      <TableHead className="w-20 text-center">Tipo</TableHead>
                      <TableHead className="w-24 text-center">Nota</TableHead>
                      <TableHead className="w-28">Status</TableHead>
                      <TableHead className="w-28">Data</TableHead>
                      <TableHead className="w-12" />
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filtered.map((r) => {
                      const st = statusConfig[r.status];
                      return (
                        <TableRow key={r.id} className="hover:bg-muted/30">
                          <TableCell>
                            <div>
                              <p className="text-sm font-medium">{r.aluno}</p>
                              <p className="text-xs text-muted-foreground">{r.escola}</p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <p className="text-sm line-clamp-1 max-w-[200px]">{r.tema}</p>
                          </TableCell>
                          <TableCell className="text-center">
                            <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground">
                              {r.tipo === "foto" ? <Image className="w-3.5 h-3.5" /> : <FileText className="w-3.5 h-3.5" />}
                              {r.tipo === "foto" ? "Foto" : "Texto"}
                            </div>
                          </TableCell>
                          <TableCell className="text-center">
                            <span className={`text-sm ${notaColor(r.nota)}`}>{r.nota ?? "—"}</span>
                          </TableCell>
                          <TableCell>
                            <div className={`flex items-center gap-1 text-xs ${st.color}`}>
                              <st.icon className="w-3.5 h-3.5" />
                              {st.label}
                            </div>
                          </TableCell>
                          <TableCell className="text-xs text-muted-foreground">{r.data}</TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-7 w-7">
                                  <MoreHorizontal className="w-4 h-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => setSelectedRedacao(r)}>
                                  <Eye className="w-4 h-4 mr-2" />Ver / Corrigir
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        {/* Tab: Temas */}
        <TabsContent value="temas" className="mt-4">
          <motion.div variants={item} className="space-y-3">
            {temasData.map(t => (
              <Card key={t.id} className="border-0 shadow-sm">
                <CardContent className="p-4 flex items-center gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-medium text-sm">{t.titulo}</p>
                      <Badge variant={t.ativo ? "default" : "secondary"} className={t.ativo ? "bg-labia-green/10 text-labia-green border-labia-green/20 text-xs" : "text-xs"}>
                        {t.ativo ? "Ativo" : "Inativo"}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      {t.tags.map(tag => (
                        <Badge key={tag} variant="outline" className="text-xs">{tag}</Badge>
                      ))}
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sm font-semibold">{t.redacoes} redações</p>
                    <p className={`text-xs font-medium ${notaColor(t.mediaGeral)}`}>Média: {t.mediaGeral} pts</p>
                  </div>
                  <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </motion.div>
        </TabsContent>
      </Tabs>

      {/* Dialog: Ver/Corrigir redação */}
      <Dialog open={!!selectedRedacao} onOpenChange={() => setSelectedRedacao(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Redação — {selectedRedacao?.aluno}</DialogTitle>
          </DialogHeader>
          {selectedRedacao && (
            <div className="space-y-4">
              <div className="bg-muted/40 rounded-lg p-3 text-sm">
                <p className="font-medium text-xs text-muted-foreground mb-1">TEMA</p>
                <p>{selectedRedacao.tema}</p>
              </div>
              {selectedRedacao.nota && (
                <div>
                  <p className="text-xs font-semibold text-muted-foreground mb-2">NOTAS POR COMPETÊNCIA</p>
                  <div className="space-y-2">
                    {competencias.map((c, i) => {
                      const notas = [selectedRedacao.c1, selectedRedacao.c2, selectedRedacao.c3, selectedRedacao.c4, selectedRedacao.c5];
                      const nota = notas[i];
                      return (
                        <div key={c} className="flex items-center gap-3">
                          <span className="text-xs text-muted-foreground w-48 shrink-0">{c}</span>
                          <Progress value={nota ? (nota / 200) * 100 : 0} className="flex-1 h-1.5" />
                          <span className="text-xs font-semibold w-12 text-right">{nota ?? 0}/200</span>
                        </div>
                      );
                    })}
                  </div>
                  <div className="mt-3 flex items-center justify-between bg-labia-purple/5 rounded-lg p-3">
                    <span className="text-sm font-semibold">Nota Final</span>
                    <span className={`text-xl font-bold ${notaColor(selectedRedacao.nota)}`}>{selectedRedacao.nota} / 1000</span>
                  </div>
                </div>
              )}
              {!selectedRedacao.nota && (
                <div className="space-y-3">
                  <p className="text-xs font-semibold text-muted-foreground">ATRIBUIR NOTAS POR COMPETÊNCIA (0–200 cada)</p>
                  {competencias.map((c) => (
                    <div key={c} className="flex items-center gap-3">
                      <Label className="text-xs w-48 shrink-0">{c}</Label>
                      <Input type="number" min={0} max={200} step={40} placeholder="0–200" className="w-24" />
                    </div>
                  ))}
                </div>
              )}
              <div className="space-y-1.5">
                <Label className="text-xs">Comentário do Corretor</Label>
                <Textarea placeholder="Adicione um feedback para o aluno..." className="min-h-[80px]" defaultValue="" />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedRedacao(null)}>Fechar</Button>
            {selectedRedacao && !selectedRedacao.nota && (
              <Button className="bg-labia-pink hover:bg-labia-pink/90" onClick={() => {
                toast.success("Correção salva com sucesso!");
                setSelectedRedacao(null);
              }}>Salvar Correção</Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
