import type { SimulationInput, SimulationResult } from '../types/simulation.types.js'

export function calcularFinanciamento(
    valorFinanciado: number,
    taxaAnual: number,
    prazoMeses: number,
) {
    const taxaMensal = taxaAnual / 100 / 12

    const parcela =
        taxaMensal === 0
            ? valorFinanciado / prazoMeses
            : valorFinanciado *
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
    taxaAdminAnual: number,
    prazoMeses: number,
) {
    const prazoAnos = prazoMeses / 12
    const taxaAdminPercentualTotal = taxaAdminAnual * prazoAnos
    const taxaAdminTotal = valorCarta * (taxaAdminPercentualTotal / 100)
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
    const prazoMeses = input.prazoMeses

    const financiamentoBase = calcularFinanciamento(
        valorFinanciado,
        input.taxaJurosAnual,
        prazoMeses,
    )

    const consorcioBase = calcularConsorcio(
        valorFinanciado,
        input.taxaAdminConsorcio,
        prazoMeses,
    )

    const financiamento = {
        ...financiamentoBase,
        totalPago: financiamentoBase.totalPago + input.valorEntrada,
    }

    const consorcio = {
        ...consorcioBase,
        totalPago: consorcioBase.totalPago + input.valorEntrada,
    }

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
