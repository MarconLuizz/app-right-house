import dotenv from 'dotenv'

dotenv.config()

export const env = {
    port: process.env.PORT || '3000',
    supabaseUrl: process.env.SUPABASE_URL,
    supabaseAnonKey: process.env.SUPABASE_ANON_KEY,
    supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
}

if (!env.supabaseUrl || !env.supabaseAnonKey || !env.supabaseServiceRoleKey) {
    throw new Error('Variáveis de ambiente do Supabase não configuradas.')
}