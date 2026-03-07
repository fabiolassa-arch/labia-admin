/*
 * AuditContext — Sistema de log de auditoria do painel administrativo
 * Registra todas as ações dos administradores com timestamp, detalhes e metadados
 */
import { createContext, useContext, useState, useCallback, type ReactNode } from "react";

export type AuditAction =
  | "usuario.criar" | "usuario.editar" | "usuario.excluir" | "usuario.redefinir_senha"
  | "trilha.criar" | "trilha.editar" | "trilha.excluir" | "trilha.publicar" | "trilha.despublicar"
  | "missao.criar" | "missao.editar" | "missao.excluir"
  | "aluno.criar" | "aluno.editar" | "aluno.excluir" | "aluno.exportar"
  | "escola.criar" | "escola.editar" | "escola.excluir"
  | "configuracao.alterar"
  | "relatorio.exportar"
  | "login.sucesso" | "login.falha" | "logout";

export type AuditSeverity = "info" | "warning" | "critical";

export type AuditCategory = "usuarios" | "trilhas" | "missoes" | "alunos" | "escolas" | "configuracoes" | "relatorios" | "autenticacao";

export interface AuditEntry {
  id: string;
  timestamp: string;
  action: AuditAction;
  category: AuditCategory;
  severity: AuditSeverity;
  userId: string;
  userName: string;
  userRole: string;
  description: string;
  details?: Record<string, string>;
  targetId?: string;
  targetName?: string;
  ip?: string;
}

interface AuditContextType {
  logs: AuditEntry[];
  addLog: (entry: Omit<AuditEntry, "id" | "timestamp" | "ip">) => void;
  getLogsByCategory: (category: AuditCategory) => AuditEntry[];
  getLogsByUser: (userId: string) => AuditEntry[];
  getRecentLogs: (count: number) => AuditEntry[];
  clearLogs: () => void;
}

