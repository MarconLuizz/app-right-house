import { useEffect, useMemo, useState } from "react";
import { Button } from "../components/ui/button";
import { toast } from "../hook/use-toast";
import {
    calculateSimulation,
    isAuthenticated as hasSession,
    saveSimulation,
    subscribeToAuthChanges,
    type SimulationInput,
    type SimulationResponse,
} from "../lib/api";

const PRAZO_MINIMO_MESES = 6;
const PRAZO_MAXIMO_MESES = 420;
const TAXA_JUROS_ANUAL_FIXA = 10;
const TAXA_ADMIN_CONSORCIO_FIXA = 1.15;

const initialForm: SimulationInput = {
    valorImovel: 500000,
    valorEntrada: 50000,
    prazoMeses: 240,
    taxaJurosAnual: TAXA_JUROS_ANUAL_FIXA,
    taxaAdminConsorcio: TAXA_ADMIN_CONSORCIO_FIXA,
};

const initialProfileForm = {
    nome: "",
    dataNascimento: "",
    email: "",
    celular: "",
    renda: "",
    tipoImovel: "Casa",
    modalidadeTrabalho: "CLT",
    quandoComprar: "Em até 6 meses",
    usarFgts: false,
    valorFgts: "",
};

const moneyFormatter = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
});

function buildChartPoints(values: number[], maxValue: number, width: number, height: number) {
    if (values.length === 1) {
        return `0,${height / 2}`;
    }

    return values
        .map((value, index) => {
            const x = (index / (values.length - 1)) * width;
            const y = height - (value / maxValue) * height;
            return `${x},${y}`;
        })
        .join(" ");
}

function getChartY(value: number, maxValue: number, height: number) {
    return height - (value / maxValue) * height;
}

