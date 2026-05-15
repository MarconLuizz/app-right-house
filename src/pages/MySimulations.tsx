export default function MySimulations() {
    //Simulações de exemplo, futuramente serão buscadas do banco de dados
    const simulations = [
        {
            data: "14/05/2025",
            valorImovel: "R$ 2.000.000",
            prazo: "5 anos",
            financiamento: "R$ 42.000",
            consorcio: "R$ 40.000",
            economia: "R$ 100.000"
        },

        {
            data: "14/05/2025",
            valorImovel: "R$ 800.000",
            prazo: "10 anos",
            financiamento: "R$ 8.000",
            consorcio: "R$ 6.500",
            economia: "R$ 75.000"
        }
    ]

    return (
    <>
        <div className="bg-[#f9f9fa] m-0 pb-10 pt-10">
            <div className="w-[65%] min-h-[500px] bg-white shadow-[0_2px_10px_rgba(0,0,0,0.08)] mx-auto p-[30px] rounded-[20px]">
            <h1 className="text-3xl font-bold mb-[44px]">Histórico de simulações</h1>
                <div className="flex flex-col gap-6">

                    {simulations.map((simulation, index) => (

                        <div key={index} className="w-[42%] border border-[#dcdcdc] rounded-[15px] p-6 shadow-sm bg-[#fdfdfd] ml-2 hover:scale-[1.02] transition duration-300">
                            <div className="grid gap-1">

                                <p>
                                    <strong>Data:</strong> {simulation.data}
                                </p>

                                <p>
                                    <strong>Preço imóvel:</strong> {simulation.valorImovel}
                                </p>

                                <p>
                                    <strong>Prazo:</strong> {simulation.prazo}
                                </p>

                                <p>
                                    <strong>Parcela financiamento:</strong> {simulation.financiamento}
                                </p>

                                <p>
                                    <strong>Parcela consórcio:</strong> {simulation.consorcio}
                                </p>

                                <p>
                                    <strong>Economia:</strong> {simulation.economia}
                                </p>

                            </div>

                            <div className="flex justify-start mt-6">

                                <button className="bg-blue-500 text-white px-2 py-2 text-sm rounded-[10px] hover:bg-blue-600 transition">
                                    Ver detalhes
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