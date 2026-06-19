import { supabaseAdmin } from '../config/supabase.js'

export interface SimulationRecord {
    user_id: string
    valor_imovel: number
    valor_entrada: number
    prazo_meses: number
    valor_financiado: number
    taxa_juros: number
    taxa_admin: number
    financiamento_parcela: number
    financiamento_total: number
    financiamento_juros: number
    consorcio_parcela: number
    consorcio_total: number
    consorcio_taxa_admin_total: number
    recomendacao: string
    economia: number
}

export async function createSimulation(record: SimulationRecord) {
    const { data, error } = await supabaseAdmin
        .from('simulations')
        .insert(record)
        .select()
        .single()

    if (error) {
        throw new Error(`Erro ao salvar simulação: ${error.message}`)
    }

    return data
}

export async function findSimulationsByUserId(userId: string) {
    const { data, error } = await supabaseAdmin
        .from('simulations')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })

    if (error) {
        throw new Error(`Erro ao buscar histórico de simulações: ${error.message}`)
    }

    return data
}

export async function deleteSimulationById(id: string, userId: string) {
    const { error } = await supabaseAdmin
        .from('simulations')
        .delete()
        .eq('id', id)
        .eq('user_id', userId)

    if (error) {
        throw new Error(`Erro ao remover simulação: ${error.message}`)
    }
}
