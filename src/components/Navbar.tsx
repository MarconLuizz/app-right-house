import { Link, useNavigate } from "react-router-dom";
import { Home, Info, Calculator, LogIn, LogOut, User, History } from "lucide-react";
import { useEffect, useState } from "react";
// import { api, type AuthUser } from "@/lib/api";
import { Button } from "./ui/button";

export default function Navbar() {
  const [user, setUser] = useState<null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsub = api.onAuthChange(setUser);
    return unsub;
  }, []);

  const handleLogout = async () => {
    await api.logout();
    setUser(null);
    navigate("/");
  };

  return (
    <nav className="sticky top-0 z-50 border-b bg-card/80 backdrop-blur-md">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-heading text-xl font-bold text-primary">
          <Calculator className="h-6 w-6" />
          SimulaFácil
        </Link>
        <div className="hidden md:flex items-center gap-6">
          <Link to="/" className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            <Home className="h-4 w-4" /> Início
          </Link>
          <Link to="/sobre" className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            <Info className="h-4 w-4" /> Sobre
          </Link>
          <Link to="/simular" className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            <Calculator className="h-4 w-4" /> Simular
          </Link>
          {user && (
            <Link to="/minhas-simulacoes" className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              <History className="h-4 w-4" /> Minhas simulações
            </Link>
          )}
        </div>
        <div className="flex items-center gap-2">
          {user ? (
            <>
              <span className="text-sm text-muted-foreground hidden sm:inline">
                <User className="h-4 w-4 inline mr-1" />
                {user.email}
              </span>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-1" /> Sair
              </Button>
            </>
          ) : (
            <Button size="sm" onClick={() => navigate("/login")}>
              <LogIn className="h-4 w-4 mr-1" /> Entrar
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
}
