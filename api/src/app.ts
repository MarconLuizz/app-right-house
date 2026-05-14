import express from 'express'
import cors from 'cors'
import healthRoutes from './routes/health.routes.js'
import simulationRoutes from './routes/simulation.routes.js'


const app = express()

app.use(cors())
app.use(express.json())

app.use('/health', healthRoutes)
app.use('/simulations', simulationRoutes)

export default app