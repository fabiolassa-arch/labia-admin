/*
 * Gestão de Escolas — Cards de escolas com métricas e detalhes
 */
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Plus, Search, School, Users, Target, TrendingUp, MapPin, Phone, Mail,
  MoreHorizontal, Pencil, Trash2, Eye, Calendar
} from "lucide-react";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { motion } from "framer-motion";
import { toast } from "sonner";

const escolasData = [
  {
    id: 1, nome: "Escola Nova Era", cidade: "Salvador, BA", alunos: 245, professores: 12,
    progresso: 78, missoesConcluidas: 1890, status: "ativa", plano: "Premium",
    contato: "direcao@novaera.edu.br", telefone: "(71) 3333-1234", dataAdesao: "Mar 2025"
  },
  {
    id: 2, nome: "Colégio Futuro", cidade: "São Paulo, SP", alunos: 189, professores: 8,
    progresso: 65, missoesConcluidas: 1245, status: "ativa", plano: "Premium",
    contato: "coord@futuro.edu.br", telefone: "(11) 4444-5678", dataAdesao: "Abr 2025"
  },
  {
    id: 3, nome: "Instituto Tech", cidade: "Curitiba, PR", alunos: 156, professores: 6,
    progresso: 82, missoesConcluidas: 1567, status: "ativa", plano: "Básico",
    contato: "admin@institutotech.edu.br", telefone: "(41) 5555-9012", dataAdesao: "Mai 2025"
  },
  {
    id: 4, nome: "Escola Criativa", cidade: "Rio de Janeiro, RJ", alunos: 134, professores: 7,
    progresso: 71, missoesConcluidas: 980, status: "ativa", plano: "Básico",
    contato: "secretaria@criativa.edu.br", telefone: "(21) 6666-3456", dataAdesao: "Jun 2025"
  },
  {
    id: 5, nome: "Colégio Inovação", cidade: "Belo Horizonte, MG", alunos: 98, professores: 4,
    progresso: 45, missoesConcluidas: 456, status: "ativa", plano: "Básico",
    contato: "coord@inovacao.edu.br", telefone: "(31) 7777-7890", dataAdesao: "Jul 2025"
  },
  {
    id: 6, nome: "Escola Digital", cidade: "Recife, PE", alunos: 67, professores: 3,
    progresso: 23, missoesConcluidas: 178, status: "teste", plano: "Trial",
    contato: "admin@digital.edu.br", telefone: "(81) 8888-1234", dataAdesao: "Fev 2026"
  },
];

const metrics = [
  { label: "Total de Escolas", value: "18", icon: School, color: "text-labia-purple", bg: "bg-labia-purple/10" },
  { label: "Total de Alunos", value: "1.247", icon: Users, color: "text-labia-green", bg: "bg-labia-green/10" },
  { label: "Missões Concluídas", value: "8.432", icon: Target, color: "text-labia-orange", bg: "bg-labia-orange/10" },
  { label: "Progresso Médio", value: "61%", icon: TrendingUp, color: "text-labia-blue", bg: "bg-labia-blue/10" },
];

const planoColors: Record<string, string> = {
  Premium: "bg-labia-purple/10 text-labia-purple",
  "Básico": "bg-labia-blue/10 text-labia-blue",
  Trial: "bg-labia-orange/10 text-labia-orange",
};

export default function Escolas() {
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);

  const filtered = escolasData.filter(e =>
    e.nome.toLowerCase().includes(search.toLowerCase()) || e.cidade.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display font-bold text-2xl">Escolas</h1>
          <p className="text-muted-foreground text-sm mt-1">Gerencie as escolas parceiras e seus planos</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary hover:bg-primary/90">
              <Plus className="w-4 h-4 mr-2" /> Nova Escola
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Cadastrar Nova Escola</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Nome da Escola</Label>
                <Input placeholder="Ex: Escola Municipal XYZ" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Cidade</Label>
                  <Input placeholder="Ex: Salvador, BA" />
                </div>
                <div className="space-y-2">
                  <Label>Telefone</Label>
                  <Input placeholder="(00) 0000-0000" />
                </div>
              </div>
              <div className="space-y-2">
                <Label>E-mail de contato</Label>
                <Input type="email" placeholder="contato@escola.edu.br" />
              </div>
              <div className="space-y-2">
                <Label>Observações</Label>
                <Textarea placeholder="Informações adicionais..." rows={2} />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancelar</Button>
              <Button onClick={() => { setDialogOpen(false); toast.success("Escola cadastrada com sucesso!"); }}>
                Cadastrar
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

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Buscar escola ou cidade..."
          className="pl-9"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* School Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map((e) => (
          <motion.div key={e.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
            <Card className="hover:shadow-md transition-shadow h-full">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#7C3AED]/20 to-[#F97316]/20 flex items-center justify-center">
                      <School className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-base">{e.nome}</CardTitle>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
                        <MapPin className="w-3 h-3" /> {e.cidade}
                      </div>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem><Eye className="w-4 h-4 mr-2" /> Detalhes</DropdownMenuItem>
                      <DropdownMenuItem><Pencil className="w-4 h-4 mr-2" /> Editar</DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive"><Trash2 className="w-4 h-4 mr-2" /> Remover</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Badges */}
                <div className="flex items-center gap-2">
                  <Badge className={`text-[11px] ${planoColors[e.plano]}`}>{e.plano}</Badge>
                  <Badge variant={e.status === "ativa" ? "default" : "secondary"} className="text-[11px]">
                    {e.status === "ativa" ? "Ativa" : "Teste"}
                  </Badge>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="text-center p-2 rounded-lg bg-muted/50">
                    <p className="text-lg font-bold">{e.alunos}</p>
                    <p className="text-[10px] text-muted-foreground">Alunos</p>
                  </div>
                  <div className="text-center p-2 rounded-lg bg-muted/50">
                    <p className="text-lg font-bold">{e.professores}</p>
                    <p className="text-[10px] text-muted-foreground">Professores</p>
                  </div>
                  <div className="text-center p-2 rounded-lg bg-muted/50">
                    <p className="text-lg font-bold">{e.missoesConcluidas}</p>
                    <p className="text-[10px] text-muted-foreground">Missões</p>
                  </div>
                </div>

                {/* Progress */}
                <div>
                  <div className="flex items-center justify-between text-sm mb-1.5">
                    <span className="text-muted-foreground">Progresso médio</span>
                    <span className="font-semibold">{e.progresso}%</span>
                  </div>
                  <Progress value={e.progresso} className="h-2" />
                </div>

                {/* Contact */}
                <div className="space-y-1.5 pt-2 border-t">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Mail className="w-3 h-3" /> {e.contato}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Phone className="w-3 h-3" /> {e.telefone}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Calendar className="w-3 h-3" /> Desde {e.dataAdesao}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
