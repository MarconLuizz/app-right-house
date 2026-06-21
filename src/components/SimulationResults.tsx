import { useMemo, useState } from "react";
import type { SimulationResponse } from "../lib/api";

const moneyFormatter = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
});

export default function ResultCard({ simulation }: { simulation: SimulationResponse }) {
    const { financiamento, consorcio } = simulation.result;

    return (
        <div data-testid="resultado-simulacao" className="mt-8 rounded-[15px] border border-[#dcdcdc] bg-[#fdfdfd] p-6 shadow-sm">
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
    const valorEntradaTotal = simulation.input.valorEntrada + simulation.input.valorFgts;
    const [hoveredMonth, setHoveredMonth] = useState<number | null>(null);

    const financingSeries = useMemo(
        () =>
            Array.from(
                { length: financiamento.prazoMeses + 1 },
                (_, index) => valorEntradaTotal + financiamento.parcelaMensal * index,
            ),
        [valorEntradaTotal, financiamento.parcelaMensal, financiamento.prazoMeses],
    );

    const consortiumSeries = useMemo(
        () =>
            Array.from(
                { length: consorcio.prazoMeses + 1 },
                (_, index) => valorEntradaTotal + consorcio.parcelaMensal * index,
            ),
        [consorcio.parcelaMensal, consorcio.prazoMeses, valorEntradaTotal],
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