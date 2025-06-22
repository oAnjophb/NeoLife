/// <reference path="./types/express/index.d.ts" />
import express from 'express'
import Database from 'better-sqlite3'
import cors from 'cors'

import pacienteRoute from './routes/pacienteRoute'
import adminRoute from './routes/adminRoute'
import employeeRoute from './routes/EmployeeRoutes'
import AuthRoutes from './routes/AuthRoutes'
import triagemRoute from './routes/triagemRoute'
import filaRouter from './routes/fila'

const app = express()
app.use(express.json())
app.use(cors())

const db = new Database('./pronto_socorro.db')
app.set('db', db)

app.get('/teste', (req, res) => {
  res.send('OK')
})

app.use('/api/admin', adminRoute)
app.use('/api/pacientes', pacienteRoute)
app.use('/api/employees', employeeRoute)
app.use('/api/login', AuthRoutes)
app.use('/api/triagem', triagemRoute)
app.use('/api/fila', filaRouter)

const PORT = 3001
app.listen(PORT, () => {
  console.log(`API rodando em http://localhost:${PORT}`)
})