function ComparisonChart({ simulation }: { simulation: SimulationResponse }) {
    const { financiamento, consorcio } = simulation.result;
    const entrada = simulation.input.valorEntrada;
    const [hoveredMonth, setHoveredMonth] = useState<number | null>(null);

    const financingSeries = useMemo(
        () =>
            Array.from(
                { length: financiamento.prazoMeses + 1 },
                (_, index) => entrada + financiamento.parcelaMensal * index,
            ),
        [entrada, financiamento.parcelaMensal, financiamento.prazoMeses],
    );

    const consortiumSeries = useMemo(
        () =>
            Array.from(
                { length: consorcio.prazoMeses + 1 },
                (_, index) => entrada + consorcio.parcelaMensal * index,
            ),
        [consorcio.parcelaMensal, consorcio.prazoMeses, entrada],
    );

    const maxValue = Math.max(
        financingSeries[financingSeries.length - 1] ?? 0,
        consortiumSeries[consortiumSeries.length - 1] ?? 0,
        1,
    );

    const width = 760;
    const height = 320;
    const totalMonths = simulation.input.prazoMeses;
    const currentMonth = hoveredMonth ?? totalMonths;
    const hoverX = totalMonths === 0 ? 0 : (currentMonth / totalMonths) * width;
    const financingValue =
        financingSeries[currentMonth] ?? financingSeries[financingSeries.length - 1] ?? 0;
    const consortiumValue =
        consortiumSeries[currentMonth] ?? consortiumSeries[consortiumSeries.length - 1] ?? 0;
    const financingY = getChartY(financingValue, maxValue, height);
    const consortiumY = getChartY(consortiumValue, maxValue, height);

    return (
        <div className="mt-6 rounded-[15px] border border-[#dcdcdc] bg-white p-4">
            <div className="mb-3 flex items-center justify-between gap-4">
                <div>
                    <h3 className="font-bold">Evolução do custo total</h3>
                    <p className="text-sm text-gray-500">Passe o mouse para ver o valor por mês.</p>
                </div>
                <div className="flex gap-4 text-sm">
                    <span className="flex items-center gap-2">
                        <span className="h-2.5 w-2.5 rounded-full bg-[rgb(67,101,250)]" />
                        Financiamento
                    </span>
                    <span className="flex items-center gap-2">
                        <span className="h-2.5 w-2.5 rounded-full bg-[rgb(16,185,129)]" />
                        Consórcio
                    </span>
                </div>
            </div>

            <div className="overflow-x-auto">
                <div className="relative min-w-[760px]">
                    {hoveredMonth !== null && (
                        <div
                            className="pointer-events-none absolute z-10 rounded-[12px] border border-[#dcdcdc] bg-white/95 px-3 py-2 text-sm shadow-lg"
                            style={{
                                left: Math.min(Math.max(hoverX + 12, 12), width - 190),
                                top: Math.max(
                                    Math.min(Math.min(financingY, consortiumY) - 90, height - 110),
                                    12,
                                ),
                            }}
                        >
                            <p className="font-semibold">Mês {currentMonth}</p>
                            <p className="text-[rgb(67,101,250)]">
                                Financiamento: {moneyFormatter.format(financingValue)}
                            </p>
                            <p className="text-[rgb(16,185,129)]">
                                Consórcio: {moneyFormatter.format(consortiumValue)}
                            </p>
                        </div>
                    )}

                    <svg
                        viewBox={`0 0 ${width} ${height}`}
                        className="h-[320px] w-full min-w-[760px] rounded-[12px] bg-[#f8fafc]"
                        role="img"
                        aria-label="Gráfico comparando financiamento e consórcio ao longo do tempo"
                        onMouseLeave={() => setHoveredMonth(null)}
                        onMouseMove={(event) => {
                            const bounds = event.currentTarget.getBoundingClientRect();
                            const relativeX = ((event.clientX - bounds.left) / bounds.width) * width;
                            const month = Math.round((relativeX / width) * totalMonths);
                            setHoveredMonth(Math.min(Math.max(month, 0), totalMonths));
                        }}
                    >
                        <line x1="0" y1="0" x2={width} y2="0" stroke="#e5e7eb" strokeWidth="1" />
                        <line
                            x1="0"
                            y1={height / 2}
                            x2={width}
                            y2={height / 2}
                            stroke="#e5e7eb"
                            strokeWidth="1"
                        />
                        <line x1="0" y1={height} x2={width} y2={height} stroke="#d1d5db" strokeWidth="1" />
                        <line x1="0" y1="0" x2="0" y2={height} stroke="#d1d5db" strokeWidth="1" />
                        {hoveredMonth !== null && (
                            <line
                                x1={hoverX}
                                y1="0"
                                x2={hoverX}
                                y2={height}
                                stroke="#94a3b8"
                                strokeDasharray="6 6"
                                strokeWidth="1.5"
                            />
                        )}
                        <polyline
                            fill="none"
                            stroke="rgb(67,101,250)"
                            strokeWidth="3"
                            points={buildChartPoints(financingSeries, maxValue, width, height)}
                        />
                        <polyline
                            fill="none"
                            stroke="rgb(16,185,129)"
                            strokeWidth="3"
                            points={buildChartPoints(consortiumSeries, maxValue, width, height)}
                        />
                        {hoveredMonth !== null && (
                            <>
                                <circle cx={hoverX} cy={financingY} r="5" fill="rgb(67,101,250)" />
                                <circle cx={hoverX} cy={consortiumY} r="5" fill="rgb(16,185,129)" />
                            </>
                        )}
                    </svg>
                </div>
            </div>

            <div className="mt-3 flex justify-between text-sm text-gray-500">
                <span>0 mês (com entrada)</span>
                <span>{simulation.input.prazoMeses} meses</span>
            </div>
        </div>
    );
}

function FeedbackHighlights({ simulation }: { simulation: SimulationResponse }) {
    const { financiamento, consorcio, economia } = simulation.result;

    const winner =
        consorcio.totalPago < financiamento.totalPago ? "consórcio" : "financiamento";

    const whyText =
        winner === "consórcio"
            ? "Melhor para seu cenário porque o custo total ficou menor, mesmo considerando entrada e taxa administrativa ao longo do prazo."
            : "Melhor para seu cenário porque o custo total ficou menor, mesmo com incidência de juros no parcelamento.";

    return (
        <div className="mt-6 grid gap-4 md:grid-cols-2">
            <div className="rounded-[15px] border border-[#dcdcdc] bg-white p-5">
                <h3 className="text-sm font-semibold uppercase tracking-[0.08em] text-gray-500">
                    Diferença total
                </h3>
                <p className="mt-2 text-2xl font-bold text-[rgb(67,101,250)]">
                    {moneyFormatter.format(economia)}
                </p>
                <p className="mt-2 text-sm text-gray-600">
                    O {winner} economiza esse valor em relação à outra modalidade neste cenário.
                </p>
            </div>

            <div className="rounded-[15px] border border-[#dcdcdc] bg-white p-5">
                <h3 className="text-sm font-semibold uppercase tracking-[0.08em] text-gray-500">
                    Melhor para seu cenário
                </h3>
                <p className="mt-2 text-lg font-bold capitalize">{winner}</p>
                <p className="mt-2 text-sm text-gray-600">{whyText}</p>
            </div>
        </div>
    );
}

