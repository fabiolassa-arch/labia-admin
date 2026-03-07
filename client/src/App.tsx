import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import DashboardLayout from "./components/DashboardLayout";
import AdminLogin from "./pages/AdminLogin";
import Home from "./pages/Home";
import Trilhas from "./pages/Trilhas";
import Missoes from "./pages/Missoes";
import Alunos from "./pages/Alunos";
import Escolas from "./pages/Escolas";
import Relatorios from "./pages/Relatorios";
import Configuracoes from "./pages/Configuracoes";
import Usuarios from "./pages/Usuarios";

function ProtectedRoutes() {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <AdminLogin />;
  }

  return (
    <Switch>
      <Route path="/">
        <DashboardLayout><Home /></DashboardLayout>
      </Route>
      <Route path="/trilhas">
        <DashboardLayout><Trilhas /></DashboardLayout>
      </Route>
      <Route path="/missoes">
        <DashboardLayout><Missoes /></DashboardLayout>
      </Route>
      <Route path="/alunos">
        <DashboardLayout><Alunos /></DashboardLayout>
      </Route>
      <Route path="/escolas">
        <DashboardLayout><Escolas /></DashboardLayout>
      </Route>
      <Route path="/relatorios">
        <DashboardLayout><Relatorios /></DashboardLayout>
      </Route>
      <Route path="/configuracoes">
        <DashboardLayout><Configuracoes /></DashboardLayout>
      </Route>
      <Route path="/usuarios">
        <DashboardLayout><Usuarios /></DashboardLayout>
      </Route>
      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <AuthProvider>
          <TooltipProvider>
            <Toaster />
            <ProtectedRoutes />
          </TooltipProvider>
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
