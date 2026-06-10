import { supabaseAuth } from '../config/supabase.js'

export interface RegisterInput {
    name: string
    email: string
    password: string
}

export interface LoginInput {
    email: string
    password: string
}

function assertText(value: unknown, field: string) {
    if (typeof value !== 'string' || value.trim().length === 0) {
        throw new Error(`${field} é obrigatório.`)
    }

    return value.trim()
}

export async function registerUserService(input: RegisterInput) {
    const name = assertText(input.name, 'Nome')
    const email = assertText(input.email, 'Email')
    const password = assertText(input.password, 'Senha')

    if (password.length < 6) {
        throw new Error('A senha deve ter pelo menos 6 caracteres.')
    }

    const { data, error } = await supabaseAuth.auth.signUp({
        email,
        password,
        options: {
            data: { name },
        },
    })

    if (error) {
        throw new Error(error.message)
    }

    return {
        user: data.user,
        session: data.session,
    }
}

export async function loginUserService(input: LoginInput) {
    const email = assertText(input.email, 'Email')
    const password = assertText(input.password, 'Senha')

    const { data, error } = await supabaseAuth.auth.signInWithPassword({
        email,
        password,
    })

    if (error) {
        throw new Error(error.message)
    }

    return {
        user: data.user,
        session: data.session,
    }
}
