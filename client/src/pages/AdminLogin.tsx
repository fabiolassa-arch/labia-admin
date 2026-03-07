/*
 * AdminLogin — Tela de login segura para administradores
 * Design: Split-screen com imagem à esquerda e formulário à direita
 * Níveis: Super Admin, Gestor, Professor
 */
import { useState } from "react";
import { useAuth, type UserRole } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import {
  Rocket, Eye, EyeOff, Shield, Lock, Mail, AlertCircle,
  ChevronRight, Fingerprint, KeyRound
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const LOGIN_BG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663095527403/hvRHdmvAcSqkg2m8mRx5q8/admin-login-bg_ca484897.png";

const DEMO_ACCOUNTS: { label: string; role: UserRole; email: string; password: string; color: string }[] = [
  { label: "Super Admin", role: "super_admin", email: "admin@labia.edu.br", password: "admin123", color: "#7C3AED" },
  { label: "Gestor", role: "gestor", email: "gestor@labia.edu.br", password: "gestor123", color: "#F97316" },
  { label: "Professor(a)", role: "professor", email: "professor@labia.edu.br", password: "prof123", color: "#3B82F6" },
];

export default function AdminLogin() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showDemo, setShowDemo] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Preencha todos os campos.");
      return;
    }
    setError("");
    setLoading(true);
    const result = await login(email, password);
    setLoading(false);
    if (!result.success) {
      setError(result.error || "Erro ao fazer login.");
    }
  };

  const handleDemoLogin = async (account: typeof DEMO_ACCOUNTS[0]) => {
    setEmail(account.email);
    setPassword(account.password);
    setError("");
    setLoading(true);
    const result = await login(account.email, account.password);
    setLoading(false);
    if (!result.success) {
      setError(result.error || "Erro ao fazer login.");
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left panel — Hero / Brand */}
      <div className="hidden lg:flex lg:w-[55%] relative overflow-hidden">
        <img src={LOGIN_BG} alt="" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-br from-[#1C1C2E]/90 via-[#1C1C2E]/70 to-[#7C3AED]/30" />

        <div className="relative z-10 flex flex-col justify-between p-12 w-full">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#7C3AED] to-[#F97316] flex items-center justify-center shadow-lg shadow-purple-500/20">
              <Rocket className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="font-display font-bold text-2xl text-white">LabIA</h1>
              <p className="text-xs text-white/50">Painel Administrativo</p>
            </div>
          </div>

          {/* Central message */}
          <div className="max-w-lg">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/10 mb-6">
                <Shield className="w-4 h-4 text-labia-purple" />
                <span className="text-sm text-white/80">Acesso restrito a administradores</span>
              </div>
              <h2 className="font-display font-bold text-4xl text-white leading-tight mb-4">
                Gerencie a plataforma de{" "}
                <span className="bg-gradient-to-r from-[#7C3AED] to-[#F97316] bg-clip-text text-transparent">
                  alfabetização em IA
                </span>
              </h2>
              <p className="text-white/60 text-lg leading-relaxed">
                Acompanhe o progresso dos alunos, gerencie trilhas e missões,
                e monitore o desempenho das escolas parceiras.
              </p>
            </motion.div>
          </div>

          {/* Security badges */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex items-center gap-6"
          >
            {[
              { icon: Lock, label: "Conexão segura" },
              { icon: Fingerprint, label: "Autenticação verificada" },
              { icon: KeyRound, label: "Dados criptografados" },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-2 text-white/40">
                <item.icon className="w-4 h-4" />
                <span className="text-xs">{item.label}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Right panel — Login Form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-8 lg:p-12 bg-background">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-md"
        >
          {/* Mobile logo */}
          <div className="flex items-center gap-3 mb-8 lg:hidden">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#7C3AED] to-[#F97316] flex items-center justify-center">
              <Rocket className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="font-display font-bold text-xl">LabIA</h1>
              <p className="text-xs text-muted-foreground">Painel Administrativo</p>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="font-display font-bold text-2xl mb-2">Bem-vindo(a) de volta</h2>
            <p className="text-muted-foreground">Faça login para acessar o painel administrativo</p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Error */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm"
                >
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">E-mail</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setError(""); }}
                  className="pl-10 h-11"
                  autoComplete="email"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-sm font-medium">Senha</Label>
                <button type="button" className="text-xs text-primary hover:underline">
                  Esqueceu a senha?
                </button>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setError(""); }}
                  className="pl-10 pr-10 h-11"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <Button
              type="submit"
              disabled={loading}
              className="w-full h-11 bg-gradient-to-r from-[#7C3AED] to-[#6D28D9] hover:from-[#6D28D9] hover:to-[#5B21B6] text-white font-semibold shadow-lg shadow-purple-500/20 transition-all"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Verificando...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  Entrar no Painel
                  <ChevronRight className="w-4 h-4" />
                </div>
              )}
            </Button>
          </form>

          {/* Demo accounts */}
          <div className="mt-8">
            <button
              onClick={() => setShowDemo(!showDemo)}
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mx-auto"
            >
              <Shield className="w-4 h-4" />
              {showDemo ? "Ocultar contas de demonstração" : "Usar conta de demonstração"}
              <ChevronRight className={`w-3 h-3 transition-transform ${showDemo ? "rotate-90" : ""}`} />
            </button>

            <AnimatePresence>
              {showDemo && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <div className="mt-4 space-y-2">
                    {DEMO_ACCOUNTS.map((account) => (
                      <Card
                        key={account.role}
                        className="cursor-pointer hover:shadow-md transition-all border hover:border-primary/30 group"
                        onClick={() => handleDemoLogin(account)}
                      >
                        <CardContent className="flex items-center gap-3 p-3">
                          <div
                            className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
                            style={{ backgroundColor: `${account.color}15` }}
                          >
                            <Shield className="w-5 h-5" style={{ color: account.color }} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold">{account.label}</p>
                            <p className="text-xs text-muted-foreground truncate">{account.email}</p>
                          </div>
                          <div className="flex flex-col items-end gap-0.5">
                            <span
                              className="text-[10px] font-medium px-2 py-0.5 rounded-full"
                              style={{ backgroundColor: `${account.color}15`, color: account.color }}
                            >
                              {account.role === "super_admin" ? "Acesso total" : account.role === "gestor" ? "Acesso parcial" : "Somente leitura"}
                            </span>
                            <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                  <p className="text-[11px] text-muted-foreground text-center mt-3">
                    Contas de demonstração para teste. Clique para entrar automaticamente.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Footer */}
          <div className="mt-10 text-center">
            <p className="text-xs text-muted-foreground">
              LabIA © 2026 — Alfabetização em Inteligência Artificial
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
