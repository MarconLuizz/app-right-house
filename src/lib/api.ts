const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3000";
const SESSION_KEY = "app-right-house-session";
export const AUTH_CHANGED_EVENT = "app-right-house-auth-changed";

export interface SimulationInput {
    valorImovel: number;
    valorEntrada: number;
    prazoMeses: number;
    taxaJurosAnual: number;
    taxaAdminConsorcio: number;
}

export interface SimulationResult {
    financiamento: {
        parcelaMensal: number;
        totalPago: number;
        totalJuros: number;
        prazoMeses: number;
    };
    consorcio: {
        parcelaMensal: number;
        totalPago: number;
        taxaAdminTotal: number;
        prazoMeses: number;
    };
    recomendacao: string;
    economia: number;
}

export interface SimulationResponse {
    input: SimulationInput;
    result: SimulationResult;
    savedSimulation?: SavedSimulation;
}

export interface SavedSimulation {
    id: string;
    created_at?: string;
    valor_imovel: number;
    valor_entrada: number;
    prazo_meses?: number;
    prazo_anos?: number;
    valor_financiado?: number;
    taxa_juros: number;
    taxa_admin: number;
    financiamento_parcela: number;
    financiamento_total: number;
    financiamento_juros: number;
    consorcio_parcela: number;
    consorcio_total: number;
    consorcio_taxa_admin_total: number;
    recomendacao: string;
    economia: number;
}

interface AuthSession {
    access_token: string;
    refresh_token?: string;
    expires_at?: number;
}

interface AuthResponse {
    user: {
        id: string;
        email?: string;
        user_metadata?: {
            name?: string;
        };
    } | null;
    session: AuthSession | null;
}

function notifyAuthChanged() {
    window.dispatchEvent(new Event(AUTH_CHANGED_EVENT));
}

function saveSession(session: AuthSession | null) {
    if (!session) {
        localStorage.removeItem(SESSION_KEY);
        notifyAuthChanged();
        return;
    }

    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    notifyAuthChanged();
}

export function getAccessToken() {
    const rawSession = localStorage.getItem(SESSION_KEY);

    if (!rawSession) {
        return null;
    }

    try {
        const session = JSON.parse(rawSession) as AuthSession;
        return session.access_token;
    } catch {
        localStorage.removeItem(SESSION_KEY);
        return null;
    }
}

export function isAuthenticated() {
    return Boolean(getAccessToken());
}

export function subscribeToAuthChanges(callback: () => void) {
    window.addEventListener(AUTH_CHANGED_EVENT, callback);
    window.addEventListener("storage", callback);

    return () => {
        window.removeEventListener(AUTH_CHANGED_EVENT, callback);
        window.removeEventListener("storage", callback);
    };
}

async function apiRequest<T>(
    path: string,
    options: RequestInit = {},
    authenticated = false,
) {
    const headers = new Headers(options.headers);
    headers.set("Content-Type", "application/json");

    if (authenticated) {
        const token = getAccessToken();

        if (!token) {
            throw new Error("Usuário não autenticado.");
        }

        headers.set("Authorization", `Bearer ${token}`);
    }

    const response = await fetch(`${API_URL}${path}`, {
        ...options,
        headers,
    });

    if (response.status === 204) {
        return undefined as T;
    }

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message ?? "Não foi possível concluir a requisição.");
    }

    return data as T;
}

export async function registerUser(name: string, email: string, password: string) {
    const auth = await apiRequest<AuthResponse>("/auth/register", {
        method: "POST",
        body: JSON.stringify({ name, email, password }),
    });

    saveSession(auth.session);
    return auth;
}

export async function loginUser(email: string, password: string) {
    const auth = await apiRequest<AuthResponse>("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
    });

    saveSession(auth.session);
    return auth;
}

export async function logoutUser() {
    try {
        if (getAccessToken()) {
            await apiRequest<void>("/auth/logout", { method: "POST" }, true);
        }
    } finally {
        saveSession(null);
    }
}

export function calculateSimulation(input: SimulationInput) {
    return apiRequest<SimulationResponse>("/simulations/calculate", {
        method: "POST",
        body: JSON.stringify(input),
    });
}

export function saveSimulation(input: SimulationInput) {
    return apiRequest<SimulationResponse>(
        "/simulations",
        {
            method: "POST",
            body: JSON.stringify(input),
        },
        true,
    );
}

export function getSimulations() {
    return apiRequest<SavedSimulation[]>("/simulations", {}, true);
}

export function deleteSimulation(id: string) {
    return apiRequest<void>(`/simulations/${id}`, { method: "DELETE" }, true);
}
