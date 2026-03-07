/*
 * Página de Log de Auditoria — Timeline de ações dos administradores
 * Design: Corporate Dashboard Minimal — sidebar escura + conteúdo claro
 */
import { useState, useMemo } from "react";
import {
  useAudit, ACTION_LABELS, CATEGORY_LABELS, SEVERITY_CONFIG,
  type AuditEntry, type AuditCategory, type AuditSeverity
} from "@/contexts/AuditContext";
import { useAuth } from "@/contexts/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription
} from "@/components/ui/dialog";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle
} from "@/components/ui/alert-dialog";
import {
  ScrollText, Search, Filter, Download, Trash2, ChevronDown, ChevronUp,
  User, Shield, Clock, MapPin, Eye, AlertTriangle, Info, XCircle,
  Users, Route, Target, School, BarChart3, Settings, LogIn, FileText,
  Calendar, ArrowUpDown, ChevronLeft, ChevronRight
} from "lucide-react";
import { toast } from "sonner";

const CATEGORY_ICONS: Record<AuditCategory, typeof Users> = {
  usuarios: Users,
  trilhas: Route,
  missoes: Target,
  alunos: Users,
  escolas: School,
  configuracoes: Settings,
  relatorios: BarChart3,
  autenticacao: LogIn,
};

const CATEGORY_COLORS: Record<AuditCategory, string> = {
  usuarios: "bg-purple-100 text-purple-700",
  trilhas: "bg-blue-100 text-blue-700",
  missoes: "bg-orange-100 text-orange-700",
  alunos: "bg-green-100 text-green-700",
  escolas: "bg-teal-100 text-teal-700",
  configuracoes: "bg-gray-100 text-gray-700",
  relatorios: "bg-indigo-100 text-indigo-700",
  autenticacao: "bg-amber-100 text-amber-700",
};

const SEVERITY_ICONS: Record<AuditSeverity, typeof Info> = {
  info: Info,
  warning: AlertTriangle,
  critical: XCircle,
};

const ITEMS_PER_PAGE = 10;

function formatTimestamp(ts: string): string {
  const d = new Date(ts);
  const now = new Date();
  const diff = now.getTime() - d.getTime();
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (mins < 1) return "Agora mesmo";
  if (mins < 60) return `Há ${mins} min`;
  if (hours < 24) return `Há ${hours}h`;
  if (days === 1) return "Ontem";
  if (days < 7) return `Há ${days} dias`;
  return d.toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" });
}

function formatFullDate(ts: string): string {
  return new Date(ts).toLocaleString("pt-BR", {
    day: "2-digit", month: "long", year: "numeric",
    hour: "2-digit", minute: "2-digit", second: "2-digit"
  });
}

