import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

import { LogIn, UserPlus } from "lucide-react";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Button } from "../components/ui/button";

export default function Login() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({ 
          email, 
          password, 
          options: { 
            emailRedirectTo: window.location.origin, 
            data: { name } 
          } 
        });
        if (error) throw error;
        alert("Conta criada! Verifique seu email para confirmar.");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        navigate("/");
      }
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 bg-background">
      <div className="w-full max-w-md">
        <div className="bg-card rounded-2xl shadow-elevated p-8">
          <div className="text-center mb-8">
            <h1 className="font-heading text-2xl font-bold text-foreground">{isSignUp ? "Criar conta" : "Entrar"}</h1>
            <p className="text-muted-foreground text-sm mt-1">
              {isSignUp ? "Crie sua conta para salvar simulações" : "Acesse sua conta para continuar"}
            </p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignUp && (
              <div>
                <Label className="text-foreground">Nome</Label>
                <Input type="text" placeholder="Seu nome completo" value={name} onChange={(e) => setName(e.target.value)} required />
              </div>
            )}
            <div>
              <Label className="text-foreground">Email</Label>
              <Input type="email" placeholder="seu@email.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div>
              <Label className="text-foreground">Senha</Label>
              <Input type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {isSignUp ? <><UserPlus className="h-4 w-4 mr-1" /> Criar conta</> : <><LogIn className="h-4 w-4 mr-1" /> Entrar</>}
            </Button>
          </form>
          <div className="mt-6 text-center">
            <button onClick={() => setIsSignUp(!isSignUp)} className="text-sm text-primary hover:underline">
              {isSignUp ? "Já tem conta? Entrar" : "Não tem conta? Criar uma"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
