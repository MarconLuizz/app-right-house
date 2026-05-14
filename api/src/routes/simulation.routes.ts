import { Router } from 'express'
import {
    createSimulationController,
    deleteSimulationController,
    getUserSimulationsController,
} from '../controllers/simulation.controller.js'
import { authMiddleware } from '../middlewares/auth.middleware.js'

const router = Router()

router.post('/', authMiddleware, createSimulationController)
router.get('/', authMiddleware, getUserSimulationsController)
router.delete('/:id', authMiddleware, deleteSimulationController)

export default router