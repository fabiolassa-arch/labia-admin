/*
 * Design: Corporate Dashboard Minimal
 * Sidebar escura (#1C1C2E) + área de conteúdo clara (#FAFAFA)
 * Integrado com AuthContext para permissões e dados do usuário
 */
import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuth, type Permission } from "@/contexts/AuthContext";
import {
  LayoutDashboard, Route, Target, Users, School, BarChart3, Settings,
  ChevronLeft, ChevronRight, LogOut, Bell, Search, Menu, X, Rocket, Shield, UserCog
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuSeparator, DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

interface NavItem {
  label: string;
  icon: typeof LayoutDashboard;
  path: string;
  permission: Permission;
}

const NAV_ITEMS: NavItem[] = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/", permission: "dashboard.view" },
  { label: "Trilhas", icon: Route, path: "/trilhas", permission: "trilhas.view" },
  { label: "Missões", icon: Target, path: "/missoes", permission: "missoes.view" },
  { label: "Alunos", icon: Users, path: "/alunos", permission: "alunos.view" },
  { label: "Escolas", icon: School, path: "/escolas", permission: "escolas.view" },
  { label: "Relatórios", icon: BarChart3, path: "/relatorios", permission: "relatorios.view" },
  { label: "Configurações", icon: Settings, path: "/configuracoes", permission: "configuracoes.view" },
  { label: "Usuários", icon: UserCog, path: "/usuarios", permission: "usuarios.view" },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, logout, hasPermission, getRoleLabel, getRoleColor } = useAuth();

  const initials = user?.nome
    ? user.nome.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase()
    : "AD";

  const visibleNavItems = NAV_ITEMS.filter((item) => hasPermission(item.permission));

  const handleLogout = () => {
    logout();
    toast.success("Sessão encerrada com sucesso.");
  };

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Mobile overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setMobileOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:static inset-y-0 left-0 z-50
          bg-sidebar text-sidebar-foreground
          flex flex-col transition-all duration-300 ease-in-out
          ${collapsed ? "w-[72px]" : "w-64"}
          ${mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        {/* Logo */}
        <div className={`flex items-center h-16 px-4 border-b border-sidebar-border ${collapsed ? "justify-center" : "gap-3"}`}>
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#7C3AED] to-[#F97316] flex items-center justify-center shrink-0">
            <Rocket className="w-5 h-5 text-white" />
          </div>
          {!collapsed && (
            <div className="overflow-hidden">
              <h1 className="font-display font-bold text-lg leading-tight text-white">LabIA</h1>
              <p className="text-[11px] text-sidebar-foreground/60 leading-tight">Painel Admin</p>
            </div>
          )}
          <button
            onClick={() => setMobileOpen(false)}
            className="ml-auto lg:hidden text-sidebar-foreground/60 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User info card */}
        {!collapsed && user && (
          <div className="mx-3 mt-4 mb-2 p-3 rounded-lg bg-sidebar-accent/40 border border-sidebar-border">
            <div className="flex items-center gap-2.5">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-gradient-to-br from-[#7C3AED] to-[#F97316] text-white text-xs font-semibold">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0">
                <p className="text-sm font-medium text-white truncate">{user.nome}</p>
                <span className={`inline-flex items-center gap-1 text-[10px] font-medium px-1.5 py-0.5 rounded-full ${getRoleColor(user.role)}`}>
                  <Shield className="w-2.5 h-2.5" />
                  {getRoleLabel(user.role)}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 py-3 px-3 space-y-1 overflow-y-auto">
          {visibleNavItems.map((item) => {
            const isActive = location === item.path || (item.path !== "/" && location.startsWith(item.path));
            return (
              <Link key={item.path} href={item.path}>
                <div
                  className={`
                    flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium
                    transition-all duration-200 group
                    ${isActive
                      ? "bg-sidebar-accent text-white"
                      : "text-sidebar-foreground/70 hover:text-white hover:bg-sidebar-accent/50"
                    }
                    ${collapsed ? "justify-center px-2" : ""}
                  `}
                  onClick={() => setMobileOpen(false)}
                >
                  <item.icon className={`w-5 h-5 shrink-0 ${isActive ? "text-labia-purple" : ""}`} />
                  {!collapsed && <span>{item.label}</span>}
                  {isActive && !collapsed && (
                    <div className="ml-auto w-1.5 h-1.5 rounded-full bg-labia-purple" />
                  )}
                </div>
              </Link>
            );
          })}
        </nav>

        {/* Logout + Collapse */}
        <div className="border-t border-sidebar-border">
          {!collapsed && (
            <div className="px-3 py-2">
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all w-full"
              >
                <LogOut className="w-5 h-5 shrink-0" />
                Sair
              </button>
            </div>
          )}
          <div className="hidden lg:flex items-center justify-center py-3">
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="p-2 rounded-lg text-sidebar-foreground/50 hover:text-white hover:bg-sidebar-accent/50 transition-colors"
            >
              {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="h-16 bg-card border-b border-border flex items-center px-4 lg:px-6 gap-4 shrink-0">
          <button
            onClick={() => setMobileOpen(true)}
            className="lg:hidden p-2 -ml-2 text-muted-foreground hover:text-foreground"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Search */}
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Buscar alunos, trilhas, missões..."
                className="pl-9 bg-muted/50 border-0 focus-visible:ring-1 focus-visible:ring-primary/30 h-9"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Notifications */}
            <Button variant="ghost" size="icon" className="relative h-9 w-9">
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-labia-orange rounded-full" />
            </Button>

            {/* User menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-muted/50 transition-colors">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-gradient-to-br from-[#7C3AED] to-[#F97316] text-white text-xs font-semibold">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="hidden md:block text-left">
                    <p className="text-sm font-medium leading-tight">{user?.nome?.split(" ")[0]}</p>
                    <p className="text-[11px] text-muted-foreground leading-tight">
                      {user ? getRoleLabel(user.role) : ""}
                    </p>
                  </div>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-52">
                <div className="px-2 py-1.5">
                  <p className="text-sm font-medium">{user?.nome}</p>
                  <p className="text-xs text-muted-foreground">{user?.email}</p>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Meu Perfil</DropdownMenuItem>
                {hasPermission("configuracoes.view") && (
                  <DropdownMenuItem>Configurações</DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-destructive" onClick={handleLogout}>
                  <LogOut className="w-4 h-4 mr-2" />
                  Sair
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Permission warning banner for restricted users */}
        {user && user.role === "professor" && (
          <div className="bg-labia-blue/10 border-b border-labia-blue/20 px-4 lg:px-6 py-2 flex items-center gap-2">
            <Shield className="w-4 h-4 text-labia-blue shrink-0" />
            <p className="text-xs text-labia-blue">
              Você está logado como <strong>Professor(a)</strong> — acesso somente leitura. Contate o administrador para permissões adicionais.
            </p>
          </div>
        )}

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
