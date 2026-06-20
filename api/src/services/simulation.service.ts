import {
    createSimulation,
    deleteSimulationById,
    findSimulationsByUserId,
} from '../repositories/simulation.repository.js'
import type { SimulationInput } from '../types/simulation.types.js'
import { simular } from './calculation.service.js'
import { validateSimulationInput } from './simulation.validation.js'

export function calculateSimulationService(input: Partial<SimulationInput>) {
    const validInput = validateSimulationInput(input)

    return {
        input: validInput,
        result: simular(validInput),
    }
}

export async function createSimulationService(
    userId: string,
    input: Partial<SimulationInput>,
) {
    const { input: validInput, result } = calculateSimulationService(input)

    const savedSimulation = await createSimulation({
        user_id: userId,
        valor_imovel: validInput.valorImovel,
        valor_entrada: validInput.valorEntrada,
        prazo_meses: validInput.prazoMeses,
        valor_financiado: validInput.valorImovel - validInput.valorEntrada,
        taxa_juros: validInput.taxaJurosAnual,
        taxa_admin: validInput.taxaAdminConsorcio,
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
        input: validInput,
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