function groupLogsByDate(logs: AuditEntry[]): Record<string, AuditEntry[]> {
  const groups: Record<string, AuditEntry[]> = {};
  logs.forEach((log) => {
    const d = new Date(log.timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    let key: string;
    if (d.toDateString() === today.toDateString()) key = "Hoje";
    else if (d.toDateString() === yesterday.toDateString()) key = "Ontem";
    else key = d.toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" });

    if (!groups[key]) groups[key] = [];
    groups[key].push(log);
  });
  return groups;
}

export default function Auditoria() {
  const { logs, clearLogs } = useAudit();
  const { hasPermission } = useAuth();
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [severityFilter, setSeverityFilter] = useState<string>("all");
  const [userFilter, setUserFilter] = useState<string>("all");
  const [sortOrder, setSortOrder] = useState<"desc" | "asc">("desc");
  const [page, setPage] = useState(1);
  const [selectedLog, setSelectedLog] = useState<AuditEntry | null>(null);
  const [showClearDialog, setShowClearDialog] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Unique users for filter
  const uniqueUsers = useMemo(() => {
    const map = new Map<string, string>();
    logs.forEach((l) => { if (l.userId !== "unknown") map.set(l.userId, l.userName); });
    return Array.from(map, ([id, name]) => ({ id, name }));
  }, [logs]);

  // Filtered & sorted logs
  const filtered = useMemo(() => {
    let result = [...logs];

    if (search) {
      const q = search.toLowerCase();
      result = result.filter((l) =>
        l.description.toLowerCase().includes(q) ||
        l.userName.toLowerCase().includes(q) ||
        (l.targetName && l.targetName.toLowerCase().includes(q)) ||
        ACTION_LABELS[l.action].toLowerCase().includes(q)
      );
    }
    if (categoryFilter !== "all") result = result.filter((l) => l.category === categoryFilter);
    if (severityFilter !== "all") result = result.filter((l) => l.severity === severityFilter);
    if (userFilter !== "all") result = result.filter((l) => l.userId === userFilter);

    result.sort((a, b) => {
      const cmp = new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
      return sortOrder === "desc" ? -cmp : cmp;
    });

    return result;
  }, [logs, search, categoryFilter, severityFilter, userFilter, sortOrder]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const paged = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);
  const grouped = groupLogsByDate(paged);

  // Stats
  const stats = useMemo(() => {
    const today = new Date().toDateString();
    const todayLogs = logs.filter((l) => new Date(l.timestamp).toDateString() === today);
    return {
      total: logs.length,
      today: todayLogs.length,
      warnings: logs.filter((l) => l.severity === "warning").length,
      critical: logs.filter((l) => l.severity === "critical").length,
    };
  }, [logs]);

  const handleExport = () => {
    const csv = [
      "Data/Hora,Ação,Categoria,Severidade,Usuário,Nível,Descrição,Alvo,IP",
      ...filtered.map((l) =>
        `"${formatFullDate(l.timestamp)}","${ACTION_LABELS[l.action]}","${CATEGORY_LABELS[l.category]}","${SEVERITY_CONFIG[l.severity].label}","${l.userName}","${l.userRole}","${l.description}","${l.targetName || "—"}","${l.ip || "—"}"`
      ),
    ].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `auditoria_labia_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Log de auditoria exportado com sucesso!");
  };

  const handleClear = () => {
    clearLogs();
    setShowClearDialog(false);
    setPage(1);
    toast.success("Logs de auditoria limpos com sucesso.");
  };

  const activeFilters = [categoryFilter, severityFilter, userFilter].filter((f) => f !== "all").length + (search ? 1 : 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#7C3AED] to-[#F97316] flex items-center justify-center">
              <ScrollText className="w-5 h-5 text-white" />
            </div>
            Log de Auditoria
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Registro completo de todas as ações realizadas no painel administrativo
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleExport} className="gap-2">
            <Download className="w-4 h-4" /> Exportar CSV
          </Button>
          {hasPermission("configuracoes.edit") && (
            <Button variant="outline" size="sm" onClick={() => setShowClearDialog(true)} className="gap-2 text-destructive hover:text-destructive">
              <Trash2 className="w-4 h-4" /> Limpar
            </Button>
          )}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total de registros", value: stats.total, icon: FileText, color: "text-blue-600", bg: "bg-blue-50" },
          { label: "Ações hoje", value: stats.today, icon: Calendar, color: "text-green-600", bg: "bg-green-50" },
          { label: "Avisos", value: stats.warnings, icon: AlertTriangle, color: "text-amber-600", bg: "bg-amber-50" },
          { label: "Ações críticas", value: stats.critical, icon: XCircle, color: "text-red-600", bg: "bg-red-50" },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="bg-card rounded-xl border border-border p-4"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground font-medium">{stat.label}</p>
                <p className="text-2xl font-bold mt-1">{stat.value}</p>
              </div>
              <div className={`w-10 h-10 rounded-lg ${stat.bg} flex items-center justify-center`}>
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-card rounded-xl border border-border p-4">
        <div className="flex flex-col lg:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por descrição, usuário ou alvo..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="pl-9"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <Select value={categoryFilter} onValueChange={(v) => { setCategoryFilter(v); setPage(1); }}>
              <SelectTrigger className="w-[160px]">
                <Filter className="w-3.5 h-3.5 mr-1.5 text-muted-foreground" />
                <SelectValue placeholder="Categoria" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas categorias</SelectItem>
                {Object.entries(CATEGORY_LABELS).map(([k, v]) => (
                  <SelectItem key={k} value={k}>{v}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={severityFilter} onValueChange={(v) => { setSeverityFilter(v); setPage(1); }}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Severidade" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas</SelectItem>
                <SelectItem value="info">Info</SelectItem>
                <SelectItem value="warning">Atenção</SelectItem>
                <SelectItem value="critical">Crítico</SelectItem>
              </SelectContent>
            </Select>

            <Select value={userFilter} onValueChange={(v) => { setUserFilter(v); setPage(1); }}>
              <SelectTrigger className="w-[160px]">
                <User className="w-3.5 h-3.5 mr-1.5 text-muted-foreground" />
                <SelectValue placeholder="Usuário" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos usuários</SelectItem>
                {uniqueUsers.map((u) => (
                  <SelectItem key={u.id} value={u.id}>{u.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button
              variant="ghost" size="icon"
              onClick={() => setSortOrder((o) => o === "desc" ? "asc" : "desc")}
              className="shrink-0"
              title={sortOrder === "desc" ? "Mais recentes primeiro" : "Mais antigos primeiro"}
            >
              <ArrowUpDown className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {activeFilters > 0 && (
          <div className="flex items-center gap-2 mt-3 pt-3 border-t border-border">
            <span className="text-xs text-muted-foreground">
              {filtered.length} resultado{filtered.length !== 1 ? "s" : ""} encontrado{filtered.length !== 1 ? "s" : ""}
            </span>
            <Button
              variant="ghost" size="sm"
              className="text-xs h-6 px-2"
              onClick={() => { setSearch(""); setCategoryFilter("all"); setSeverityFilter("all"); setUserFilter("all"); setPage(1); }}
            >
              Limpar filtros
            </Button>
          </div>
        )}
      </div>

      {/* Timeline */}
      <div className="space-y-6">
        {Object.keys(grouped).length === 0 ? (
          <div className="bg-card rounded-xl border border-border p-12 text-center">
            <ScrollText className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
            <p className="text-muted-foreground font-medium">Nenhum registro encontrado</p>
            <p className="text-sm text-muted-foreground/70 mt-1">Ajuste os filtros ou aguarde novas ações.</p>
          </div>
        ) : (
          Object.entries(grouped).map(([dateLabel, entries]) => (
            <div key={dateLabel}>
              {/* Date header */}
              <div className="flex items-center gap-3 mb-3">
                <div className="flex items-center gap-2 px-3 py-1.5 bg-muted rounded-full">
                  <Calendar className="w-3.5 h-3.5 text-muted-foreground" />
                  <span className="text-xs font-semibold text-muted-foreground">{dateLabel}</span>
                </div>
                <div className="flex-1 h-px bg-border" />
              </div>

              {/* Log entries */}
              <div className="space-y-2 ml-2">
                {entries.map((entry, idx) => {
                  const CatIcon = CATEGORY_ICONS[entry.category];
                  const SevIcon = SEVERITY_ICONS[entry.severity];
                  const sevConfig = SEVERITY_CONFIG[entry.severity];
                  const isExpanded = expandedId === entry.id;

                  return (
                    <motion.div
                      key={entry.id}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.03 }}
                      className={`
                        relative bg-card rounded-xl border transition-all duration-200
                        ${entry.severity === "critical" ? "border-red-200 bg-red-50/30" :
                          entry.severity === "warning" ? "border-amber-200/60" : "border-border"}
                        hover:shadow-sm
                      `}
                    >
                      {/* Timeline dot */}
                      <div className={`absolute -left-[17px] top-5 w-3 h-3 rounded-full border-2 border-card
                        ${entry.severity === "critical" ? "bg-red-500" :
                          entry.severity === "warning" ? "bg-amber-500" : "bg-blue-500"}`}
                      />

                      <div
                        className="p-4 cursor-pointer"
                        onClick={() => setExpandedId(isExpanded ? null : entry.id)}
                      >
                        <div className="flex items-start gap-3">
                          {/* Category icon */}
                          <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${CATEGORY_COLORS[entry.category]}`}>
                            <CatIcon className="w-4.5 h-4.5" />
                          </div>

                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-sm font-semibold text-foreground">
                                {ACTION_LABELS[entry.action]}
                              </span>
                              <span className={`inline-flex items-center gap-1 text-[10px] font-medium px-1.5 py-0.5 rounded-full ${sevConfig.bgColor} ${sevConfig.color}`}>
                                <SevIcon className="w-2.5 h-2.5" />
                                {sevConfig.label}
                              </span>
                            </div>
                            <p className="text-sm text-muted-foreground mt-0.5 line-clamp-1">
                              {entry.description}
                            </p>
                            <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <User className="w-3 h-3" />
                                {entry.userName}
                              </span>
                              <span className="flex items-center gap-1">
                                <Shield className="w-3 h-3" />
                                {entry.userRole === "super_admin" ? "Super Admin" :
                                  entry.userRole === "gestor" ? "Gestor" :
                                  entry.userRole === "professor" ? "Professor(a)" : entry.userRole}
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {formatTimestamp(entry.timestamp)}
                              </span>
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="flex items-center gap-1 shrink-0">
                            <Button
                              variant="ghost" size="icon" className="h-8 w-8"
                              onClick={(e) => { e.stopPropagation(); setSelectedLog(entry); }}
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                            {isExpanded ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
                          </div>
                        </div>

                        {/* Expanded details */}
                        <AnimatePresence>
                          {isExpanded && entry.details && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.2 }}
                              className="overflow-hidden"
                            >
                              <div className="mt-3 pt-3 border-t border-border">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                  {Object.entries(entry.details).map(([key, value]) => (
                                    <div key={key} className="flex gap-2 text-xs">
                                      <span className="text-muted-foreground font-medium shrink-0">{key}:</span>
                                      <span className="text-foreground">{value}</span>
                                    </div>
                                  ))}
                                  {entry.targetName && (
                                    <div className="flex gap-2 text-xs">
                                      <span className="text-muted-foreground font-medium shrink-0">Alvo:</span>
                                      <span className="text-foreground">{entry.targetName}</span>
                                    </div>
                                  )}
                                  {entry.ip && (
                                    <div className="flex gap-2 text-xs">
                                      <span className="text-muted-foreground font-medium shrink-0">IP:</span>
                                      <span className="text-foreground font-mono">{entry.ip}</span>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between bg-card rounded-xl border border-border px-4 py-3">
          <p className="text-sm text-muted-foreground">
            Mostrando {(page - 1) * ITEMS_PER_PAGE + 1}–{Math.min(page * ITEMS_PER_PAGE, filtered.length)} de {filtered.length}
          </p>
          <div className="flex items-center gap-1">
            <Button variant="outline" size="icon" className="h-8 w-8" disabled={page <= 1} onClick={() => setPage(page - 1)}>
              <ChevronLeft className="w-4 h-4" />
            </Button>
            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
              const p = page <= 3 ? i + 1 : page + i - 2;
              if (p < 1 || p > totalPages) return null;
              return (
                <Button
                  key={p}
                  variant={p === page ? "default" : "outline"}
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setPage(p)}
                >
                  {p}
                </Button>
              );
            })}
            <Button variant="outline" size="icon" className="h-8 w-8" disabled={page >= totalPages} onClick={() => setPage(page + 1)}>
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      <Dialog open={!!selectedLog} onOpenChange={() => setSelectedLog(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ScrollText className="w-5 h-5 text-primary" />
              Detalhes do Registro
            </DialogTitle>
            <DialogDescription>
              Informações completas da ação registrada
            </DialogDescription>
          </DialogHeader>
          {selectedLog && (
            <div className="space-y-4">
              {/* Action header */}
              <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${CATEGORY_COLORS[selectedLog.category]}`}>
                  {(() => { const I = CATEGORY_ICONS[selectedLog.category]; return <I className="w-5 h-5" />; })()}
                </div>
                <div>
                  <p className="font-semibold text-sm">{ACTION_LABELS[selectedLog.action]}</p>
                  <p className="text-xs text-muted-foreground">{CATEGORY_LABELS[selectedLog.category]}</p>
                </div>
                <span className={`ml-auto inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${SEVERITY_CONFIG[selectedLog.severity].bgColor} ${SEVERITY_CONFIG[selectedLog.severity].color}`}>
                  {(() => { const I = SEVERITY_ICONS[selectedLog.severity]; return <I className="w-3 h-3" />; })()}
                  {SEVERITY_CONFIG[selectedLog.severity].label}
                </span>
              </div>

              {/* Description */}
              <div>
                <p className="text-xs font-medium text-muted-foreground mb-1">Descrição</p>
                <p className="text-sm">{selectedLog.description}</p>
              </div>

              {/* Meta grid */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-muted/30 rounded-lg">
                  <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wide mb-1">Usuário</p>
                  <p className="text-sm font-medium flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-muted-foreground" />
                    {selectedLog.userName}
                  </p>
                </div>
                <div className="p-3 bg-muted/30 rounded-lg">
                  <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wide mb-1">Nível</p>
                  <p className="text-sm font-medium flex items-center gap-1.5">
                    <Shield className="w-3.5 h-3.5 text-muted-foreground" />
                    {selectedLog.userRole === "super_admin" ? "Super Admin" :
                      selectedLog.userRole === "gestor" ? "Gestor" :
                      selectedLog.userRole === "professor" ? "Professor(a)" : selectedLog.userRole}
                  </p>
                </div>
                <div className="p-3 bg-muted/30 rounded-lg">
                  <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wide mb-1">Data/Hora</p>
                  <p className="text-sm font-medium flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-muted-foreground" />
                    {formatFullDate(selectedLog.timestamp)}
                  </p>
                </div>
                <div className="p-3 bg-muted/30 rounded-lg">
                  <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wide mb-1">Endereço IP</p>
                  <p className="text-sm font-medium font-mono flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-muted-foreground" />
                    {selectedLog.ip || "—"}
                  </p>
                </div>
              </div>

              {/* Target */}
              {selectedLog.targetName && (
                <div className="p-3 bg-muted/30 rounded-lg">
                  <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wide mb-1">Alvo da ação</p>
                  <p className="text-sm font-medium">{selectedLog.targetName} <span className="text-muted-foreground font-mono text-xs">({selectedLog.targetId})</span></p>
                </div>
              )}

              {/* Details */}
              {selectedLog.details && Object.keys(selectedLog.details).length > 0 && (
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-2">Detalhes adicionais</p>
                  <div className="space-y-1.5">
                    {Object.entries(selectedLog.details).map(([key, value]) => (
                      <div key={key} className="flex items-start gap-2 text-sm p-2 bg-muted/20 rounded-md">
                        <span className="text-muted-foreground font-medium shrink-0 min-w-[120px]">{key}</span>
                        <span className="text-foreground">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ID */}
              <div className="pt-2 border-t border-border">
                <p className="text-[10px] text-muted-foreground font-mono">ID: {selectedLog.id}</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Clear confirmation */}
      <AlertDialog open={showClearDialog} onOpenChange={setShowClearDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Limpar log de auditoria?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação removerá permanentemente todos os {logs.length} registros de auditoria. Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleClear} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Limpar tudo
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
