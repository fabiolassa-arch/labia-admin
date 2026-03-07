/*
 * Gestão de Usuários — Página exclusiva para Super Admin
 * CRUD completo: listar, cadastrar, editar, remover administradores
 * Design: Corporate Dashboard Minimal — tabela com filtros, modais e badges
 */
import { useState, useMemo } from "react";
import { useAuth, type UserRole, type AdminUser } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter,
  DialogHeader, DialogTitle
} from "@/components/ui/dialog";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle
} from "@/components/ui/alert-dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from "@/components/ui/select";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuSeparator, DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  Users, UserPlus, Search, MoreHorizontal, Pencil, Trash2,
  Shield, ShieldCheck, ShieldAlert, Mail, Calendar, School,
  Filter, Download, ChevronLeft, ChevronRight, Eye, KeyRound,
  CheckCircle2, XCircle, Clock
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

interface ManagedUser extends AdminUser {
  status: "ativo" | "inativo" | "pendente";
  criadoEm: string;
  senha?: string;
}

const INITIAL_USERS: ManagedUser[] = [
  {
    id: "1", nome: "Fabíola Lassa", email: "admin@labia.edu.br",
    role: "super_admin", status: "ativo",
    criadoEm: "2025-08-15", ultimoAcesso: "2026-03-07T10:30:00",
  },
  {
    id: "2", nome: "Carlos Mendes", email: "gestor@labia.edu.br",
    role: "gestor", escola: "Escola Nova Era", status: "ativo",
    criadoEm: "2025-09-20", ultimoAcesso: "2026-03-06T15:45:00",
  },
  {
    id: "3", nome: "Ana Silva", email: "professor@labia.edu.br",
    role: "professor", escola: "Instituto Tech Educação", status: "ativo",
    criadoEm: "2025-10-10", ultimoAcesso: "2026-03-07T08:20:00",
  },
  {
    id: "4", nome: "Roberto Almeida", email: "roberto@labia.edu.br",
    role: "gestor", escola: "Colégio Futuro Digital", status: "ativo",
    criadoEm: "2025-11-05", ultimoAcesso: "2026-03-05T14:10:00",
  },
  {
    id: "5", nome: "Mariana Costa", email: "mariana@labia.edu.br",
    role: "professor", escola: "Escola Nova Era", status: "ativo",
    criadoEm: "2025-12-01", ultimoAcesso: "2026-03-04T09:30:00",
  },
  {
    id: "6", nome: "Pedro Santos", email: "pedro@labia.edu.br",
    role: "professor", escola: "Colégio Futuro Digital", status: "inativo",
    criadoEm: "2026-01-10", ultimoAcesso: "2026-02-15T11:00:00",
  },
  {
    id: "7", nome: "Juliana Ferreira", email: "juliana@labia.edu.br",
    role: "gestor", escola: "Instituto Tech Educação", status: "pendente",
    criadoEm: "2026-02-28", ultimoAcesso: undefined,
  },
  {
    id: "8", nome: "Lucas Oliveira", email: "lucas.prof@labia.edu.br",
    role: "professor", escola: "Escola Nova Era", status: "ativo",
    criadoEm: "2026-01-20", ultimoAcesso: "2026-03-06T16:45:00",
  },
];

const ROLE_CONFIG: Record<UserRole, { label: string; icon: typeof Shield; color: string; bgColor: string; description: string }> = {
  super_admin: {
    label: "Super Admin", icon: ShieldAlert, color: "text-labia-purple",
    bgColor: "bg-labia-purple/10", description: "Acesso total ao sistema",
  },
  gestor: {
    label: "Gestor", icon: ShieldCheck, color: "text-labia-orange",
    bgColor: "bg-labia-orange/10", description: "Gerencia trilhas, missões e alunos",
  },
  professor: {
    label: "Professor(a)", icon: Shield, color: "text-labia-blue",
    bgColor: "bg-labia-blue/10", description: "Visualização e acompanhamento",
  },
};

const STATUS_CONFIG: Record<string, { label: string; icon: typeof CheckCircle2; color: string; bgColor: string }> = {
  ativo: { label: "Ativo", icon: CheckCircle2, color: "text-emerald-600", bgColor: "bg-emerald-50" },
  inativo: { label: "Inativo", icon: XCircle, color: "text-red-500", bgColor: "bg-red-50" },
  pendente: { label: "Pendente", icon: Clock, color: "text-amber-600", bgColor: "bg-amber-50" },
};

