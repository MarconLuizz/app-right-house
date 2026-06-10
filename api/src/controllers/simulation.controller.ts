import type { Response } from 'express'
import type { AuthenticatedRequest } from '../middlewares/auth.middleware.js'
import {
    calculateSimulationService,
    createSimulationService,
    deleteSimulationService,
    getUserSimulationsService,
} from '../services/simulation.service.js'

export async function calculateSimulationController(
    req: AuthenticatedRequest,
    res: Response,
) {
    try {
        const simulation = calculateSimulationService(req.body)
        res.json(simulation)
    } catch (error) {
        res.status(400).json({
            message:
                error instanceof Error
                    ? error.message
                    : 'Não foi possível calcular a simulação.',
        })
    }
}

export async function createSimulationController(
    req: AuthenticatedRequest,
    res: Response,
) {
    try {
        if (!req.userId) {
            res.status(401).json({ message: 'Usuário não autenticado.' })
            return
        }

        const simulation = await createSimulationService(req.userId, req.body)

        res.status(201).json(simulation)
    } catch (error) {
        res.status(400).json({
            message:
                error instanceof Error
                    ? error.message
                    : 'Não foi possível criar a simulação.',
        })
    }
}

export async function getUserSimulationsController(
    req: AuthenticatedRequest,
    res: Response,
) {
    try {
        if (!req.userId) {
            res.status(401).json({ message: 'Usuário não autenticado.' })
            return
        }

        const simulations = await getUserSimulationsService(req.userId)

        res.json(simulations)
    } catch (error) {
        res.status(400).json({
            message:
                error instanceof Error
                    ? error.message
                    : 'Não foi possível buscar o histórico de simulações.',
        })
    }
}

export async function deleteSimulationController(
    req: AuthenticatedRequest,
    res: Response,
) {
    try {
        if (!req.userId) {
            res.status(401).json({ message: 'Usuário não autenticado.' })
            return
        }

        const simulationId = req.params.id

        if (!simulationId || Array.isArray(simulationId)) {
            res.status(400).json({
                message: 'ID da simulação inválido.',
            })
            return
        }

        await deleteSimulationService(simulationId, req.userId)

        res.status(204).send()
    } catch (error) {
        res.status(400).json({
            message:
                error instanceof Error
                    ? error.message
                    : 'Não foi possível remover a simulação.',
        })
    }
}
