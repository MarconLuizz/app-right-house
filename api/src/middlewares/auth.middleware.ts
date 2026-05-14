import type { NextFunction, Request, Response } from 'express'
import { supabaseAuth } from '../config/supabase.js'

export interface AuthenticatedRequest extends Request {
    userId?: string
}

export async function authMiddleware(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
) {
    const authHeader = req.headers.authorization

    if (!authHeader) {
        res.status(401).json({ message: 'Token de autenticação não informado.' })
        return
    }

    const token = authHeader.replace('Bearer ', '')

    const {
        data: { user },
        error,
    } = await supabaseAuth.auth.getUser(token)

    if (error || !user) {
        res.status(401).json({ message: 'Token inválido ou expirado.' })
        return
    }

    req.userId = user.id
    next()
}