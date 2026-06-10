import type { SimulationInput } from '../types/simulation.types.js'

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
    const prazoAnos = readNumber(input.prazoAnos, 'Prazo')
    const taxaJurosAnual = readNumber(input.taxaJurosAnual, 'Taxa de juros')
    const taxaAdminConsorcio = readNumber(
        input.taxaAdminConsorcio,
        'Taxa administrativa',
    )

    if (valorImovel <= 0) {
        throw new Error('O valor do imóvel deve ser maior que zero.')
    }

    if (valorEntrada < 0) {
        throw new Error('O valor de entrada não pode ser negativo.')
    }

    if (valorEntrada >= valorImovel) {
        throw new Error('O valor de entrada deve ser menor que o valor do imóvel.')
    }

    if (prazoAnos <= 0) {
        throw new Error('O prazo deve ser maior que zero.')
    }

    if (taxaJurosAnual < 0) {
        throw new Error('A taxa de juros não pode ser negativa.')
    }

    if (taxaAdminConsorcio < 0) {
        throw new Error('A taxa administrativa não pode ser negativa.')
    }

    return {
        valorImovel,
        valorEntrada,
        prazoAnos,
        taxaJurosAnual,
        taxaAdminConsorcio,
    }
}
