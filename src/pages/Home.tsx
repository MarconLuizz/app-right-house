import { useNavigate } from "react-router-dom";
import { ArrowRight, Building2, ShieldCheck, TrendingUp } from "lucide-react";
import { Button } from "../components/ui/button";

const features = [
  {
    icon: TrendingUp,
    title: "Simulação precisa",
    description: "Cálculos baseados no Sistema Price e taxa administrativa real de consórcios.",
  },
  {
    icon: Building2,
    title: "Compare modalidades",
    description: "Veja lado a lado financiamento e consórcio para tomar a melhor decisão.",
  },
  {
    icon: ShieldCheck,
    title: "Recomendação inteligente",
    description: "Receba orientação personalizada com base no seu perfil financeiro.",
  },
];

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Hero */}
      <section className="relative overflow-hidden gradient-hero py-24 md:py-36">
        <div className="container relative z-10 flex flex-col items-center text-center gap-6 mx-auto px-4">
          <h1 className="font-heading text-4xl md:text-6xl font-extrabold tracking-tight text-primary-foreground max-w-3xl animate-fade-in">
            Simule seu financiamento e comece a fazer seu sonho virar realidade
          </h1>
          <p className="text-lg md:text-xl text-primary-foreground/80 max-w-2xl animate-fade-in" style={{ animationDelay: "0.1s" }}>
            Compare financiamento e consórcio de forma simples e descubra a melhor opção para conquistar seu imóvel.
          </p>
          <Button
            size="lg"
            className="mt-4 bg-card text-primary hover:bg-card/90 font-semibold text-base px-8 animate-fade-in"
            style={{ animationDelay: "0.2s" }}
            onClick={() => navigate("/simulation")}
          >
            Comece agora <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-primary-foreground/5" />
        <div className="absolute -bottom-32 -left-32 w-[500px] h-[500px] rounded-full bg-primary-foreground/5" />
      </section>

      {/* Features */}
      <section id="como-funciona" className="scroll-mt-32 py-20 md:scroll-mt-24 md:py-28">
        <div className="container mx-auto px-4">
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-center mb-4 text-foreground">Como funciona</h2>
          <p className="text-center text-muted-foreground mb-14 max-w-xl mx-auto">
            Em poucos passos, você terá uma visão clara de qual modalidade se encaixa melhor no seu momento de vida.
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((f, i) => (
              <div
                key={f.title}
                className="bg-card rounded-xl p-8 shadow-card hover:shadow-elevated transition-shadow duration-300 animate-fade-in"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <div className="h-12 w-12 rounded-lg gradient-hero flex items-center justify-center mb-5">
                  <f.icon className="h-6 w-6 text-primary-foreground" />
                </div>
                <h3 className="font-heading text-xl font-semibold mb-2 text-foreground">{f.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-secondary">
        <div className="container text-center mx-auto px-4">
          <h2 className="font-heading text-2xl md:text-3xl font-bold mb-4 text-foreground">Pronto para simular?</h2>
          <p className="text-muted-foreground mb-8 max-w-lg mx-auto">
            É gratuito, rápido e vai te ajudar a encontrar as melhores opções para seu momento de vida.
          </p>
          <Button size="lg" onClick={() => navigate("/simulation")}>
            Iniciar simulação <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t mt-auto">
        <div className="container text-center text-sm text-muted-foreground mx-auto px-4">
          © 2025 SimulaFácil — Projeto acadêmico. Simulações com fins educacionais.
        </div>
      </footer>
    </div>
  );
}
