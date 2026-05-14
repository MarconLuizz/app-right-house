import { UserPlus } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { supabase } from "../lib/supabase";
import { toast } from "../hook/use-toast";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/login`,
          data: { name },
        },
      });

      if (error) throw error;
      toast({ title: "Sucesso!", description: "Conta criada com sucesso!" });
      setName("");
      setEmail("");
      setPassword("");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Não foi possível criar a conta.";
      toast({ title: "Erro", description: message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-md">
        <div className="rounded-2xl bg-card p-8 shadow-elevated">
          <div className="mb-8 text-center">
            <h1 className="font-heading text-2xl font-bold text-foreground">Criar conta</h1>
            <p className="mt-1 text-sm text-muted-foreground">Crie sua conta para salvar simulacoes</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label className="text-foreground">Nome</Label>
              <Input type="text" placeholder="Seu nome completo" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>

            <div>
              <Label className="text-foreground">Email</Label>
              <Input type="email" placeholder="seu@email.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>

            <div>
              <Label className="text-foreground">Senha</Label>
              <Input type="password" placeholder="********" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} />
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              <UserPlus className="h-4 w-4" />
              Criar conta
            </Button>
          </form>

          <div className="mt-6 text-center">
            <Link to="/auth/login" className="text-sm text-primary hover:underline">
              Ja tem conta? Entrar
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
