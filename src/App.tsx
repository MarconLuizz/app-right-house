import type { ReactNode } from 'react'
import { useEffect, useState } from 'react'
import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login.tsx'
import Simulation from './pages/Simulation'
import MySimulations from './pages/MySimulations'
import Navbar from './components/Navbar.tsx'
import Register from './pages/Register.tsx'
import { Toaster } from './components/Toaster.tsx'
import { isAuthenticated as hasSession, subscribeToAuthChanges } from './lib/api.ts'

function HashScroll() {
    const location = useLocation()

    useEffect(() => {
        if (!location.hash) {
            window.scrollTo({ top: 0, behavior: 'smooth' })
            return
        }

        const targetId = location.hash.replace('#', '')

        window.setTimeout(() => {
            document.getElementById(targetId)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }, 0)
    }, [location.pathname, location.hash])

    return null
}

function ProtectedRoute({ children }: { children: ReactNode }) {
    const [isLoading, setIsLoading] = useState(true)
    const [isAuthenticated, setIsAuthenticated] = useState(false)

    useEffect(() => {
        const syncAuthState = () => {
            setIsAuthenticated(hasSession())
            setIsLoading(false)
        }

        syncAuthState()

        return subscribeToAuthChanges(syncAuthState)
    }, [])

    if (isLoading) {
        return null
    }

    if (!isAuthenticated) {
        return <Navigate to="/auth/login" replace />
    }

    return children
}

export default function App() {
    return (
        <BrowserRouter>
            <HashScroll />
            <Navbar />
            <Routes>
                <Route path="/" element={<Navigate to="/home" replace />} />
                <Route path="/home" element={<Home />} />
                <Route path="/simulation" element={<Simulation />} />
                <Route path="/simulation/history" element={<ProtectedRoute><MySimulations /></ProtectedRoute>} />
                <Route path="/auth/login" element={<Login />} />
                <Route path="/auth/register" element={<Register />} />
                <Route path="/my-simulations" element={<Navigate to="/simulation/history" replace />} />
            </Routes>
            <Toaster />
        </BrowserRouter>
    )
}