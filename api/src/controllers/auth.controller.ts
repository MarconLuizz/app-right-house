import type { Response } from 'express'
import type { AuthenticatedRequest } from '../middlewares/auth.middleware.js'
import {
    loginUserService,
    registerUserService,
} from '../services/auth.service.js'

export async function registerController(
    req: AuthenticatedRequest,
    res: Response,
) {
    try {
        const authResult = await registerUserService(req.body)
        res.status(201).json(authResult)
    } catch (error) {
        res.status(400).json({
            message:
                error instanceof Error
                    ? error.message
                    : 'Não foi possível criar a conta.',
        })
    }
}

export async function loginController(req: AuthenticatedRequest, res: Response) {
    try {
        const authResult = await loginUserService(req.body)
        res.json(authResult)
    } catch (error) {
        res.status(401).json({
            message:
                error instanceof Error
                    ? error.message
                    : 'Não foi possível autenticar.',
        })
    }
}

export async function meController(req: AuthenticatedRequest, res: Response) {
    res.json({
        user: req.user ?? null,
    })
}

export async function logoutController(
    req: AuthenticatedRequest,
    res: Response,
) {
    res.status(204).send()
}
