import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login.tsx'
import Simulation from './pages/Simulation'
import MySimulations from './pages/MySimulations'

export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/simulation" element={<Simulation />} />
                <Route path="/my-simulations" element={<MySimulations />} />
            </Routes>
        </BrowserRouter>
    )
}