import { LogIn } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { loginUser } from "../lib/api";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await loginUser(email, password);
      navigate("/home");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Nao foi possivel concluir a autenticacao.";
      alert(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-md">
        <div className="rounded-2xl bg-card p-8 shadow-elevated">
          <div className="mb-8 text-center">
            <h1 className="font-heading text-2xl font-bold text-foreground">Entrar</h1>
            <p className="mt-1 text-sm text-muted-foreground">Acesse sua conta para continuar</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label className="text-foreground">Email</Label>
              <Input data-testid="input-email-login" type="email" placeholder="seu@email.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>

            <div>
              <Label className="text-foreground">Senha</Label>
              <Input data-testid="input-senha-login" type="password" placeholder="********" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} />
            </div>

            <Button data-testid="btn-entrar-login" type="submit" className="w-full" disabled={loading}>
              <LogIn className="h-4 w-4" />
              {loading ? "Entrando..." : "Entrar"}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <Link to="/auth/register" className="text-sm text-primary hover:underline">
              Nao tem conta? Criar uma
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
