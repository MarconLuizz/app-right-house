import {
    createSimulation,
    deleteSimulationById,
    findSimulationsByUserId,
} from '../repositories/simulation.repository.js'
import { simular } from './calculation.service.js'
import type { SimulationInput } from '../types/simulation.types.js'

export async function createSimulationService(
    userId: string,
    input: SimulationInput,
) {
    if (input.valorImovel <= 0) {
        throw new Error('O valor do imóvel deve ser maior que zero.')
    }

    if (input.valorEntrada < 0) {
        throw new Error('O valor de entrada não pode ser negativo.')
    }

    if (input.valorEntrada >= input.valorImovel) {
        throw new Error('O valor de entrada deve ser menor que o valor do imóvel.')
    }

    if (input.prazoAnos <= 0) {
        throw new Error('O prazo deve ser maior que zero.')
    }

    const result = simular(input)

    const savedSimulation = await createSimulation({
        user_id: userId,
        valor_imovel: input.valorImovel,
        valor_entrada: input.valorEntrada,
        prazo_anos: input.prazoAnos,
        taxa_juros: input.taxaJurosAnual,
        taxa_admin: input.taxaAdminConsorcio,
        financiamento_parcela: result.financiamento.parcelaMensal,
        financiamento_total: result.financiamento.totalPago,
        financiamento_juros: result.financiamento.totalJuros,
        consorcio_parcela: result.consorcio.parcelaMensal,
        consorcio_total: result.consorcio.totalPago,
        consorcio_taxa_admin_total: result.consorcio.taxaAdminTotal,
        recomendacao: result.recomendacao,
        economia: result.economia,
    })

    return {
        input,
        result,
        savedSimulation,
    }
}

export async function getUserSimulationsService(userId: string) {
    return findSimulationsByUserId(userId)
}

export async function deleteSimulationService(id: string, userId: string) {
    await deleteSimulationById(id, userId)
}