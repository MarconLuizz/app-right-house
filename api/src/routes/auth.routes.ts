import { Router } from 'express'
import {
    loginController,
    logoutController,
    meController,
    registerController,
} from '../controllers/auth.controller.js'
import { authMiddleware } from '../middlewares/auth.middleware.js'

const router = Router()

router.post('/register', registerController)
router.post('/login', loginController)
router.get('/me', authMiddleware, meController)
router.post('/logout', authMiddleware, logoutController)

export default router
