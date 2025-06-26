/// <reference path="./types/express/index.d.ts" />
import express from 'express'
import cors from 'cors'
import path from 'path'
import { Database } from './Data/data_Base_Conection'

import pacienteRoute from './routes/patientRoute'
import adminRoute from './routes/adminRoute'
import employeeRoute from './routes/employeeRoutes'
import AuthRoutes from './routes/AuthRoutes'
import filaTriagemRouter from './routes/triageQueueRoute'
import triagemRoute from './routes/triageRoute'
import filaRouter from './routes/QueueRoute'
import atendimentoRoute from './routes/serviceRoute'
import dashboardRoutes from './routes/dashboardroutes'

const app = express()
app.use(express.json())
app.use(cors())

try {
  Database.connect()
  console.log('Conexão com o banco de dados estabelecida.')
  console.log('Banco em uso:', path.resolve('pronto_socorro.db'))
} catch (err: any) {
  console.error('Erro ao conectar no banco de dados:', err.message)
  process.exit(1)
}

app.get('/teste', (req, res) => {
  res.send('OK')
})

app.use('/api/admin', adminRoute)
app.use('/api/pacientes', pacienteRoute)
app.use('/api/employees', employeeRoute)
app.use('/api/login', AuthRoutes)
app.use('/api/fila-triagem', filaTriagemRouter)
app.use('/api/triagem', triagemRoute)
app.use('/api/fila-prioridade', filaRouter)
app.use('/api/atendimento', atendimentoRoute)
app.use('/api/dashboard', dashboardRoutes)

const PORT = 3001
app.listen(PORT, () => {
  console.log(`API rodando em http://localhost:${PORT}`)
})
