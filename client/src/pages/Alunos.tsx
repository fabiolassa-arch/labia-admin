/*
 * Gestão de Alunos — Lista, busca, filtros e detalhes de alunos
 */
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from "@/components/ui/table";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from "@/components/ui/select";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {
  Search, MoreHorizontal, Eye, Mail, Ban, Users, UserCheck, UserX,
  TrendingUp, Download, Filter, ChevronLeft, ChevronRight
} from "lucide-react";
import { motion } from "framer-motion";

const alunosData = [
  { id: 1, nome: "Lucas Oliveira", email: "lucas@email.com", escola: "Escola Nova Era", nivel: 2, titulo: "Explorador", xp: 350, missoes: 6, progresso: 35, status: "ativo", ultimoAcesso: "Hoje" },
  { id: 2, nome: "Maria Silva", email: "maria@email.com", escola: "Escola Nova Era", nivel: 4, titulo: "Cientista", xp: 890, missoes: 12, progresso: 75, status: "ativo", ultimoAcesso: "Hoje" },
  { id: 3, nome: "João Santos", email: "joao@email.com", escola: "Colégio Futuro", nivel: 3, titulo: "Inventor", xp: 620, missoes: 9, progresso: 56, status: "ativo", ultimoAcesso: "Ontem" },
  { id: 4, nome: "Ana Costa", email: "ana@email.com", escola: "Colégio Futuro", nivel: 2, titulo: "Explorador", xp: 410, missoes: 7, progresso: 43, status: "ativo", ultimoAcesso: "2 dias" },
  { id: 5, nome: "Pedro Lima", email: "pedro@email.com", escola: "Instituto Tech", nivel: 5, titulo: "Mestre", xp: 1200, missoes: 16, progresso: 100, status: "ativo", ultimoAcesso: "Hoje" },
  { id: 6, nome: "Carla Mendes", email: "carla@email.com", escola: "Instituto Tech", nivel: 1, titulo: "Iniciante", xp: 80, missoes: 2, progresso: 12, status: "inativo", ultimoAcesso: "15 dias" },
  { id: 7, nome: "Rafael Souza", email: "rafael@email.com", escola: "Escola Criativa", nivel: 3, titulo: "Inventor", xp: 560, missoes: 8, progresso: 50, status: "ativo", ultimoAcesso: "Hoje" },
  { id: 8, nome: "Beatriz Alves", email: "bia@email.com", escola: "Escola Criativa", nivel: 2, titulo: "Explorador", xp: 290, missoes: 5, progresso: 31, status: "ativo", ultimoAcesso: "3 dias" },
  { id: 9, nome: "Gabriel Rocha", email: "gabriel@email.com", escola: "Escola Nova Era", nivel: 4, titulo: "Cientista", xp: 950, missoes: 14, progresso: 87, status: "ativo", ultimoAcesso: "Ontem" },
  { id: 10, nome: "Isabela Ferreira", email: "isabela@email.com", escola: "Colégio Futuro", nivel: 1, titulo: "Iniciante", xp: 45, missoes: 1, progresso: 6, status: "inativo", ultimoAcesso: "30 dias" },
];

const nivelColors: Record<number, string> = {
  1: "bg-gray-100 text-gray-700",
  2: "bg-labia-purple/10 text-labia-purple",
  3: "bg-labia-orange/10 text-labia-orange",
  4: "bg-labia-green/10 text-labia-green",
  5: "bg-labia-pink/10 text-labia-pink",
};

const metrics = [
  { label: "Total de Alunos", value: "1.247", icon: Users, color: "text-labia-purple", bg: "bg-labia-purple/10" },
  { label: "Alunos Ativos", value: "1.089", icon: UserCheck, color: "text-labia-green", bg: "bg-labia-green/10" },
  { label: "Inativos (30d)", value: "158", icon: UserX, color: "text-destructive", bg: "bg-destructive/10" },
  { label: "Média de XP", value: "540", icon: TrendingUp, color: "text-labia-orange", bg: "bg-labia-orange/10" },
];