// Dados iniciais de demonstração
const DEMO_LOGS: AuditEntry[] = [
  {
    id: "log-001", timestamp: "2026-03-07T10:32:15", action: "login.sucesso",
    category: "autenticacao", severity: "info",
    userId: "1", userName: "Fabíola Lassa", userRole: "super_admin",
    description: "Login realizado com sucesso", ip: "189.44.12.xxx",
  },
  {
    id: "log-002", timestamp: "2026-03-07T10:35:42", action: "usuario.criar",
    category: "usuarios", severity: "info",
    userId: "1", userName: "Fabíola Lassa", userRole: "super_admin",
    description: "Novo usuário cadastrado: Lucas Oliveira",
    targetId: "8", targetName: "Lucas Oliveira",
    details: { "Nível": "Professor(a)", "Escola": "Escola Nova Era", "E-mail": "lucas.prof@labia.edu.br" },
  },
  {
    id: "log-003", timestamp: "2026-03-07T09:15:30", action: "trilha.editar",
    category: "trilhas", severity: "info",
    userId: "2", userName: "Carlos Mendes", userRole: "gestor",
    description: "Trilha atualizada: Entendendo a IA",
    targetId: "t1", targetName: "Entendendo a IA",
    details: { "Campo alterado": "Descrição", "Valor anterior": "Introdução à IA...", "Novo valor": "Aprenda os fundamentos..." },
  },
  {
    id: "log-004", timestamp: "2026-03-07T08:50:10", action: "aluno.exportar",
    category: "alunos", severity: "info",
    userId: "2", userName: "Carlos Mendes", userRole: "gestor",
    description: "Relatório de alunos exportado em CSV",
    details: { "Formato": "CSV", "Total de registros": "1.247", "Filtro": "Escola Nova Era" },
  },
  {
    id: "log-005", timestamp: "2026-03-06T17:20:00", action: "usuario.editar",
    category: "usuarios", severity: "warning",
    userId: "1", userName: "Fabíola Lassa", userRole: "super_admin",
    description: "Nível de acesso alterado: Pedro Santos → Inativo",
    targetId: "6", targetName: "Pedro Santos",
    details: { "Campo alterado": "Status", "Valor anterior": "Ativo", "Novo valor": "Inativo" },
  },
  {
    id: "log-006", timestamp: "2026-03-06T16:45:22", action: "missao.criar",
    category: "missoes", severity: "info",
    userId: "2", userName: "Carlos Mendes", userRole: "gestor",
    description: "Nova missão criada: Introdução ao Machine Learning",
    targetId: "m17", targetName: "Introdução ao Machine Learning",
    details: { "Trilha": "Entendendo a IA", "Tipo": "Leitura + Quiz", "Dificuldade": "Intermediário" },
  },
  {
    id: "log-007", timestamp: "2026-03-06T15:30:00", action: "login.falha",
    category: "autenticacao", severity: "warning",
    userId: "unknown", userName: "Desconhecido", userRole: "—",
    description: "Tentativa de login falhou para: admin@labia.edu.br",
    details: { "E-mail": "admin@labia.edu.br", "Motivo": "Senha incorreta" }, ip: "201.33.55.xxx",
  },
  {
    id: "log-008", timestamp: "2026-03-06T14:10:45", action: "escola.editar",
    category: "escolas", severity: "info",
    userId: "1", userName: "Fabíola Lassa", userRole: "super_admin",
    description: "Escola atualizada: Colégio Futuro Digital",
    targetId: "e3", targetName: "Colégio Futuro Digital",
    details: { "Campo alterado": "Plano", "Valor anterior": "Básico", "Novo valor": "Premium" },
  },
  {
    id: "log-009", timestamp: "2026-03-06T11:00:00", action: "configuracao.alterar",
    category: "configuracoes", severity: "warning",
    userId: "1", userName: "Fabíola Lassa", userRole: "super_admin",
    description: "Configuração do sistema alterada: Notificações por e-mail",
    details: { "Configuração": "Notificações por e-mail", "Valor anterior": "Desativado", "Novo valor": "Ativado" },
  },
  {
    id: "log-010", timestamp: "2026-03-06T09:20:30", action: "usuario.excluir",
    category: "usuarios", severity: "critical",
    userId: "1", userName: "Fabíola Lassa", userRole: "super_admin",
    description: "Usuário removido: Maria Fernandes",
    targetId: "9", targetName: "Maria Fernandes",
    details: { "Nível": "Professor(a)", "Escola": "Centro Educacional IA", "E-mail": "maria@labia.edu.br" },
  },
  {
    id: "log-011", timestamp: "2026-03-05T16:40:00", action: "relatorio.exportar",
    category: "relatorios", severity: "info",
    userId: "2", userName: "Carlos Mendes", userRole: "gestor",
    description: "Relatório de desempenho exportado em PDF",
    details: { "Formato": "PDF", "Período": "Fevereiro 2026", "Tipo": "Desempenho por trilha" },
  },
  {
    id: "log-012", timestamp: "2026-03-05T14:15:00", action: "trilha.publicar",
    category: "trilhas", severity: "info",
    userId: "1", userName: "Fabíola Lassa", userRole: "super_admin",
    description: "Trilha publicada: Meu Primeiro App",
    targetId: "t4", targetName: "Meu Primeiro App",
    details: { "Total de missões": "4", "Status anterior": "Rascunho" },
  },
  {
    id: "log-013", timestamp: "2026-03-05T10:30:00", action: "aluno.editar",
    category: "alunos", severity: "info",
    userId: "3", userName: "Ana Silva", userRole: "professor",
    description: "Observação adicionada ao aluno: João Pedro",
    targetId: "a15", targetName: "João Pedro",
    details: { "Campo": "Observações", "Conteúdo": "Aluno demonstra grande interesse em prompts criativos" },
  },
  {
    id: "log-014", timestamp: "2026-03-05T08:00:00", action: "login.sucesso",
    category: "autenticacao", severity: "info",
    userId: "3", userName: "Ana Silva", userRole: "professor",
    description: "Login realizado com sucesso", ip: "177.22.88.xxx",
  },
  {
    id: "log-015", timestamp: "2026-03-04T17:00:00", action: "usuario.redefinir_senha",
    category: "usuarios", severity: "warning",
    userId: "1", userName: "Fabíola Lassa", userRole: "super_admin",
    description: "Senha redefinida para: Mariana Costa",
    targetId: "5", targetName: "Mariana Costa",
    details: { "Motivo": "Solicitação do usuário" },
  },
];