function AlertCards() {
    const alerts = [
        {
            title: "Consórcio costuma ter menor custo total",
            text: "Pode ser uma boa opção quando a prioridade é pagar menos no fim, mas a contemplação não é imediata.",
        },
        {
            title: "Financiamento dá acesso mais rápido ao imóvel",
            text: "Em geral oferece previsibilidade de compra imediata, porém normalmente com custo total maior por causa dos juros.",
        },
        {
            title: "Entrada reduz impacto nas duas modalidades",
            text: "Quanto maior a entrada, menor tende a ser o valor contratado e, por consequência, o peso das parcelas e dos encargos.",
        },
    ];

    return (
        <div className="mt-6">
            <h3 className="mb-3 text-lg font-bold">Alertas e diferenças importantes</h3>
            <div className="grid gap-4 md:grid-cols-3">
                {alerts.map((alert) => (
                    <div key={alert.title} className="rounded-[15px] border border-[#dcdcdc] bg-white p-5">
                        <p className="font-semibold">{alert.title}</p>
                        <p className="mt-2 text-sm text-gray-600">{alert.text}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

function ResultCard({ simulation }: { simulation: SimulationResponse }) {
    const { financiamento, consorcio } = simulation.result;

    return (
        <div className="mt-8 rounded-[15px] border border-[#dcdcdc] bg-[#fdfdfd] p-6 shadow-sm">
            <h2 className="mb-4 text-2xl font-bold">Resultado da simulação</h2>

            <div className="grid gap-5 md:grid-cols-2">
                <div className="grid gap-1">
                    <h3 className="font-bold">Financiamento</h3>
                    <p>Parcela: {moneyFormatter.format(financiamento.parcelaMensal)}</p>
                    <p>Total pago: {moneyFormatter.format(financiamento.totalPago)}</p>
                    <p>Juros: {moneyFormatter.format(financiamento.totalJuros)}</p>
                </div>

                <div className="grid gap-1">
                    <h3 className="font-bold">Consórcio</h3>
                    <p>Parcela: {moneyFormatter.format(consorcio.parcelaMensal)}</p>
                    <p>Total pago: {moneyFormatter.format(consorcio.totalPago)}</p>
                    <p>Taxa adm.: {moneyFormatter.format(consorcio.taxaAdminTotal)}</p>
                </div>
            </div>

            <FeedbackHighlights simulation={simulation} />
            <ComparisonChart simulation={simulation} />
            <AlertCards />
        </div>
    );
}

export default function Simulation() {
    const [form, setForm] = useState<SimulationInput>(initialForm);
    const [profileForm, setProfileForm] = useState(initialProfileForm);
    const [simulation, setSimulation] = useState<SimulationResponse | null>(null);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const syncAuthState = () => setIsAuthenticated(hasSession());

        syncAuthState();

        return subscribeToAuthChanges(syncAuthState);
    }, []);

    const updateField = (field: "valorImovel" | "valorEntrada" | "prazoMeses", value: string) => {
        setForm((currentForm) => ({
            ...currentForm,
            [field]: Number(value),
        }));
    };

    const updateProfileField = (field: keyof typeof initialProfileForm, value: string | boolean) => {
        setProfileForm((currentForm) => ({
            ...currentForm,
            [field]: value,
        }));
    };

    const handleCalculate = async (event: React.FormEvent) => {
        event.preventDefault();
        setLoading(true);

        try {
            const result = await calculateSimulation(form);
            setForm(result.input);
            setSimulation(result);
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : "Não foi possível calcular a simulação.";
            toast({ title: "Erro", description: message, variant: "destructive" });
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        setSaving(true);

        try {
            const result = await saveSimulation(form);
            setForm(result.input);
            setSimulation(result);
            toast({ title: "Sucesso!", description: "Simulação salva no histórico." });
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : "Não foi possível salvar a simulação.";
            toast({ title: "Erro", description: message, variant: "destructive" });
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="bg-[#f9f9fa] px-4 py-8">
            <div className="mx-auto w-full max-w-5xl rounded-[20px] bg-white p-[30px] shadow-[0_2px_10px_rgba(0,0,0,0.08)]">
                <h1 className="mb-7 text-4xl font-bold">Hora de dar o primeiro passo na sua conquista</h1>

                <form id="simulation-form" onSubmit={handleCalculate} className="grid gap-5 md:grid-cols-2">
                    <div className="flex flex-col gap-2">
                        <label>Nome completo</label>
                        <input className="h-[41px] rounded-[10px] border border-solid border-[#ccc] bg-[#f8f8f8] px-[15px] py-0 text-base" type="text" placeholder="Digite seu nome" value={profileForm.nome} onChange={(event) => updateProfileField("nome", event.target.value)} />
                    </div>
                    <div className="flex flex-col gap-2">
                        <label>Data de nascimento</label>
                        <input className="h-[41px] rounded-[10px] border border-solid border-[#ccc] bg-[#f8f8f8] px-[15px] py-0 text-base" type="date" value={profileForm.dataNascimento} onChange={(event) => updateProfileField("dataNascimento", event.target.value)} />
                    </div>
                    <div className="flex flex-col gap-2">
                        <label>Email</label>
                        <input className="h-[41px] rounded-[10px] border border-solid border-[#ccc] bg-[#f8f8f8] px-[15px] py-0 text-base" type="email" placeholder="nome@gmail.com" value={profileForm.email} onChange={(event) => updateProfileField("email", event.target.value)} />
                    </div>
                    <div className="flex flex-col gap-2">
                        <label>Celular</label>
                        <input className="h-[41px] rounded-[10px] border border-solid border-[#ccc] bg-[#f8f8f8] px-[15px] py-0 text-base" type="text" placeholder="(00) 00000-0000" value={profileForm.celular} onChange={(event) => updateProfileField("celular", event.target.value)} />
                    </div>
                    <div className="flex flex-col gap-2">
                        <label>Renda</label>
                        <input className="h-[41px] rounded-[10px] border border-solid border-[#ccc] bg-[#f8f8f8] px-[15px] py-0 text-base" type="text" placeholder="R$ 00.000,00" value={profileForm.renda} onChange={(event) => updateProfileField("renda", event.target.value)} />
                    </div>
                    <div className="flex flex-col gap-2">
                        <label>Valor do imóvel</label>
                        <input className="h-[41px] rounded-[10px] border border-solid border-[#ccc] bg-[#f8f8f8] px-[15px] py-0 text-base" type="number" min="1" value={form.valorImovel} onChange={(event) => updateField("valorImovel", event.target.value)} required />
                    </div>
                    <div className="flex flex-col gap-2">
                        <label>Tipo do imóvel</label>
                        <select className="h-[41px] rounded-[10px] border border-solid border-[#ccc] bg-[#f8f8f8] px-[15px] py-0 text-base" value={profileForm.tipoImovel} onChange={(event) => updateProfileField("tipoImovel", event.target.value)}>
                            <option>Casa</option>
                            <option>Apartamento</option>
                            <option>Terreno</option>
                        </select>
                    </div>
                    <div className="flex flex-col gap-2">
                        <label>Modalidade de trabalho</label>
                        <select className="h-[41px] rounded-[10px] border border-solid border-[#ccc] bg-[#f8f8f8] px-[15px] py-0 text-base" value={profileForm.modalidadeTrabalho} onChange={(event) => updateProfileField("modalidadeTrabalho", event.target.value)}>
                            <option>CLT</option>
                            <option>Autônomo</option>
                            <option>PJ</option>
                            <option>Servidor Público</option>
                        </select>
                    </div>
                    <div className="flex flex-col gap-2">
                        <label>Quando pretende comprar</label>
                        <select className="h-[41px] rounded-[10px] border border-solid border-[#ccc] bg-[#f8f8f8] px-[15px] py-0 text-base" value={profileForm.quandoComprar} onChange={(event) => updateProfileField("quandoComprar", event.target.value)}>
                            <option>Em até 6 meses</option>
                            <option>Em até 1 ano</option>
                            <option>Mais de 1 ano</option>
                        </select>
                    </div>
                    <div className="flex flex-col gap-2">
                        <label>Prazo do financiamento e consórcio (em meses)</label>
                        <input className="h-[41px] rounded-[10px] border border-solid border-[#ccc] bg-[#f8f8f8] px-[15px] py-0 text-base" type="number" min={PRAZO_MINIMO_MESES} max={PRAZO_MAXIMO_MESES} value={form.prazoMeses} onChange={(event) => updateField("prazoMeses", event.target.value)} required />
                        <p className="text-sm text-gray-500">Informe um prazo entre {PRAZO_MINIMO_MESES} e {PRAZO_MAXIMO_MESES} meses.</p>
                    </div>
                    <div className="flex flex-col gap-2">
                        <label>Valor de entrada</label>
                        <input className="h-[41px] rounded-[10px] border border-solid border-[#ccc] bg-[#f8f8f8] px-[15px] py-0 text-base" type="number" min="0" value={form.valorEntrada} onChange={(event) => updateField("valorEntrada", event.target.value)} required />
                    </div>
                    <div className="flex flex-col gap-2">
                        <label>Taxa de juros anual do financiamento</label>
                        <input className="h-[41px] rounded-[10px] border border-solid border-[#ccc] bg-[#eef2ff] px-[15px] py-0 text-base text-gray-600" type="text" value={`${TAXA_JUROS_ANUAL_FIXA}% ao ano`} readOnly />
                    </div>
                    <div className="flex flex-col gap-2">
                        <label>Taxa administrativa do consórcio</label>
                        <input className="h-[41px] rounded-[10px] border border-solid border-[#ccc] bg-[#ecfdf5] px-[15px] py-0 text-base text-gray-600" type="text" value={`${TAXA_ADMIN_CONSORCIO_FIXA}% ao ano`} readOnly />
                    </div>
                    <div className="flex flex-col gap-2 md:col-span-2">
                        <div className="flex items-center gap-3">
                            <label>Deseja utilizar FGTS?</label>
                            <button
                                type="button"
                                onClick={() => updateProfileField("usarFgts", !profileForm.usarFgts)}
                                className={`h-6 w-12 rounded-full transition duration-300 ${profileForm.usarFgts ? "bg-green-500" : "bg-gray-400"}`}
                            >
                                <div className={`h-5 w-5 rounded-full bg-white transition duration-300 ${profileForm.usarFgts ? "translate-x-6" : "translate-x-1"}`} />
                            </button>
                        </div>
                        {profileForm.usarFgts && (
                            <div className="flex flex-col gap-2">
                                <input
                                    className="h-[41px] rounded-[10px] border border-[#ccc] bg-[#f8f8f8] px-[15px] text-base"
                                    type="text"
                                    placeholder="R$ 00000,00"
                                    value={profileForm.valorFgts}
                                    onChange={(event) => updateProfileField("valorFgts", event.target.value)}
                                />
                            </div>
                        )}
                    </div>
                </form>

                <div className="mb-4 mt-[30px] flex w-full flex-wrap justify-end gap-3">
                    <Button type="submit" form="simulation-form" className="rounded-[10px] border-[none] bg-[rgb(67,101,250)] px-9 py-3 text-[white]" disabled={loading}>
                        {loading ? "Calculando..." : "Ver resultado"}
                    </Button>
                    {isAuthenticated && (
                        <Button type="button" variant="outline" onClick={handleSave} disabled={saving || !simulation}>
                            {saving ? "Salvando..." : "Salvar simulação"}
                        </Button>
                    )}
                </div>
                {!isAuthenticated && (
                    <p className="mt-4 text-sm text-gray-500">
                        Você pode calcular sem login. Para salvar no histórico, entre na sua conta.
                    </p>
                )}
                {simulation && <ResultCard simulation={simulation} />}
            </div>
        </div>
    );
}