export default function Alunos() {
  const [search, setSearch] = useState("");
  const [escolaFilter, setEscolaFilter] = useState("todas");

  const filtered = alunosData.filter(a => {
    const matchSearch = a.nome.toLowerCase().includes(search.toLowerCase()) || a.email.toLowerCase().includes(search.toLowerCase());
    const matchEscola = escolaFilter === "todas" || a.escola === escolaFilter;
    return matchSearch && matchEscola;
  });

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display font-bold text-2xl">Alunos</h1>
          <p className="text-muted-foreground text-sm mt-1">Gerencie e acompanhe o progresso dos alunos</p>
        </div>
        <Button variant="outline">
          <Download className="w-4 h-4 mr-2" /> Exportar CSV
        </Button>
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
            <CardTitle className="text-base">
              Lista de Alunos <span className="text-muted-foreground font-normal">({filtered.length})</span>
            </CardTitle>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar aluno..."
                  className="pl-9 h-9 w-56"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <Select value={escolaFilter} onValueChange={setEscolaFilter}>
                <SelectTrigger className="h-9 w-44">
                  <SelectValue placeholder="Escola" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todas">Todas as escolas</SelectItem>
                  <SelectItem value="Escola Nova Era">Escola Nova Era</SelectItem>
                  <SelectItem value="Colégio Futuro">Colégio Futuro</SelectItem>
                  <SelectItem value="Instituto Tech">Instituto Tech</SelectItem>
                  <SelectItem value="Escola Criativa">Escola Criativa</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Aluno</TableHead>
                <TableHead>Escola</TableHead>
                <TableHead className="text-center">Nível</TableHead>
                <TableHead className="text-center">XP</TableHead>
                <TableHead>Progresso</TableHead>
                <TableHead className="text-center">Missões</TableHead>
                <TableHead className="text-center">Status</TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((a) => (
                <TableRow key={a.id} className="hover:bg-muted/30">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-gradient-to-br from-[#7C3AED] to-[#F97316] text-white text-[10px] font-bold">
                          {a.nome.split(" ").map(n => n[0]).join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-sm">{a.nome}</p>
                        <p className="text-xs text-muted-foreground">{a.email}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">{a.escola}</TableCell>
                  <TableCell className="text-center">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${nivelColors[a.nivel]}`}>
                      Nv.{a.nivel} — {a.titulo}
                    </span>
                  </TableCell>
                  <TableCell className="text-center font-semibold text-sm">{a.xp}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2 min-w-[120px]">
                      <Progress value={a.progresso} className="h-2 flex-1" />
                      <span className="text-xs font-medium w-8 text-right">{a.progresso}%</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-center font-medium text-sm">{a.missoes}/16</TableCell>
                  <TableCell className="text-center">
                    <Badge variant={a.status === "ativo" ? "default" : "secondary"} className="text-[11px]">
                      {a.status === "ativo" ? "Ativo" : "Inativo"}
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
                        <DropdownMenuItem><Eye className="w-4 h-4 mr-2" /> Ver perfil</DropdownMenuItem>
                        <DropdownMenuItem><Mail className="w-4 h-4 mr-2" /> Enviar mensagem</DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive"><Ban className="w-4 h-4 mr-2" /> Desativar</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
        {/* Pagination */}
        <div className="flex items-center justify-between px-6 py-3 border-t">
          <p className="text-sm text-muted-foreground">Mostrando 1-10 de 1.247 alunos</p>
          <div className="flex items-center gap-1">
            <Button variant="outline" size="icon" className="h-8 w-8"><ChevronLeft className="w-4 h-4" /></Button>
            <Button variant="default" size="icon" className="h-8 w-8">1</Button>
            <Button variant="outline" size="icon" className="h-8 w-8">2</Button>
            <Button variant="outline" size="icon" className="h-8 w-8">3</Button>
            <Button variant="outline" size="icon" className="h-8 w-8"><ChevronRight className="w-4 h-4" /></Button>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
