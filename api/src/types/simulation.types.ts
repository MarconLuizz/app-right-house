export interface SimulationInput {
    valorImovel: number
    valorEntrada: number
    prazoMeses: number
    taxaJurosAnual: number
    taxaAdminConsorcio: number
}

export interface SimulationResult {
    financiamento: {
        parcelaMensal: number
        totalPago: number
        totalJuros: number
        prazoMeses: number
    }
    consorcio: {
        parcelaMensal: number
        totalPago: number
        taxaAdminTotal: number
        prazoMeses: number
    }
    recomendacao: string
    economia: number
}
