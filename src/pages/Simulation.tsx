import { useEffect, useState } from "react";
import ResultCard from "../components/SimulationResults";
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
    valorFgts: 0,
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
};

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

    const updateField = (field: "valorImovel" | "valorEntrada" | "valorFgts" | "prazoMeses", value: string) => {
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

    const updateFgtsUsage = () => {
        const shouldUseFgts = !profileForm.usarFgts;

        updateProfileField("usarFgts", shouldUseFgts);

        if (!shouldUseFgts) {
            updateField("valorFgts", "0");
        }
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

            {!simulation ? (
                <>
                    <h1 className="mb-7 text-4xl font-bold">Hora de dar o primeiro passo na sua conquista</h1>
                        {<form id="simulation-form" onSubmit={handleCalculate} className="grid gap-5 md:grid-cols-2">
                    {/*
                        - dados possivelmente destinados a uma futura página de perfil
                        - nao sao usados no cálculo nem são salvos no histórico
                    */}
                    {/*
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
                    */}
                    <div className="flex flex-col gap-2">
                        <label>Valor do imóvel</label>
                        <input className="h-[41px] rounded-[10px] border border-solid border-[#ccc] bg-[#f8f8f8] px-[15px] py-0 text-base" type="number" min="1" value={form.valorImovel} onChange={(event) => updateField("valorImovel", event.target.value)} required />
                    </div>
                    {/*
                       - campos de perfil/preferência vira perfil editável ou entra em alguma regra de recomendação.
                    */}
                    {/*
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
                    */}
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
                    <div className="flex flex-col gap-2 ">
                        <div className="flex items-center gap-3">
                            <label>Deseja utilizar FGTS?</label>
                            <button
                                type="button"
                                onClick={updateFgtsUsage}
                                className={`h-6 w-12 rounded-full transition duration-300 ${profileForm.usarFgts ? "bg-green-500" : "bg-gray-400"}`}
                            >
                                <div className={`h-5 w-5 rounded-full bg-white transition duration-300 ${profileForm.usarFgts ? "translate-x-6" : "translate-x-1"}`} />
                            </button>
                        </div>
                        {profileForm.usarFgts && (
                            <div className="flex flex-col gap-2">
                                <input
                                    className="h-[41px] rounded-[10px] border border-[#ccc] bg-[#f8f8f8] px-[15px] text-base"
                                    type="number"
                                    min="0"
                                    placeholder="R$ 00000,00"
                                    value={form.valorFgts}
                                    onChange={(event) => updateField("valorFgts", event.target.value)}
                                />
                            </div>
                        )}
                    </div>
                    <div className="mb-4 mt-[30px] flex w-full flex-wrap gap-3">
                        <Button
                            type="submit"
                            form="simulation-form"
                            className="rounded-2.5 border-[none] bg-[rgb(67,101,250)] px-9 py-3 text-[white]"
                            disabled={loading}
                        >
                            {loading ? "Calculando..." : "Ver resultado"}
                        </Button>
                    </div>
                </form>}
                    
                    
                </>
            ) : (
                <>
                    <ResultCard simulation={simulation} /> 
                    <div className="flex grid-cols-2 gap-8 mt-8">
                        {isAuthenticated && (
                                <Button className="" type="button" variant="defaultV2" onClick={handleSave} disabled={saving}>{saving ? "Salvando..." : "Salvar simulação"}</Button>
                        )}
                        <div className="mb-4 flex justify-end gap-3">
                            <Button type="button" variant="outlineV2" onClick={() => setSimulation(null)}>Nova simulação</Button>
                        </div>
                        {!isAuthenticated && (
                            <p className="mt-2 text-sm text-gray-500">
                                Para salvar no histórico, entre na sua conta.
                            </p>
                        )} {/*Trocar por botao de salvar + verificação*/}
                    </div>
                    
                </>
            )}

        </div>
    </div>
    
)};
