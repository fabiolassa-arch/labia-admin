/*
 * Gestão de Missões — Lista de missões com filtros por trilha e status
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
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from "@/components/ui/select";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {
  Plus, Search, MoreHorizontal, Pencil, Trash2, Eye, Target,
  BookOpen, HelpCircle, Lightbulb, Filter
} from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";

const missoesData = [
  { id: 1, nome: "O que é Inteligência Artificial?", trilha: "Entendendo a IA", tipo: "leitura", etapas: 5, conclusoes: 412, status: "ativa" },
  { id: 2, nome: "Como a IA aprende?", trilha: "Entendendo a IA", tipo: "quiz", etapas: 4, conclusoes: 356, status: "ativa" },
  { id: 3, nome: "IA no dia a dia", trilha: "Entendendo a IA", tipo: "atividade", etapas: 4, conclusoes: 298, status: "ativa" },
  { id: 4, nome: "Caça ao tesouro da IA", trilha: "Entendendo a IA", tipo: "atividade", etapas: 5, conclusoes: 245, status: "ativa" },
  { id: 5, nome: "O que é um prompt?", trilha: "Criando Prompts", tipo: "leitura", etapas: 4, conclusoes: 312, status: "ativa" },
  { id: 6, nome: "Estruture um prompt eficiente", trilha: "Criando Prompts", tipo: "quiz", etapas: 5, conclusoes: 278, status: "ativa" },
  { id: 7, nome: "Prompts criativos", trilha: "Criando Prompts", tipo: "atividade", etapas: 4, conclusoes: 189, status: "ativa" },
  { id: 8, nome: "Desafio dos prompts", trilha: "Criando Prompts", tipo: "atividade", etapas: 5, conclusoes: 156, status: "ativa" },
  { id: 9, nome: "Identificando problemas", trilha: "Criando Soluções", tipo: "leitura", etapas: 4, conclusoes: 98, status: "ativa" },
  { id: 10, nome: "Design Thinking com IA", trilha: "Criando Soluções", tipo: "atividade", etapas: 5, conclusoes: 67, status: "ativa" },
  { id: 11, nome: "Prototipando soluções", trilha: "Criando Soluções", tipo: "atividade", etapas: 4, conclusoes: 45, status: "ativa" },
  { id: 12, nome: "Pitch da solução", trilha: "Criando Soluções", tipo: "atividade", etapas: 5, conclusoes: 32, status: "ativa" },
  { id: 13, nome: "O que é um app?", trilha: "Meu Primeiro App", tipo: "leitura", etapas: 4, conclusoes: 56, status: "rascunho" },
  { id: 14, nome: "Planejando meu app", trilha: "Meu Primeiro App", tipo: "atividade", etapas: 5, conclusoes: 34, status: "rascunho" },
  { id: 15, nome: "Construindo com IA", trilha: "Meu Primeiro App", tipo: "atividade", etapas: 4, conclusoes: 21, status: "rascunho" },
  { id: 16, nome: "Lançamento do app", trilha: "Meu Primeiro App", tipo: "atividade", etapas: 5, conclusoes: 12, status: "rascunho" },
];

const tipoIcons: Record<string, React.ReactNode> = {
  leitura: <BookOpen className="w-3.5 h-3.5" />,
  quiz: <HelpCircle className="w-3.5 h-3.5" />,
  atividade: <Lightbulb className="w-3.5 h-3.5" />,
};

const tipoColors: Record<string, string> = {
  leitura: "bg-labia-blue/10 text-labia-blue",
  quiz: "bg-labia-purple/10 text-labia-purple",
  atividade: "bg-labia-orange/10 text-labia-orange",
};

const trilhaColors: Record<string, string> = {
  "Entendendo a IA": "#7C3AED",
  "Criando Prompts": "#F97316",
  "Criando Soluções": "#10B981",
  "Meu Primeiro App": "#3B82F6",
};

export default function Missoes() {
  const [search, setSearch] = useState("");
  const [trilhaFilter, setTrilhaFilter] = useState("todas");
  const [dialogOpen, setDialogOpen] = useState(false);

  const filtered = missoesData.filter(m => {
    const matchSearch = m.nome.toLowerCase().includes(search.toLowerCase());
    const matchTrilha = trilhaFilter === "todas" || m.trilha === trilhaFilter;
    return matchSearch && matchTrilha;
  });

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display font-bold text-2xl">Missões</h1>
          <p className="text-muted-foreground text-sm mt-1">Gerencie as missões de cada trilha de aprendizado</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary hover:bg-primary/90">
              <Plus className="w-4 h-4 mr-2" /> Nova Missão
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Criar Nova Missão</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Nome da Missão</Label>
                <Input placeholder="Ex: Ética na Inteligência Artificial" />
              </div>
              <div className="space-y-2">
                <Label>Trilha</Label>
                <Select>
                  <SelectTrigger><SelectValue placeholder="Selecione a trilha" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="entendendo">Entendendo a IA</SelectItem>
                    <SelectItem value="prompts">Criando Prompts</SelectItem>
                    <SelectItem value="solucoes">Criando Soluções</SelectItem>
                    <SelectItem value="app">Meu Primeiro App</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Tipo</Label>
                  <Select>
                    <SelectTrigger><SelectValue placeholder="Tipo" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="leitura">Leitura</SelectItem>
                      <SelectItem value="quiz">Quiz</SelectItem>
                      <SelectItem value="atividade">Atividade</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Nº de Etapas</Label>
                  <Input type="number" defaultValue={4} min={1} max={10} />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Descrição</Label>
                <Textarea placeholder="Descreva o objetivo da missão..." rows={3} />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancelar</Button>
              <Button onClick={() => { setDialogOpen(false); toast.success("Missão criada com sucesso!"); }}>
                Criar Missão
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {Object.entries(trilhaColors).map(([nome, cor]) => {
          const count = missoesData.filter(m => m.trilha === nome).length;
          const total = missoesData.filter(m => m.trilha === nome).reduce((s, m) => s + m.conclusoes, 0);
          return (
            <Card key={nome} className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setTrilhaFilter(nome)}>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: cor }} />
                  <span className="text-sm font-medium truncate">{nome}</span>
                </div>
                <p className="text-2xl font-bold">{count} <span className="text-sm font-normal text-muted-foreground">missões</span></p>
                <p className="text-xs text-muted-foreground mt-1">{total.toLocaleString()} conclusões</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Table */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <CardTitle className="text-base">
              {trilhaFilter === "todas" ? "Todas as Missões" : trilhaFilter}
              <span className="text-muted-foreground font-normal ml-2">({filtered.length})</span>
            </CardTitle>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar missão..."
                  className="pl-9 h-9 w-56"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              {trilhaFilter !== "todas" && (
                <Button variant="outline" size="sm" className="h-9" onClick={() => setTrilhaFilter("todas")}>
                  Limpar filtro
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">#</TableHead>
                <TableHead>Missão</TableHead>
                <TableHead>Trilha</TableHead>
                <TableHead className="text-center">Tipo</TableHead>
                <TableHead className="text-center">Etapas</TableHead>
                <TableHead className="text-center">Conclusões</TableHead>
                <TableHead className="text-center">Status</TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((m) => (
                <TableRow key={m.id} className="hover:bg-muted/30">
                  <TableCell className="text-muted-foreground font-mono text-xs">{m.id}</TableCell>
                  <TableCell className="font-medium">{m.nome}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: trilhaColors[m.trilha] }} />
                      <span className="text-sm text-muted-foreground">{m.trilha}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${tipoColors[m.tipo]}`}>
                      {tipoIcons[m.tipo]} {m.tipo}
                    </span>
                  </TableCell>
                  <TableCell className="text-center font-medium">{m.etapas}</TableCell>
                  <TableCell className="text-center font-medium">{m.conclusoes.toLocaleString()}</TableCell>
                  <TableCell className="text-center">
                    <Badge variant={m.status === "ativa" ? "default" : "secondary"} className="text-[11px]">
                      {m.status === "ativa" ? "Ativa" : "Rascunho"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem><Eye className="w-4 h-4 mr-2" /> Visualizar</DropdownMenuItem>
                        <DropdownMenuItem><Pencil className="w-4 h-4 mr-2" /> Editar</DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive"><Trash2 className="w-4 h-4 mr-2" /> Excluir</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </motion.div>
  );
}
