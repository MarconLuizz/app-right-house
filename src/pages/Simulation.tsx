import { Button } from "../components/ui/button";
import { useState } from "react";



export default function Simulation() {

    const [usarFgts, setUsarFgts] = useState(false);
    return (
            <>
            <div className="bg-[#f9f9fa] m-0">
            <div className="w-full">
            <div className="w-[54%] min-h-[500px] bg-white shadow-[0_2px_10px_rgba(0,0,0,0.08)] mx-auto my-10 p-[30px] rounded-[20px]">
                <h1 className="mb-7 text-4xl font-bold">Hora de dar o primeiro passo na sua conquista</h1>
                <form className="grid grid-cols-[1fr_1fr] gap-5">
                    <div className="flex flex-col gap-2">
                        <label>Nome completo</label>
                        <input className="h-[41px] bg-[#f8f8f8] border text-base px-[15px] py-0 rounded-[10px] border-solid border-[#ccc]"  type="text" placeholder="Digite seu nome"></input>
                    </div>
                    <div className="flex flex-col gap-2">
                        <label>Data de nascimento</label>
                        <input className="h-[41px] bg-[#f8f8f8] border text-base px-[15px] py-0 rounded-[10px] border-solid border-[#ccc]"  type="date"></input>
                    </div>
                    <div className="flex flex-col gap-2">
                        <label>Email</label>
                        <input className="h-[41px] bg-[#f8f8f8] border text-base px-[15px] py-0 rounded-[10px] border-solid border-[#ccc]"  type="email" placeholder="nome@gmail.com"></input>
                    </div>
                    <div className="flex flex-col gap-2">
                        <label>Celular</label>
                        <input  className="h-[41px] bg-[#f8f8f8] border text-base px-[15px] py-0 rounded-[10px] border-solid border-[#ccc]" type="text" placeholder="(00) 00000-0000"></input>
                    </div>
                    <div className="flex flex-col gap-2">
                        <label>Renda</label>
                        <input className="h-[41px] bg-[#f8f8f8] border text-base px-[15px] py-0 rounded-[10px] border-solid border-[#ccc]"  type="text" placeholder="R$ 00.000,00"></input>
                    </div>
                    <div className="flex flex-col gap-2">
                        <label>Valor do imóvel</label>
                        <input className="h-[41px] bg-[#f8f8f8] border text-base px-[15px] py-0 rounded-[10px] border-solid border-[#ccc]"  type="text" placeholder="R$ 00.000,00"></input>
                    </div>
                    <div className="flex flex-col gap-2">
                        <label>Tipo do imóvel</label>
                        <select className="h-[41px] bg-[#f8f8f8] border text-base px-[15px] py-0 rounded-[10px] border-solid border-[#ccc]" >
                            <option>Casa</option>
                            <option>Apartamento</option>
                            <option>Terreno</option>
                        </select>
                    </div>
                    <div className="flex flex-col gap-2">
                        <label>Modalidade de trabalho</label>
                        <select className="h-[41px] bg-[#f8f8f8] border text-base px-[15px] py-0 rounded-[10px] border-solid border-[#ccc]">
                            <option>CLT</option>
                            <option>Autônomo</option>
                            <option>PJ</option>
                            <option>Servidor Público</option>
                        </select>
                    </div>
                    <div className="flex flex-col gap-2">
                        <label>Quando pretende comprar</label>
                        <select className="h-[41px] bg-[#f8f8f8] border text-base px-[15px] py-0 rounded-[10px] border-solid border-[#ccc]">
                            <option>Em até 6 meses</option>
                            <option>Em até 1 ano</option>
                            <option>Mais de 1 ano</option>
                        </select>
                    </div>
                    <div className="flex flex-col gap-2">
                        <label>Prazo do financiamento</label>
                        <input className="h-[41px] bg-[#f8f8f8] border text-base px-[15px] py-0 rounded-[10px] border-solid border-[#ccc]" type="number" placeholder="5 anos"  ></input>
                    </div>
                    <div className="flex items-center gap-3">
                        <span>Deseja utilizar FGTS?</span>
                        <button
                            type="button"
                            onClick={() => setUsarFgts(!usarFgts)}
                            className={`
                                w-12
                                h-6
                                rounded-full
                                transition
                                duration-300
                                ${usarFgts ? "bg-green-500" : "bg-gray-400"}
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
                                ${usarFgts ? "translate-x-6" : "translate-x-1"}
                            `}
                        />
                        </button>
                    </div>
                        {usarFgts && (
                            <div className="flex flex-col gap-2 mt-4">
                                <input
                                    className="h-[41px] bg-[#f8f8f8] border text-base px-[15px] rounded-[10px] border-[#ccc]"
                                    type="text"
                                    placeholder="R$ 00000,00"
                                />
                            </div>
                        )}
                </form>
                <div className="w-full flex justify-end mt-[30px] mb-4">
                    <Button className="text-[white] bg-[rgb(67,101,250)] px-9 py-3 rounded-[10px] border-[none]">Ver resultado</Button>
                </div>
            </div>
        </div>
    </div>
        </>
    );

}
