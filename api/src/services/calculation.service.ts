import type { SimulationInput, SimulationResult } from '../types/simulation.types.js'

export function calcularFinanciamento(
    valorFinanciado: number,
    taxaAnual: number,
    prazoMeses: number,
) {
    const taxaMensal = taxaAnual / 100 / 12

    const parcela =
        valorFinanciado *
        (taxaMensal * Math.pow(1 + taxaMensal, prazoMeses)) /
        (Math.pow(1 + taxaMensal, prazoMeses) - 1)

    const totalPago = parcela * prazoMeses
    const totalJuros = totalPago - valorFinanciado

    return {
        parcelaMensal: parcela,
        totalPago,
        totalJuros,
        prazoMeses,
    }
}

export function calcularConsorcio(
    valorCarta: number,
    taxaAdmin: number,
    prazoMeses: number,
) {
    const taxaAdminTotal = valorCarta * (taxaAdmin / 100)
    const parcelaMensal = (valorCarta + taxaAdminTotal) / prazoMeses
    const totalPago = parcelaMensal * prazoMeses

    return {
        parcelaMensal,
        totalPago,
        taxaAdminTotal,
        prazoMeses,
    }
}

export function simular(input: SimulationInput): SimulationResult {
    const valorFinanciado = input.valorImovel - input.valorEntrada
    const prazoMeses = input.prazoAnos * 12

    const financiamento = calcularFinanciamento(
        valorFinanciado,
        input.taxaJurosAnual,
        prazoMeses,
    )

    const consorcio = calcularConsorcio(
        input.valorImovel,
        input.taxaAdminConsorcio,
        prazoMeses,
    )

    const economia = Math.abs(financiamento.totalPago - consorcio.totalPago)

    let recomendacao: string

    if (financiamento.totalPago < consorcio.totalPago) {
        recomendacao =
            'O financiamento é mais vantajoso para o seu perfil. Apesar dos juros compostos, o custo total é menor que o consórcio neste cenário.'
    } else if (consorcio.totalPago < financiamento.totalPago) {
        recomendacao =
            'O consórcio é mais vantajoso para o seu perfil. Sem juros compostos, a taxa administrativa resulta em um custo total menor. Porém, lembre-se que a contemplação pode não ser imediata.'
    } else {
        recomendacao =
            'Ambas as modalidades apresentam custo semelhante. Considere outros fatores como urgência na aquisição e disponibilidade de crédito.'
    }

    return {
        financiamento,
        consorcio,
        recomendacao,
        economia,
    }
}