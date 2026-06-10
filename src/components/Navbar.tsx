import { Calculator, LogOut } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import { isAuthenticated as hasSession, logoutUser, subscribeToAuthChanges } from "../lib/api";
import { Button } from "./ui/button";

const navLinks = [
  { label: "Início", to: "/home" },
  { label: "Como funciona", to: "/home#como-funciona" },
  { label: "Simulação", to: "/simulation" },
];

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const syncAuthState = () => setIsAuthenticated(hasSession());

    syncAuthState();

    return subscribeToAuthChanges(syncAuthState);
  }, []);

  const isActive = (to: string) => {
    if (to.includes("#")) {
      const [pathname, hash] = to.split("#");
      return location.pathname === pathname && location.hash === `#${hash}`;
    }

    return location.pathname === to && location.hash === "";
  };

  const handleLogout = async () => {
    await logoutUser();
    navigate("/home");
  };

  return (
    <header className="sticky top-0 z-50 border-b bg-card/90 backdrop-blur-md">
      <div className="container mx-auto flex min-h-16 flex-wrap items-center justify-between gap-3 px-4 py-3">
        <Link to="/home" className="flex items-center gap-2 font-heading text-xl font-bold text-primary">
          <Calculator className="h-6 w-6" />
          <span>App Right House</span>
        </Link>

        <nav className="order-3 flex w-full items-center justify-center gap-4 sm:order-none sm:w-auto sm:gap-6" aria-label="Navegação principal">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={
                [
                  "text-sm font-medium transition-colors hover:text-foreground",
                  isActive(link.to) ? "text-foreground" : "text-muted-foreground",
                ].join(" ")
              }
            >
              {link.label}
            </Link>
          ))}
          {isAuthenticated && (
            <Link
              to="/simulation/history"
              className={
                [
                  "text-sm font-medium transition-colors hover:text-foreground",
                  isActive("/simulation/history") ? "text-foreground" : "text-muted-foreground",
                ].join(" ")
              }
            >
              Histórico
            </Link>
          )}
        </nav>

        {isAuthenticated ? (
          <Button variant="outline" size="sm" onClick={handleLogout}>
            <LogOut className="h-4 w-4" />
            Sair
          </Button>
        ) : (
          <Button asChild size="sm">
            <Link to="/auth/login">Entrar</Link>
          </Button>
        )}
      </div>
    </header>
  );
}
