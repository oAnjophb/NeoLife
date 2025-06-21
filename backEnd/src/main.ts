import express from 'express'
import Database from 'better-sqlite3'
import pacienteRoute from './routes/pacienteRoute'
import cors from 'cors'
import adminRoute from './routes/adminRoute'
import employeeRoute from './routes/EmployeeRoutes'

const app = express()
app.use(express.json())
app.use(cors())

const db = new Database('./pronto_socorro.db')
app.set('db', db)

// Rotas
app.use(adminRoute)
app.use(pacienteRoute)
app.use(employeeRoute)

const PORT = 3001
app.listen(PORT, () => {
  console.log(`API rodando em http://localhost:${PORT}`)
})