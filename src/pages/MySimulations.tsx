import { useEffect, useState } from "react";
import { toast } from "../hook/use-toast";
import { deleteSimulation, getSimulations, type SavedSimulation } from "../lib/api";

const moneyFormatter = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
});

function formatDate(value?: string) {
    if (!value) {
        return "Sem data";
    }

    return new Intl.DateTimeFormat("pt-BR").format(new Date(value));
}

export default function MySimulations() {
    const [simulations, setSimulations] = useState<SavedSimulation[]>([]);
    const [loading, setLoading] = useState(true);
    const [deletingId, setDeletingId] = useState<string | null>(null);

    useEffect(() => {
        let isMounted = true;

        getSimulations()
            .then((data) => {
                if (isMounted) {
                    setSimulations(data);
                }
            })
            .catch((err: unknown) => {
                const message = err instanceof Error ? err.message : "Não foi possível buscar o histórico.";
                toast({ title: "Erro", description: message, variant: "destructive" });
            })
            .finally(() => {
                if (isMounted) {
                    setLoading(false);
                }
            });

        return () => {
            isMounted = false;
        };
    }, []);

    const handleDelete = async (id: string) => {
        setDeletingId(id);

        try {
            await deleteSimulation(id);
            setSimulations((currentSimulations) => currentSimulations.filter((simulation) => simulation.id !== id));
            toast({ title: "Sucesso!", description: "Simulação removida." });
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : "Não foi possível remover a simulação.";
            toast({ title: "Erro", description: message, variant: "destructive" });
        } finally {
            setDeletingId(null);
        }
    };

    return (
    <>
        <div className="bg-[#f9f9fa] m-0 pb-10 pt-10">
            <div className="w-[65%] min-h-[500px] bg-white shadow-[0_2px_10px_rgba(0,0,0,0.08)] mx-auto p-[30px] rounded-[20px]">
            <h1 className="text-3xl font-bold mb-[44px]">Histórico de simulações</h1>
                <div className="flex flex-col gap-6">

                    {loading && (
                        <p className="ml-2 text-gray-500">Carregando histórico...</p>
                    )}

                    {!loading && simulations.length === 0 && (
                        <p className="ml-2 text-gray-500">Nenhuma simulação salva ainda.</p>
                    )}

                    {simulations.map((simulation) => (

                        <div key={simulation.id} className="w-[42%] border border-[#dcdcdc] rounded-[15px] p-6 shadow-sm bg-[#fdfdfd] ml-2 hover:scale-[1.02] transition duration-300">
                            <div className="grid gap-1">

                                <p>
                                    <strong>Data:</strong> {formatDate(simulation.created_at)}
                                </p>

                                <p>
                                    <strong>Preço imóvel:</strong> {moneyFormatter.format(simulation.valor_imovel)}
                                </p>

                                <p>
                                    <strong>Prazo:</strong> {simulation.prazo_anos} anos
                                </p>

                                <p>
                                    <strong>Parcela financiamento:</strong> {moneyFormatter.format(simulation.financiamento_parcela)}
                                </p>

                                <p>
                                    <strong>Parcela consórcio:</strong> {moneyFormatter.format(simulation.consorcio_parcela)}
                                </p>

                                <p>
                                    <strong>Economia:</strong> {moneyFormatter.format(simulation.economia)}
                                </p>

                            </div>

                            <div className="flex justify-start mt-6">

                                <button
                                    className="bg-blue-500 text-white px-2 py-2 text-sm rounded-[10px] hover:bg-blue-600 transition"
                                    disabled={deletingId === simulation.id}
                                    onClick={() => void handleDelete(simulation.id)}
                                >
                                    {deletingId === simulation.id ? "Removendo..." : "Remover"}
                                </button>

                            </div>

                        </div>

                    ))}

                </div>


            </div>
        </div>
       
    </>
    );
}
