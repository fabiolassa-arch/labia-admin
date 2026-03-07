/*
 * Configurações — Configurações gerais do sistema, notificações e conta
 */
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from "@/components/ui/select";
import {
  Settings, Bell, Shield, Palette, Globe, Save, Upload, User, Mail
} from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";

export default function Configuracoes() {
  const [notifEmail, setNotifEmail] = useState(true);
  const [notifPush, setNotifPush] = useState(true);
  const [notifRelatorio, setNotifRelatorio] = useState(false);
  const [modoManutencao, setModoManutencao] = useState(false);

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-display font-bold text-2xl">Configurações</h1>
        <p className="text-muted-foreground text-sm mt-1">Gerencie as configurações do sistema e da sua conta</p>
      </div>

      <Tabs defaultValue="geral" className="space-y-6">
        <TabsList className="bg-muted/50">
          <TabsTrigger value="geral" className="gap-2"><Settings className="w-4 h-4" /> Geral</TabsTrigger>
          <TabsTrigger value="notificacoes" className="gap-2"><Bell className="w-4 h-4" /> Notificações</TabsTrigger>
          <TabsTrigger value="seguranca" className="gap-2"><Shield className="w-4 h-4" /> Segurança</TabsTrigger>
          <TabsTrigger value="aparencia" className="gap-2"><Palette className="w-4 h-4" /> Aparência</TabsTrigger>
        </TabsList>

        {/* Geral */}
        <TabsContent value="geral" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Informações da Plataforma</CardTitle>
              <CardDescription>Configurações gerais do LabIA</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Nome da Plataforma</Label>
                  <Input defaultValue="LabIA — Alfabetização em IA" />
                </div>
                <div className="space-y-2">
                  <Label>URL do Site</Label>
                  <Input defaultValue="https://labia-app.netlify.app" />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Descrição</Label>
                <Textarea defaultValue="Plataforma gamificada de alfabetização em Inteligência Artificial para jovens de 12 a 18 anos." rows={3} />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>E-mail de Suporte</Label>
                  <Input defaultValue="suporte@labia.edu.br" />
                </div>
                <div className="space-y-2">
                  <Label>Idioma Padrão</Label>
                  <Select defaultValue="pt-br">
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pt-br">Português (Brasil)</SelectItem>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="es">Español</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Modo Manutenção</p>
                  <p className="text-xs text-muted-foreground">Desativa o acesso dos alunos temporariamente</p>
                </div>
                <Switch checked={modoManutencao} onCheckedChange={setModoManutencao} />
              </div>
              <div className="flex justify-end">
                <Button onClick={() => toast.success("Configurações salvas!")}>
                  <Save className="w-4 h-4 mr-2" /> Salvar Alterações
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Minha Conta</CardTitle>
              <CardDescription>Informações do administrador</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#7C3AED] to-[#F97316] flex items-center justify-center text-white text-xl font-bold">
                  FL
                </div>
                <div>
                  <p className="font-semibold">Fabíola Lassa</p>
                  <p className="text-sm text-muted-foreground">Administradora</p>
                  <Button variant="outline" size="sm" className="mt-2 h-7 text-xs">
                    <Upload className="w-3 h-3 mr-1" /> Alterar foto
                  </Button>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Nome Completo</Label>
                  <Input defaultValue="Fabíola Lassa" />
                </div>
                <div className="space-y-2">
                  <Label>E-mail</Label>
                  <Input defaultValue="fabiola@labia.edu.br" />
                </div>
              </div>
              <div className="flex justify-end">
                <Button onClick={() => toast.success("Perfil atualizado!")}>
                  <Save className="w-4 h-4 mr-2" /> Salvar
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notificações */}
        <TabsContent value="notificacoes" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Preferências de Notificação</CardTitle>
              <CardDescription>Escolha como deseja receber notificações</CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-labia-purple/10">
                    <Mail className="w-4 h-4 text-labia-purple" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Notificações por E-mail</p>
                    <p className="text-xs text-muted-foreground">Receba alertas importantes por e-mail</p>
                  </div>
                </div>
                <Switch checked={notifEmail} onCheckedChange={setNotifEmail} />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-labia-orange/10">
                    <Bell className="w-4 h-4 text-labia-orange" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Notificações Push</p>
                    <p className="text-xs text-muted-foreground">Notificações em tempo real no navegador</p>
                  </div>
                </div>
                <Switch checked={notifPush} onCheckedChange={setNotifPush} />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-labia-green/10">
                    <Globe className="w-4 h-4 text-labia-green" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Relatórios Semanais</p>
                    <p className="text-xs text-muted-foreground">Resumo semanal de desempenho por e-mail</p>
                  </div>
                </div>
                <Switch checked={notifRelatorio} onCheckedChange={setNotifRelatorio} />
              </div>
              <div className="flex justify-end pt-2">
                <Button onClick={() => toast.success("Preferências salvas!")}>
                  <Save className="w-4 h-4 mr-2" /> Salvar
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Segurança */}
        <TabsContent value="seguranca" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Alterar Senha</CardTitle>
              <CardDescription>Mantenha sua conta segura com uma senha forte</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Senha Atual</Label>
                <Input type="password" placeholder="••••••••" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Nova Senha</Label>
                  <Input type="password" placeholder="••••••••" />
                </div>
                <div className="space-y-2">
                  <Label>Confirmar Nova Senha</Label>
                  <Input type="password" placeholder="••••••••" />
                </div>
              </div>
              <div className="flex justify-end">
                <Button onClick={() => toast.success("Senha alterada!")}>
                  <Shield className="w-4 h-4 mr-2" /> Alterar Senha
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Sessões Ativas</CardTitle>
              <CardDescription>Gerencie os dispositivos conectados</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                { device: "Chrome — macOS", local: "Salvador, BA", status: "Atual", time: "Agora" },
                { device: "Safari — iPhone", local: "Salvador, BA", status: "Ativo", time: "2h atrás" },
              ].map((s, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-lg border">
                  <div>
                    <p className="text-sm font-medium">{s.device}</p>
                    <p className="text-xs text-muted-foreground">{s.local} • {s.time}</p>
                  </div>
                  {s.status === "Atual" ? (
                    <span className="text-xs text-labia-green font-medium">Sessão atual</span>
                  ) : (
                    <Button variant="outline" size="sm" className="h-7 text-xs text-destructive"
                      onClick={() => toast.success("Sessão encerrada!")}>
                      Encerrar
                    </Button>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Aparência */}
        <TabsContent value="aparencia" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Tema e Aparência</CardTitle>
              <CardDescription>Personalize a aparência do painel</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Tema</Label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { nome: "Claro", bg: "bg-white border-2 border-primary", text: "text-gray-800" },
                    { nome: "Escuro", bg: "bg-gray-900", text: "text-white" },
                    { nome: "Sistema", bg: "bg-gradient-to-r from-white to-gray-900", text: "text-gray-600" },
                  ].map((t) => (
                    <div key={t.nome} className={`p-4 rounded-lg ${t.bg} cursor-pointer text-center transition-all hover:ring-2 hover:ring-primary`}>
                      <span className={`text-sm font-medium ${t.text}`}>{t.nome}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <Label>Cor Primária</Label>
                <div className="flex items-center gap-3">
                  {["#7C3AED", "#F97316", "#10B981", "#3B82F6", "#EC4899"].map((c) => (
                    <div key={c} className={`w-8 h-8 rounded-full cursor-pointer ring-2 ring-offset-2 transition-all hover:scale-110 ${c === "#7C3AED" ? "ring-primary" : "ring-transparent"}`}
                      style={{ backgroundColor: c }} />
                  ))}
                </div>
              </div>
              <div className="flex justify-end pt-2">
                <Button onClick={() => toast.success("Aparência atualizada!")}>
                  <Save className="w-4 h-4 mr-2" /> Salvar
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
}
