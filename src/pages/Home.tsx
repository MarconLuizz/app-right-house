import { useNavigate } from "react-router-dom";
import { Faq } from "../components/Faq" 
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
          <div className="flex gap-3 mt-4 flex-col sm:flex-row">
            <Button
              size="lg"
              className="bg-card text-primary hover:bg-card/90 font-semibold text-base px-8 animate-fade-in"
              style={{ animationDelay: "0.2s" }}
              onClick={() => navigate("/simulation")}
            >
              Comece agora <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-primary-foreground/5" />
        <div className="absolute -bottom-32 -left-32 w-125 h-125 rounded-full bg-primary-foreground/5" />
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

      {/* FAQ */}
      <section>
        <h1 className="font-heading text-3xl md:text-4xl font-bold text-center mb-5">Perguntas Frequentes</h1>
        <div className="mx-auto bg-background min-h-140 pt-10">
            <Faq question="O que são Amortizações?" 
                 answer="Amortização é o pagamento antecipado de parte da dívida de um financiamento. Quando você faz uma amortização, o valor pago é abatido diretamente do saldo devedor,
                reduzindo a quantia que ainda falta pagar. Isso pode trazer benefícios como redução do valor das parcelas futuras ou redução do prazo total do financiamento. 
                Como os juros do financiamento são calculados sobre o saldo devedor, amortizar a dívida geralmente diminui o valor total de juros pagos ao longo do contrato.
                
                Exemplo: se você recebeu um bônus, uma herança ou possui saldo de FGTS disponível, pode utilizar esse dinheiro para amortizar o 
                financiamento e economizar no custo final do imóvel."></Faq>
            <Faq question="Quais as diferenças entre amortização de prazo e parcela?" 
                 answer="Amortizar o prazo reduz a duração do contrato (você quita a dívida mais rápido), o que gera uma grande economia no total de juros. 
                 Já amortizar a parcela diminui o valor mensal que você paga, mantendo o prazo original. A amortização do prazo pode ser tende a gerar uma economia maior, porém mantém-se
                 o valor mensal das parcelas, enquanto a amortização das parcelas pode ser uma opção boa caso a pessoa que deseja diminuir o valor mensal das parcelas."></Faq>
            <Faq question="Quais as vantagens e desvantagens do consórcio?" 
                 answer="As principais vantagens do consórcio são a ausência de juros e o parcelamento mensal, sendo uma opção boa pra quem busca a aquisição de um bem de maneira mais acessível.
                 Já nas principais desvantagens temos o possível longo tempo de aquisição devido a dinâmica de contemplação, que pode demorar anos dependendo do caso, e as taxas administrativas,
                 que podem vir a ser altas em alguns casos tornando a opção menos barata do que o financiamento."></Faq>
            <Faq question="Quais as vantagens e desvantagens do financiamento?" 
                 answer="As principais vantagens são a possibilidade do uso do bem de forma imediata, os longos prazos de pagamento, que podem extender em alguns casos a 35 anos e a
                 possibilidade do uso de FGTS como entrada ou para quitar parcelas futuras. Já as desvantagens são os juros a serem pagos nas parcelas, preços que aumentam bastante
                 conforme o tempo de pagamento devido aos juros e taxas adicionais que também contribuem para o aumento do preço."></Faq>
            <Faq question="Consórcio ou financiamento: qual o melhor para minha situação?" 
                 answer="O consórcio tende a ser uma opção melhor pra quem quer pagar menos no bem, e ao mesmo tempo não prioriza um curto tempo de aquisição. 
                 É importante entender também que quanto maior o prazo de aquisição, mais vantajoso o consórcio tende a ser financeiramente por conta dos juros do financiamento. Já o financiamento
                 tende a ser mais positivo caso a pessoa queira realizar a aquisição em pouco tempo, pois em muitos casos, o valor do juros acaba sendo menor que o valor das taxas administrativas 
                 do consórcio, e também para quem deseja realizar a aquisição de forma imediata ou mais rápida e não se importa de pagar um pouco a mais, visto que no caso do consórcio, 
                 a aquisição pode levar bastante tempo. No fim, a decisão depende das prioridades do investidor naquele momento."></Faq>
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