const AuditContext = createContext<AuditContextType | undefined>(undefined);

export function AuditProvider({ children }: { children: ReactNode }) {
  const [logs, setLogs] = useState<AuditEntry[]>(() => {
    const saved = localStorage.getItem("labia_audit_logs");
    return saved ? JSON.parse(saved) : DEMO_LOGS;
  });

  const addLog = useCallback((entry: Omit<AuditEntry, "id" | "timestamp" | "ip">) => {
    const newEntry: AuditEntry = {
      ...entry,
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString(),
      ip: "192.168.1.xxx",
    };
    setLogs((prev) => {
      const updated = [newEntry, ...prev];
      localStorage.setItem("labia_audit_logs", JSON.stringify(updated.slice(0, 500)));
      return updated;
    });
  }, []);

  const getLogsByCategory = useCallback(
    (category: AuditCategory) => logs.filter((l) => l.category === category),
    [logs]
  );

  const getLogsByUser = useCallback(
    (userId: string) => logs.filter((l) => l.userId === userId),
    [logs]
  );

  const getRecentLogs = useCallback(
    (count: number) => logs.slice(0, count),
    [logs]
  );

  const clearLogs = useCallback(() => {
    setLogs([]);
    localStorage.removeItem("labia_audit_logs");
  }, []);

  return (
    <AuditContext.Provider value={{ logs, addLog, getLogsByCategory, getLogsByUser, getRecentLogs, clearLogs }}>
      {children}
    </AuditContext.Provider>
  );
}

export function useAudit() {
  const ctx = useContext(AuditContext);
  if (!ctx) throw new Error("useAudit must be used within AuditProvider");
  return ctx;
}

// Helpers para labels e cores
export const ACTION_LABELS: Record<AuditAction, string> = {
  "usuario.criar": "Usuário criado",
  "usuario.editar": "Usuário editado",
  "usuario.excluir": "Usuário removido",
  "usuario.redefinir_senha": "Senha redefinida",
  "trilha.criar": "Trilha criada",
  "trilha.editar": "Trilha editada",
  "trilha.excluir": "Trilha removida",
  "trilha.publicar": "Trilha publicada",
  "trilha.despublicar": "Trilha despublicada",
  "missao.criar": "Missão criada",
  "missao.editar": "Missão editada",
  "missao.excluir": "Missão removida",
  "aluno.criar": "Aluno cadastrado",
  "aluno.editar": "Aluno editado",
  "aluno.excluir": "Aluno removido",
  "aluno.exportar": "Dados exportados",
  "escola.criar": "Escola cadastrada",
  "escola.editar": "Escola editada",
  "escola.excluir": "Escola removida",
  "configuracao.alterar": "Configuração alterada",
  "relatorio.exportar": "Relatório exportado",
  "login.sucesso": "Login realizado",
  "login.falha": "Login falhou",
  "logout": "Logout",
};

export const CATEGORY_LABELS: Record<AuditCategory, string> = {
  usuarios: "Usuários",
  trilhas: "Trilhas",
  missoes: "Missões",
  alunos: "Alunos",
  escolas: "Escolas",
  configuracoes: "Configurações",
  relatorios: "Relatórios",
  autenticacao: "Autenticação",
};

export const SEVERITY_CONFIG: Record<AuditSeverity, { label: string; color: string; bgColor: string }> = {
  info: { label: "Info", color: "text-blue-600", bgColor: "bg-blue-50" },
  warning: { label: "Atenção", color: "text-amber-600", bgColor: "bg-amber-50" },
  critical: { label: "Crítico", color: "text-red-600", bgColor: "bg-red-50" },
};