const ESCOLAS = [
  "Escola Nova Era",
  "Instituto Tech Educação",
  "Colégio Futuro Digital",
  "Escola Municipal Inovação",
  "Centro Educacional IA",
];

function formatDate(dateStr?: string) {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" });
}

function formatDateTime(dateStr?: string) {
  if (!dateStr) return "Nunca acessou";
  return new Date(dateStr).toLocaleDateString("pt-BR", {
    day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit",
  });
}

export default function Usuarios() {
  const { user: currentUser, hasPermission, getRoleLabel } = useAuth();
  const [users, setUsers] = useState<ManagedUser[]>(INITIAL_USERS);
  const [search, setSearch] = useState("");
  const [filterRole, setFilterRole] = useState<string>("todos");
  const [filterStatus, setFilterStatus] = useState<string>("todos");
  const [page, setPage] = useState(1);
  const perPage = 6;

  // Modal states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<ManagedUser | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    nome: "", email: "", role: "professor" as UserRole,
    escola: "", status: "ativo" as "ativo" | "inativo" | "pendente", senha: "",
  });

  // Permission check
  if (!hasPermission("usuarios.view")) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="text-center">
          <ShieldAlert className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Acesso restrito</h2>
          <p className="text-muted-foreground">Apenas Super Admins podem acessar a gestão de usuários.</p>
        </div>
      </div>
    );
  }

  // Filtered & paginated users
  const filtered = useMemo(() => {
    return users.filter((u) => {
      const matchSearch = u.nome.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase());
      const matchRole = filterRole === "todos" || u.role === filterRole;
      const matchStatus = filterStatus === "todos" || u.status === filterStatus;
      return matchSearch && matchRole && matchStatus;
    });
  }, [users, search, filterRole, filterStatus]);

  const totalPages = Math.ceil(filtered.length / perPage);
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);

  // Stats
  const stats = useMemo(() => ({
    total: users.length,
    superAdmins: users.filter((u) => u.role === "super_admin").length,
    gestores: users.filter((u) => u.role === "gestor").length,
    professores: users.filter((u) => u.role === "professor").length,
    ativos: users.filter((u) => u.status === "ativo").length,
    inativos: users.filter((u) => u.status === "inativo").length,
    pendentes: users.filter((u) => u.status === "pendente").length,
  }), [users]);

  const resetForm = () => {
    setFormData({ nome: "", email: "", role: "professor", escola: "", status: "ativo", senha: "" });
  };

  const handleCreate = () => {
    if (!formData.nome || !formData.email) {
      toast.error("Preencha nome e e-mail.");
      return;
    }
    if (users.some((u) => u.email.toLowerCase() === formData.email.toLowerCase())) {
      toast.error("Este e-mail já está cadastrado.");
      return;
    }
    const newUser: ManagedUser = {
      id: String(Date.now()),
      nome: formData.nome,
      email: formData.email,
      role: formData.role,
      escola: formData.escola || undefined,
      status: formData.status,
      criadoEm: new Date().toISOString().split("T")[0],
      ultimoAcesso: undefined,
    };
    setUsers((prev) => [newUser, ...prev]);
    setShowCreateModal(false);
    resetForm();
    toast.success(`Usuário ${newUser.nome} cadastrado com sucesso!`);
  };

  const handleEdit = () => {
    if (!selectedUser || !formData.nome || !formData.email) {
      toast.error("Preencha nome e e-mail.");
      return;
    }
    setUsers((prev) =>
      prev.map((u) =>
        u.id === selectedUser.id
          ? { ...u, nome: formData.nome, email: formData.email, role: formData.role, escola: formData.escola || undefined, status: formData.status }
          : u
      )
    );
    setShowEditModal(false);
    setSelectedUser(null);
    resetForm();
    toast.success("Usuário atualizado com sucesso!");
  };

  const handleDelete = () => {
    if (!selectedUser) return;
    if (selectedUser.id === currentUser?.id) {
      toast.error("Você não pode remover sua própria conta.");
      return;
    }
    setUsers((prev) => prev.filter((u) => u.id !== selectedUser.id));
    setShowDeleteDialog(false);
    setSelectedUser(null);
    toast.success(`Usuário ${selectedUser.nome} removido.`);
  };

  const openEdit = (user: ManagedUser) => {
    setSelectedUser(user);
    setFormData({
      nome: user.nome, email: user.email, role: user.role,
      escola: user.escola || "", status: user.status, senha: "",
    });
    setShowEditModal(true);
  };

  const openDetail = (user: ManagedUser) => {
    setSelectedUser(user);
    setShowDetailModal(true);
  };

  const openDelete = (user: ManagedUser) => {
    setSelectedUser(user);
    setShowDeleteDialog(true);
  };

  const getInitials = (name: string) =>
    name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase();

  const getRoleGradient = (role: UserRole) => {
    const gradients: Record<UserRole, string> = {
      super_admin: "from-[#7C3AED] to-[#6D28D9]",
      gestor: "from-[#F97316] to-[#EA580C]",
      professor: "from-[#3B82F6] to-[#2563EB]",
    };
    return gradients[role];
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold flex items-center gap-2">
            <Users className="w-6 h-6 text-labia-purple" />
            Gestão de Usuários
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Cadastre, edite e gerencie os administradores da plataforma
          </p>
        </div>
        {hasPermission("usuarios.create") && (
          <Button
            onClick={() => { resetForm(); setShowCreateModal(true); }}
            className="bg-gradient-to-r from-[#7C3AED] to-[#6D28D9] hover:from-[#6D28D9] hover:to-[#5B21B6] text-white shadow-lg shadow-purple-500/20"
          >
            <UserPlus className="w-4 h-4 mr-2" />
            Novo Usuário
          </Button>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total", value: stats.total, icon: Users, color: "text-foreground", bg: "bg-muted/50" },
          { label: "Super Admins", value: stats.superAdmins, icon: ShieldAlert, color: "text-labia-purple", bg: "bg-labia-purple/5" },
          { label: "Gestores", value: stats.gestores, icon: ShieldCheck, color: "text-labia-orange", bg: "bg-labia-orange/5" },
          { label: "Professores", value: stats.professores, icon: Shield, color: "text-labia-blue", bg: "bg-labia-blue/5" },
        ].map((stat) => (
          <Card key={stat.label} className="border shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground font-medium">{stat.label}</p>
                  <p className={`text-2xl font-bold mt-1 ${stat.color}`}>{stat.value}</p>
                </div>
                <div className={`w-10 h-10 rounded-lg ${stat.bg} flex items-center justify-center`}>
                  <stat.icon className={`w-5 h-5 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <Card className="border shadow-sm">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por nome ou e-mail..."
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                className="pl-9"
              />
            </div>
            <Select value={filterRole} onValueChange={(v) => { setFilterRole(v); setPage(1); }}>
              <SelectTrigger className="w-full sm:w-44">
                <Filter className="w-4 h-4 mr-2 text-muted-foreground" />
                <SelectValue placeholder="Nível" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos os níveis</SelectItem>
                <SelectItem value="super_admin">Super Admin</SelectItem>
                <SelectItem value="gestor">Gestor</SelectItem>
                <SelectItem value="professor">Professor(a)</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterStatus} onValueChange={(v) => { setFilterStatus(v); setPage(1); }}>
              <SelectTrigger className="w-full sm:w-40">
                <Filter className="w-4 h-4 mr-2 text-muted-foreground" />
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos os status</SelectItem>
                <SelectItem value="ativo">Ativo</SelectItem>
                <SelectItem value="inativo">Inativo</SelectItem>
                <SelectItem value="pendente">Pendente</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card className="border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-muted/30">
                <th className="text-left text-xs font-semibold text-muted-foreground px-4 py-3">Usuário</th>
                <th className="text-left text-xs font-semibold text-muted-foreground px-4 py-3 hidden md:table-cell">Nível</th>
                <th className="text-left text-xs font-semibold text-muted-foreground px-4 py-3 hidden lg:table-cell">Escola</th>
                <th className="text-left text-xs font-semibold text-muted-foreground px-4 py-3 hidden sm:table-cell">Status</th>
                <th className="text-left text-xs font-semibold text-muted-foreground px-4 py-3 hidden xl:table-cell">Último acesso</th>
                <th className="text-right text-xs font-semibold text-muted-foreground px-4 py-3">Ações</th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {paginated.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-12 text-muted-foreground">
                      <Users className="w-10 h-10 mx-auto mb-3 opacity-30" />
                      <p className="font-medium">Nenhum usuário encontrado</p>
                      <p className="text-sm mt-1">Tente ajustar os filtros de busca</p>
                    </td>
                  </tr>
                ) : (
                  paginated.map((u, i) => {
                    const roleConf = ROLE_CONFIG[u.role];
                    const statusConf = STATUS_CONFIG[u.status];
                    const isSelf = u.id === currentUser?.id;
                    return (
                      <motion.tr
                        key={u.id}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ delay: i * 0.03 }}
                        className="border-b last:border-0 hover:bg-muted/20 transition-colors"
                      >
                        {/* User info */}
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-9 w-9">
                              <AvatarFallback className={`bg-gradient-to-br ${getRoleGradient(u.role)} text-white text-xs font-semibold`}>
                                {getInitials(u.nome)}
                              </AvatarFallback>
                            </Avatar>
                            <div className="min-w-0">
                              <p className="text-sm font-semibold truncate flex items-center gap-1.5">
                                {u.nome}
                                {isSelf && (
                                  <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-full bg-labia-purple/10 text-labia-purple">
                                    Você
                                  </span>
                                )}
                              </p>
                              <p className="text-xs text-muted-foreground truncate">{u.email}</p>
                            </div>
                          </div>
                        </td>

                        {/* Role */}
                        <td className="px-4 py-3 hidden md:table-cell">
                          <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full ${roleConf.bgColor} ${roleConf.color}`}>
                            <roleConf.icon className="w-3 h-3" />
                            {roleConf.label}
                          </span>
                        </td>

                        {/* School */}
                        <td className="px-4 py-3 hidden lg:table-cell">
                          <span className="text-sm text-muted-foreground">{u.escola || "—"}</span>
                        </td>

                        {/* Status */}
                        <td className="px-4 py-3 hidden sm:table-cell">
                          <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full ${statusConf.bgColor} ${statusConf.color}`}>
                            <statusConf.icon className="w-3 h-3" />
                            {statusConf.label}
                          </span>
                        </td>

                        {/* Last access */}
                        <td className="px-4 py-3 hidden xl:table-cell">
                          <span className="text-xs text-muted-foreground">{formatDateTime(u.ultimoAcesso)}</span>
                        </td>

                        {/* Actions */}
                        <td className="px-4 py-3 text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreHorizontal className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-44">
                              <DropdownMenuItem onClick={() => openDetail(u)}>
                                <Eye className="w-4 h-4 mr-2" />
                                Ver detalhes
                              </DropdownMenuItem>
                              {hasPermission("usuarios.edit") && (
                                <DropdownMenuItem onClick={() => openEdit(u)}>
                                  <Pencil className="w-4 h-4 mr-2" />
                                  Editar
                                </DropdownMenuItem>
                              )}
                              {hasPermission("usuarios.edit") && (
                                <DropdownMenuItem onClick={() => toast.info("Funcionalidade em desenvolvimento.")}>
                                  <KeyRound className="w-4 h-4 mr-2" />
                                  Redefinir senha
                                </DropdownMenuItem>
                              )}
                              {hasPermission("usuarios.delete") && !isSelf && (
                                <>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem className="text-destructive" onClick={() => openDelete(u)}>
                                    <Trash2 className="w-4 h-4 mr-2" />
                                    Remover
                                  </DropdownMenuItem>
                                </>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>
                      </motion.tr>
                    );
                  })
                )}
              </AnimatePresence>
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t bg-muted/10">
            <p className="text-xs text-muted-foreground">
              Mostrando {(page - 1) * perPage + 1}–{Math.min(page * perPage, filtered.length)} de {filtered.length}
            </p>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost" size="icon" className="h-8 w-8"
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <Button
                  key={p}
                  variant={p === page ? "default" : "ghost"}
                  size="icon"
                  className={`h-8 w-8 text-xs ${p === page ? "bg-labia-purple text-white hover:bg-labia-purple/90" : ""}`}
                  onClick={() => setPage(p)}
                >
                  {p}
                </Button>
              ))}
              <Button
                variant="ghost" size="icon" className="h-8 w-8"
                disabled={page === totalPages}
                onClick={() => setPage((p) => p + 1)}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}
      </Card>

      {/* ===== CREATE MODAL ===== */}
      <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <UserPlus className="w-5 h-5 text-labia-purple" />
              Novo Usuário
            </DialogTitle>
            <DialogDescription>
              Cadastre um novo administrador na plataforma
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2 sm:col-span-2">
                <Label>Nome completo *</Label>
                <Input
                  placeholder="Nome do administrador"
                  value={formData.nome}
                  onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label>E-mail *</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    type="email"
                    placeholder="email@labia.edu.br"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="pl-9"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Nível de acesso *</Label>
                <Select value={formData.role} onValueChange={(v) => setFormData({ ...formData, role: v as UserRole })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(ROLE_CONFIG).map(([key, conf]) => (
                      <SelectItem key={key} value={key}>
                        <div className="flex items-center gap-2">
                          <conf.icon className={`w-4 h-4 ${conf.color}`} />
                          {conf.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Escola (opcional)</Label>
                <Select value={formData.escola || "nenhuma"} onValueChange={(v) => setFormData({ ...formData, escola: v === "nenhuma" ? "" : v })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="nenhuma">Nenhuma</SelectItem>
                    {ESCOLAS.map((e) => (
                      <SelectItem key={e} value={e}>{e}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label>Senha temporária *</Label>
                <div className="relative">
                  <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Senha inicial do usuário"
                    value={formData.senha}
                    onChange={(e) => setFormData({ ...formData, senha: e.target.value })}
                    className="pl-9"
                  />
                </div>
                <p className="text-[11px] text-muted-foreground">O usuário deverá alterar no primeiro acesso.</p>
              </div>
            </div>

            {/* Permission preview */}
            <div className="rounded-lg border bg-muted/30 p-3">
              <p className="text-xs font-semibold text-muted-foreground mb-2 flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5" />
                Permissões do nível "{ROLE_CONFIG[formData.role].label}"
              </p>
              <p className="text-xs text-muted-foreground">{ROLE_CONFIG[formData.role].description}</p>
              <div className="flex flex-wrap gap-1.5 mt-2">
                {formData.role === "super_admin" && (
                  <Badge variant="outline" className="text-[10px]">Acesso total a todos os módulos</Badge>
                )}
                {formData.role === "gestor" && (
                  <>
                    <Badge variant="outline" className="text-[10px]">Dashboard</Badge>
                    <Badge variant="outline" className="text-[10px]">Trilhas (criar/editar)</Badge>
                    <Badge variant="outline" className="text-[10px]">Missões (criar/editar)</Badge>
                    <Badge variant="outline" className="text-[10px]">Alunos (criar/editar/exportar)</Badge>
                    <Badge variant="outline" className="text-[10px]">Escolas (ver)</Badge>
                    <Badge variant="outline" className="text-[10px]">Relatórios</Badge>
                  </>
                )}
                {formData.role === "professor" && (
                  <>
                    <Badge variant="outline" className="text-[10px]">Dashboard (ver)</Badge>
                    <Badge variant="outline" className="text-[10px]">Trilhas (ver)</Badge>
                    <Badge variant="outline" className="text-[10px]">Missões (ver)</Badge>
                    <Badge variant="outline" className="text-[10px]">Alunos (ver)</Badge>
                    <Badge variant="outline" className="text-[10px]">Relatórios (ver)</Badge>
                  </>
                )}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreateModal(false)}>Cancelar</Button>
            <Button
              onClick={handleCreate}
              className="bg-gradient-to-r from-[#7C3AED] to-[#6D28D9] text-white"
            >
              <UserPlus className="w-4 h-4 mr-2" />
              Cadastrar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ===== EDIT MODAL ===== */}
      <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Pencil className="w-5 h-5 text-labia-orange" />
              Editar Usuário
            </DialogTitle>
            <DialogDescription>
              Atualize as informações de {selectedUser?.nome}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2 sm:col-span-2">
                <Label>Nome completo *</Label>
                <Input
                  value={formData.nome}
                  onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label>E-mail *</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="pl-9"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Nível de acesso</Label>
                <Select value={formData.role} onValueChange={(v) => setFormData({ ...formData, role: v as UserRole })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(ROLE_CONFIG).map(([key, conf]) => (
                      <SelectItem key={key} value={key}>
                        <div className="flex items-center gap-2">
                          <conf.icon className={`w-4 h-4 ${conf.color}`} />
                          {conf.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Status</Label>
                <Select value={formData.status} onValueChange={(v) => setFormData({ ...formData, status: v as "ativo" | "inativo" | "pendente" })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ativo">Ativo</SelectItem>
                    <SelectItem value="inativo">Inativo</SelectItem>
                    <SelectItem value="pendente">Pendente</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label>Escola</Label>
                <Select value={formData.escola || "nenhuma"} onValueChange={(v) => setFormData({ ...formData, escola: v === "nenhuma" ? "" : v })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="nenhuma">Nenhuma</SelectItem>
                    {ESCOLAS.map((e) => (
                      <SelectItem key={e} value={e}>{e}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditModal(false)}>Cancelar</Button>
            <Button
              onClick={handleEdit}
              className="bg-gradient-to-r from-[#F97316] to-[#EA580C] text-white"
            >
              <CheckCircle2 className="w-4 h-4 mr-2" />
              Salvar alterações
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ===== DELETE DIALOG ===== */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-destructive">
              <Trash2 className="w-5 h-5" />
              Remover usuário
            </AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja remover <strong>{selectedUser?.nome}</strong> ({selectedUser?.email})?
              Esta ação não pode ser desfeita e o usuário perderá acesso ao painel imediatamente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Remover
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* ===== DETAIL MODAL ===== */}
      <Dialog open={showDetailModal} onOpenChange={setShowDetailModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Detalhes do Usuário</DialogTitle>
          </DialogHeader>
          {selectedUser && (() => {
            const roleConf = ROLE_CONFIG[selectedUser.role];
            const statusConf = STATUS_CONFIG[selectedUser.status];
            return (
              <div className="space-y-5 py-2">
                {/* Profile header */}
                <div className="flex items-center gap-4">
                  <Avatar className="h-14 w-14">
                    <AvatarFallback className={`bg-gradient-to-br ${getRoleGradient(selectedUser.role)} text-white text-lg font-bold`}>
                      {getInitials(selectedUser.nome)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold text-lg">{selectedUser.nome}</h3>
                    <p className="text-sm text-muted-foreground">{selectedUser.email}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full ${roleConf.bgColor} ${roleConf.color}`}>
                        <roleConf.icon className="w-3 h-3" />
                        {roleConf.label}
                      </span>
                      <span className={`inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full ${statusConf.bgColor} ${statusConf.color}`}>
                        <statusConf.icon className="w-3 h-3" />
                        {statusConf.label}
                      </span>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Details */}
                <div className="space-y-3">
                  {[
                    { icon: Mail, label: "E-mail", value: selectedUser.email },
                    { icon: Shield, label: "Nível de acesso", value: roleConf.label },
                    { icon: School, label: "Escola", value: selectedUser.escola || "Não vinculado" },
                    { icon: Calendar, label: "Cadastrado em", value: formatDate(selectedUser.criadoEm) },
                    { icon: Clock, label: "Último acesso", value: formatDateTime(selectedUser.ultimoAcesso) },
                  ].map((item) => (
                    <div key={item.label} className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-muted/50 flex items-center justify-center shrink-0">
                        <item.icon className="w-4 h-4 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="text-[11px] text-muted-foreground">{item.label}</p>
                        <p className="text-sm font-medium">{item.value}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <Separator />

                {/* Permissions */}
                <div>
                  <p className="text-xs font-semibold text-muted-foreground mb-2">Permissões</p>
                  <p className="text-xs text-muted-foreground mb-2">{roleConf.description}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedUser.role === "super_admin" && (
                      <Badge className="text-[10px] bg-labia-purple/10 text-labia-purple hover:bg-labia-purple/20">Acesso total</Badge>
                    )}
                    {selectedUser.role === "gestor" && (
                      <>
                        <Badge variant="outline" className="text-[10px]">Dashboard</Badge>
                        <Badge variant="outline" className="text-[10px]">Trilhas</Badge>
                        <Badge variant="outline" className="text-[10px]">Missões</Badge>
                        <Badge variant="outline" className="text-[10px]">Alunos</Badge>
                        <Badge variant="outline" className="text-[10px]">Relatórios</Badge>
                      </>
                    )}
                    {selectedUser.role === "professor" && (
                      <>
                        <Badge variant="outline" className="text-[10px]">Dashboard (ver)</Badge>
                        <Badge variant="outline" className="text-[10px]">Trilhas (ver)</Badge>
                        <Badge variant="outline" className="text-[10px]">Alunos (ver)</Badge>
                        <Badge variant="outline" className="text-[10px]">Relatórios (ver)</Badge>
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })()}
          <DialogFooter>
            {hasPermission("usuarios.edit") && selectedUser && (
              <Button variant="outline" onClick={() => { setShowDetailModal(false); openEdit(selectedUser); }}>
                <Pencil className="w-4 h-4 mr-2" />
                Editar
              </Button>
            )}
            <Button onClick={() => setShowDetailModal(false)}>Fechar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
