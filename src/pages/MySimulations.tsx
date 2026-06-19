import { useEffect, useState } from "react";
import { toast } from "../hook/use-toast";
import { deleteSimulation, getSimulations, type SavedSimulation } from "../lib/api";
import { Trash2, Eye } from "lucide-react";


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

function formatPrazo(simulation: SavedSimulation) {
    if (simulation.prazo_meses) {
        return `${simulation.prazo_meses} meses`;
    }

    if (simulation.prazo_anos) {
        return `${simulation.prazo_anos * 12} meses`;
    }

    return "Sem prazo";
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
            <div className="w-[65%] min-h-180 bg-white mx-auto p-2.5">
                <div className="flex flex-col">
                    <div className="grid grid-cols-5 gap-4 px-4 pt-2 pb-4 border-b mb-1">
                        <span>Data</span>
                                <span>Valor do imóvel</span>
                                <span>Prazo</span>
                                <span>Economia</span>
                    </div>   
                    {loading && (
                        <p className="ml-4 mt-2 text-gray-500">Carregando histórico...</p>
                    )}

                    {!loading && simulations.length === 0 && (
                        <strong><p className="text-center mt-30 text-gray-500">Você ainda não possui simulações salvas</p></strong>
                    )}
                    {simulations.map((simulation) => (

                        <div key={simulation.id} className="grid grid-cols-5 gap-4 px-4 py-4 border-b bg-[#fdfdfd] hover:bg-[#f5f5f5] transition-all duration-200 text-sm font-semibold">
                                
                                
                                <span>{formatDate(simulation.created_at)}</span>
                                <span>
                                    {moneyFormatter.format(simulation.valor_imovel)}
                                </span>

                                <span>
                                    {formatPrazo(simulation)}
                                </span>

                                <span>
                                    {moneyFormatter.format(simulation.economia)}
                                </span>   
                                <div className="flex gap-2 px-24">
                                    <button className="p-0.5 rounded-sm bg-blue-300 hover:bg-blue-400"><Eye></Eye></button>
                                    <button className="p-0.5 rounded-sm bg-gray-200 hover:bg-gray-400" disabled={deletingId === simulation.id} 
                                        onClick={() => void handleDelete(simulation.id)}>
                                        <Trash2></Trash2>
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
