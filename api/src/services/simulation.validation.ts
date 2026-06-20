import type { SimulationInput } from '../types/simulation.types.js'

const PRAZO_MINIMO_MESES = 6
const PRAZO_MAXIMO_MESES = 420
const TAXA_JUROS_ANUAL_FIXA = 10
const TAXA_ADMIN_CONSORCIO_FIXA = 1.15

function readNumber(value: unknown, field: string) {
    const numberValue =
        typeof value === 'string' && value.trim() !== ''
            ? Number(value)
            : value

    if (typeof numberValue !== 'number' || !Number.isFinite(numberValue)) {
        throw new Error(`${field} deve ser um número válido.`)
    }

    return numberValue
}

export function validateSimulationInput(input: Partial<SimulationInput>) {
    const valorImovel = readNumber(input.valorImovel, 'Valor do imóvel')
    const valorEntrada = readNumber(input.valorEntrada, 'Valor de entrada')
    const prazoMeses = readNumber(input.prazoMeses, 'Prazo')

    if (valorImovel <= 0) {
        throw new Error('O valor do imóvel deve ser maior que zero.')
    }

    if (valorEntrada < 0) {
        throw new Error('O valor de entrada não pode ser negativo.')
    }

    if (valorEntrada >= valorImovel) {
        throw new Error('O valor de entrada deve ser menor que o valor do imóvel.')
    }

    if (prazoMeses < PRAZO_MINIMO_MESES || prazoMeses > PRAZO_MAXIMO_MESES) {
        throw new Error(
            `O prazo deve estar entre ${PRAZO_MINIMO_MESES} e ${PRAZO_MAXIMO_MESES} meses.`,
        )
    }

    return {
        valorImovel,
        valorEntrada,
        prazoMeses,
        taxaJurosAnual: TAXA_JUROS_ANUAL_FIXA,
        taxaAdminConsorcio: TAXA_ADMIN_CONSORCIO_FIXA,
    }
}
