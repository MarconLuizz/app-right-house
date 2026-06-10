import { useEffect, useState } from "react";
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

const initialForm: SimulationInput = {
    valorImovel: 500000,
    valorEntrada: 50000,
    prazoAnos: 20,
    taxaJurosAnual: 10,
    taxaAdminConsorcio: 18,
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

function ResultCard({ simulation }: { simulation: SimulationResponse }) {
    const { financiamento, consorcio, recomendacao, economia } = simulation.result;

    return (
        <div className="mt-8 border border-[#dcdcdc] rounded-[15px] p-6 shadow-sm bg-[#fdfdfd]">
            <h2 className="text-2xl font-bold mb-4">Resultado da simulação</h2>

            <div className="grid grid-cols-[1fr_1fr] gap-5">
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

            <p className="mt-4">
                <strong>Economia estimada:</strong> {moneyFormatter.format(economia)}
            </p>
            <p className="mt-2">{recomendacao}</p>
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

    const updateField = (field: keyof SimulationInput, value: string) => {
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
            <>
            <div className="bg-[#f9f9fa] m-0">
            <div className="w-full">
            <div className="w-[54%] min-h-[500px] bg-white shadow-[0_2px_10px_rgba(0,0,0,0.08)] mx-auto my-10 p-[30px] rounded-[20px]">
                <h1 className="mb-7 text-4xl font-bold">Hora de dar o primeiro passo na sua conquista</h1>
                <form id="simulation-form" onSubmit={handleCalculate} className="grid grid-cols-[1fr_1fr] gap-5">
                    <div className="flex flex-col gap-2">
                        <label>Nome completo</label>
                        <input className="h-[41px] bg-[#f8f8f8] border text-base px-[15px] py-0 rounded-[10px] border-solid border-[#ccc]" type="text" placeholder="Digite seu nome" value={profileForm.nome} onChange={(event) => updateProfileField("nome", event.target.value)}></input>
                    </div>
                    <div className="flex flex-col gap-2">
                        <label>Data de nascimento</label>
                        <input className="h-[41px] bg-[#f8f8f8] border text-base px-[15px] py-0 rounded-[10px] border-solid border-[#ccc]" type="date" value={profileForm.dataNascimento} onChange={(event) => updateProfileField("dataNascimento", event.target.value)}></input>
                    </div>
                    <div className="flex flex-col gap-2">
                        <label>Email</label>
                        <input className="h-[41px] bg-[#f8f8f8] border text-base px-[15px] py-0 rounded-[10px] border-solid border-[#ccc]" type="email" placeholder="nome@gmail.com" value={profileForm.email} onChange={(event) => updateProfileField("email", event.target.value)}></input>
                    </div>
                    <div className="flex flex-col gap-2">
                        <label>Celular</label>
                        <input className="h-[41px] bg-[#f8f8f8] border text-base px-[15px] py-0 rounded-[10px] border-solid border-[#ccc]" type="text" placeholder="(00) 00000-0000" value={profileForm.celular} onChange={(event) => updateProfileField("celular", event.target.value)}></input>
                    </div>
                    <div className="flex flex-col gap-2">
                        <label>Renda</label>
                        <input className="h-[41px] bg-[#f8f8f8] border text-base px-[15px] py-0 rounded-[10px] border-solid border-[#ccc]" type="text" placeholder="R$ 00.000,00" value={profileForm.renda} onChange={(event) => updateProfileField("renda", event.target.value)}></input>
                    </div>
                    <div className="flex flex-col gap-2">
                        <label>Valor do imóvel</label>
                        <input className="h-[41px] bg-[#f8f8f8] border text-base px-[15px] py-0 rounded-[10px] border-solid border-[#ccc]" type="number" value={form.valorImovel} onChange={(event) => updateField("valorImovel", event.target.value)} required></input>
                    </div>
                    <div className="flex flex-col gap-2">
                        <label>Tipo do imóvel</label>
                        <select className="h-[41px] bg-[#f8f8f8] border text-base px-[15px] py-0 rounded-[10px] border-solid border-[#ccc]" value={profileForm.tipoImovel} onChange={(event) => updateProfileField("tipoImovel", event.target.value)}>
                            <option>Casa</option>
                            <option>Apartamento</option>
                            <option>Terreno</option>
                        </select>
                    </div>
                    <div className="flex flex-col gap-2">
                        <label>Modalidade de trabalho</label>
                        <select className="h-[41px] bg-[#f8f8f8] border text-base px-[15px] py-0 rounded-[10px] border-solid border-[#ccc]" value={profileForm.modalidadeTrabalho} onChange={(event) => updateProfileField("modalidadeTrabalho", event.target.value)}>
                            <option>CLT</option>
                            <option>Autônomo</option>
                            <option>PJ</option>
                            <option>Servidor Público</option>
                        </select>
                    </div>
                    <div className="flex flex-col gap-2">
                        <label>Quando pretende comprar</label>
                        <select className="h-[41px] bg-[#f8f8f8] border text-base px-[15px] py-0 rounded-[10px] border-solid border-[#ccc]" value={profileForm.quandoComprar} onChange={(event) => updateProfileField("quandoComprar", event.target.value)}>
                            <option>Em até 6 meses</option>
                            <option>Em até 1 ano</option>
                            <option>Mais de 1 ano</option>
                        </select>
                    </div>
                    <div className="flex flex-col gap-2">
                        <label>Prazo do financiamento</label>
                        <input className="h-[41px] bg-[#f8f8f8] border text-base px-[15px] py-0 rounded-[10px] border-solid border-[#ccc]" type="number" value={form.prazoAnos} onChange={(event) => updateField("prazoAnos", event.target.value)} required></input>
                    </div>
                    <div className="flex flex-col gap-2">
                        <label>Valor de entrada</label>
                        <input className="h-[41px] bg-[#f8f8f8] border text-base px-[15px] py-0 rounded-[10px] border-solid border-[#ccc]" type="number" value={form.valorEntrada} onChange={(event) => updateField("valorEntrada", event.target.value)} required></input>
                    </div>
                    <div className="flex flex-col gap-2">
                        <label>Taxa de juros anual (%)</label>
                        <input className="h-[41px] bg-[#f8f8f8] border text-base px-[15px] py-0 rounded-[10px] border-solid border-[#ccc]" type="number" step="0.01" value={form.taxaJurosAnual} onChange={(event) => updateField("taxaJurosAnual", event.target.value)} required></input>
                    </div>
                    <div className="flex flex-col gap-2">
                        <label>Taxa administrativa do consórcio (%)</label>
                        <input className="h-[41px] bg-[#f8f8f8] border text-base px-[15px] py-0 rounded-[10px] border-solid border-[#ccc]" type="number" step="0.01" value={form.taxaAdminConsorcio} onChange={(event) => updateField("taxaAdminConsorcio", event.target.value)} required></input>
                    </div>
                    <div className="flex items-center gap-3">
                        <span>Deseja utilizar FGTS?</span>
                        <button
                            type="button"
                            onClick={() => updateProfileField("usarFgts", !profileForm.usarFgts)}
                            className={`
                                w-12
                                h-6
                                rounded-full
                                transition
                                duration-300
                                ${profileForm.usarFgts ? "bg-green-500" : "bg-gray-400"}
                            `}
                        >
                        <div
                            className={`
                                w-5
                                h-5
                                bg-white
                                rounded-full
                                transition
                                duration-300
                                ${profileForm.usarFgts ? "translate-x-6" : "translate-x-1"}
                            `}
                        />
                        </button>
                    </div>
                        {profileForm.usarFgts && (
                            <div className="flex flex-col gap-2 mt-4">
                                <input
                                    className="h-[41px] bg-[#f8f8f8] border text-base px-[15px] rounded-[10px] border-[#ccc]"
                                    type="text"
                                    placeholder="R$ 00000,00"
                                    value={profileForm.valorFgts}
                                    onChange={(event) => updateProfileField("valorFgts", event.target.value)}
                                />
                            </div>
                        )}
                </form>
                <div className="w-full flex justify-end gap-3 mt-[30px] mb-4">
                    <Button type="submit" form="simulation-form" className="text-[white] bg-[rgb(67,101,250)] px-9 py-3 rounded-[10px] border-[none]" disabled={loading}>
                        {loading ? "Calculando..." : "Ver resultado"}
                    </Button>
                    {isAuthenticated && (
                        <Button type="button" variant="outline" onClick={handleSave} disabled={saving}>
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
    </div>
        </>
    );

}
