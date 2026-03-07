/*
 * AuthContext — Sistema de autenticação e permissões do painel administrativo
 * Níveis: super_admin, gestor, professor
 */
import { createContext, useContext, useState, useCallback, type ReactNode } from "react";

export type UserRole = "super_admin" | "gestor" | "professor";

export interface AdminUser {
  id: string;
  nome: string;
  email: string;
  role: UserRole;
  avatar?: string;
  escola?: string;
  ultimoAcesso?: string;
}

interface AuthContextType {
  user: AdminUser | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  hasPermission: (permission: Permission) => boolean;
  getRoleLabel: (role: UserRole) => string;
  getRoleColor: (role: UserRole) => string;
}

// Permissões granulares do sistema
export type Permission =
  | "dashboard.view"
  | "trilhas.view" | "trilhas.create" | "trilhas.edit" | "trilhas.delete"
  | "missoes.view" | "missoes.create" | "missoes.edit" | "missoes.delete"
  | "alunos.view" | "alunos.create" | "alunos.edit" | "alunos.delete" | "alunos.export"
  | "escolas.view" | "escolas.create" | "escolas.edit" | "escolas.delete"
  | "relatorios.view" | "relatorios.export"
  | "configuracoes.view" | "configuracoes.edit"
  | "usuarios.view" | "usuarios.create" | "usuarios.edit" | "usuarios.delete";

// Mapa de permissões por nível
const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  super_admin: [
    "dashboard.view",
    "trilhas.view", "trilhas.create", "trilhas.edit", "trilhas.delete",
    "missoes.view", "missoes.create", "missoes.edit", "missoes.delete",
    "alunos.view", "alunos.create", "alunos.edit", "alunos.delete", "alunos.export",
    "escolas.view", "escolas.create", "escolas.edit", "escolas.delete",
    "relatorios.view", "relatorios.export",
    "configuracoes.view", "configuracoes.edit",
    "usuarios.view", "usuarios.create", "usuarios.edit", "usuarios.delete",
  ],
  gestor: [
    "dashboard.view",
    "trilhas.view", "trilhas.create", "trilhas.edit",
    "missoes.view", "missoes.create", "missoes.edit",
    "alunos.view", "alunos.create", "alunos.edit", "alunos.export",
    "escolas.view",
    "relatorios.view", "relatorios.export",
    "configuracoes.view",
  ],
  professor: [
    "dashboard.view",
    "trilhas.view",
    "missoes.view",
    "alunos.view",
    "relatorios.view",
  ],
};

// Usuários de demonstração
const DEMO_USERS: { email: string; password: string; user: AdminUser }[] = [
  {
    email: "admin@labia.edu.br",
    password: "admin123",
    user: {
      id: "1",
      nome: "Fabíola Lassa",
      email: "admin@labia.edu.br",
      role: "super_admin",
      ultimoAcesso: "2026-03-07T10:30:00",
    },
  },
  {
    email: "gestor@labia.edu.br",
    password: "gestor123",
    user: {
      id: "2",
      nome: "Carlos Mendes",
      email: "gestor@labia.edu.br",
      role: "gestor",
      escola: "Escola Nova Era",
      ultimoAcesso: "2026-03-06T15:45:00",
    },
  },
  {
    email: "professor@labia.edu.br",
    password: "prof123",
    user: {
      id: "3",
      nome: "Ana Silva",
      email: "professor@labia.edu.br",
      role: "professor",
      escola: "Instituto Tech Educação",
      ultimoAcesso: "2026-03-07T08:20:00",
    },
  },
];

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AdminUser | null>(() => {
    const saved = localStorage.getItem("labia_admin_user");
    return saved ? JSON.parse(saved) : null;
  });

  const login = useCallback(async (email: string, password: string) => {
    // Simula delay de rede
    await new Promise((r) => setTimeout(r, 1200));

    const found = DEMO_USERS.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );

    if (!found) {
      return { success: false, error: "E-mail ou senha incorretos." };
    }

    setUser(found.user);
    localStorage.setItem("labia_admin_user", JSON.stringify(found.user));
    return { success: true };
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem("labia_admin_user");
  }, []);

  const hasPermission = useCallback(
    (permission: Permission) => {
      if (!user) return false;
      return ROLE_PERMISSIONS[user.role].includes(permission);
    },
    [user]
  );

  const getRoleLabel = (role: UserRole) => {
    const labels: Record<UserRole, string> = {
      super_admin: "Super Admin",
      gestor: "Gestor",
      professor: "Professor(a)",
    };
    return labels[role];
  };

  const getRoleColor = (role: UserRole) => {
    const colors: Record<UserRole, string> = {
      super_admin: "bg-labia-purple/15 text-labia-purple",
      gestor: "bg-labia-orange/15 text-labia-orange",
      professor: "bg-labia-blue/15 text-labia-blue",
    };
    return colors[role];
  };

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated: !!user, login, logout, hasPermission, getRoleLabel, getRoleColor }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
