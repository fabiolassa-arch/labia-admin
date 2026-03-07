/*
 * Gestão de Trilhas — CRUD de trilhas com tabela, filtros e ações
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
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {
  Plus, Search, MoreHorizontal, Pencil, Trash2, Eye, Route, Target,
  Users, BookOpen, Filter
} from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";

const trilhasData = [
  { id: 1, nome: "Entendendo a IA", descricao: "Introdução aos conceitos fundamentais de IA", missoes: 4, alunos: 524, progresso: 100, status: "ativa", cor: "#7C3AED" },
  { id: 2, nome: "Criando Prompts", descricao: "Aprenda a criar prompts eficientes para IA", missoes: 4, alunos: 348, progresso: 60, status: "ativa", cor: "#F97316" },
  { id: 3, nome: "Criando Soluções", descricao: "Resolva problemas reais com IA", missoes: 4, alunos: 156, progresso: 0, status: "ativa", cor: "#10B981" },
  { id: 4, nome: "Meu Primeiro App", descricao: "Construa seu primeiro app com IA", missoes: 4, alunos: 89, progresso: 0, status: "rascunho", cor: "#3B82F6" },
];

const metrics = [
  { label: "Total de Trilhas", value: "4", icon: Route, color: "text-labia-purple", bg: "bg-labia-purple/10" },
  { label: "Total de Missões", value: "16", icon: Target, color: "text-labia-orange", bg: "bg-labia-orange/10" },
  { label: "Alunos Matriculados", value: "1.117", icon: Users, color: "text-labia-green", bg: "bg-labia-green/10" },
  { label: "Taxa de Conclusão", value: "42%", icon: BookOpen, color: "text-labia-blue", bg: "bg-labia-blue/10" },
];

export default function Trilhas() {
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);

  const filtered = trilhasData.filter(t =>
    t.nome.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display font-bold text-2xl">Trilhas de Aprendizado</h1>
          <p className="text-muted-foreground text-sm mt-1">Gerencie as trilhas e seus conteúdos educacionais</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary hover:bg-primary/90">
              <Plus className="w-4 h-4 mr-2" /> Nova Trilha
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Criar Nova Trilha</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Nome da Trilha</Label>
                <Input placeholder="Ex: Ética e IA" />
              </div>
              <div className="space-y-2">
                <Label>Descrição</Label>
                <Textarea placeholder="Descreva o objetivo da trilha..." rows={3} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Cor</Label>
                  <Input type="color" defaultValue="#7C3AED" className="h-10" />
                </div>
                <div className="space-y-2">
                  <Label>Status</Label>
                  <select className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm">
                    <option value="ativa">Ativa</option>
                    <option value="rascunho">Rascunho</option>
                  </select>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancelar</Button>
              <Button onClick={() => { setDialogOpen(false); toast.success("Trilha criada com sucesso!"); }}>
                Criar Trilha
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((m) => (
          <Card key={m.label}>
            <CardContent className="p-4 flex items-center gap-3">
              <div className={`p-2.5 rounded-xl ${m.bg}`}>
                <m.icon className={`w-5 h-5 ${m.color}`} />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">{m.label}</p>
                <p className="text-xl font-bold">{m.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Table */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <CardTitle className="text-base">Todas as Trilhas</CardTitle>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar trilha..."
                  className="pl-9 h-9 w-64"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <Button variant="outline" size="sm" className="h-9">
                <Filter className="w-4 h-4 mr-1" /> Filtrar
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Trilha</TableHead>
                <TableHead className="text-center">Missões</TableHead>
                <TableHead className="text-center">Alunos</TableHead>
                <TableHead>Progresso Médio</TableHead>
                <TableHead className="text-center">Status</TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((t) => (
                <TableRow key={t.id} className="hover:bg-muted/30">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-8 rounded-full" style={{ backgroundColor: t.cor }} />
                      <div>
                        <p className="font-medium">{t.nome}</p>
                        <p className="text-xs text-muted-foreground">{t.descricao}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-center font-medium">{t.missoes}</TableCell>
                  <TableCell className="text-center font-medium">{t.alunos}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Progress value={t.progresso} className="h-2 flex-1" />
                      <span className="text-xs font-medium w-8 text-right">{t.progresso}%</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge variant={t.status === "ativa" ? "default" : "secondary"} className="text-[11px]">
                      {t.status === "ativa" ? "Ativa" : "Rascunho"}
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
