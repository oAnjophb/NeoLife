import express from 'express'
import fs from 'fs'
import path from 'path'
import {
  insertDoctor,
  insertNurse,
  insertReceptionist,
} from '../Data/import_data'

const router = express.Router()

function saveEmployeeToJson(type: string, data: any) {
  let filename = ''
  if (type === 'doctor') filename = 'doctors.json'
  else if (type === 'nurse') filename = 'nurses.json'
  else if (type === 'receptionist') filename = 'receptionists.json'
  else throw new Error('Invalid employee type')

  const filePath = path.join(process.cwd(), 'JSON', filename)
  let list: any[] = []
  if (fs.existsSync(filePath)) {
    list = JSON.parse(fs.readFileSync(filePath, 'utf-8'))
  }
  const newEmployee = { ...data, id: Date.now() }
  list.push(newEmployee)
  fs.writeFileSync(filePath, JSON.stringify(list, null, 2), 'utf-8')
  return newEmployee
}

router.post('/api/employees', (req, res) => {
  try {
    const db = req.app.get('db')
    const { type, ...payload } = req.body

    console.log('Payload recebido', payload)
    if (!type) return res.status(400).json({ erro: 'Employee type is required' })

    let dbId: number | undefined
    if (type === 'doctor') dbId = insertDoctor(db, payload)
    else if (type === 'nurse') dbId = insertNurse(db, payload)
    else if (type === 'receptionist') dbId = insertReceptionist(db, payload)
    else return res.status(400).json({ erro: 'Invalid employee type' })

    if (!dbId) { // Falhou ao inserir no banco
      return res.status(500).json({ erro: 'Erro ao salvar funcionário no banco de dados' })
    }

    // Tenta salvar no JSON (opcional)
    try {
      const employeeJson = saveEmployeeToJson(type, payload)
      res.status(201).json({
        mensagem: 'Funcionário cadastrado!',
        dbId,
        jsonId: employeeJson.id,
      })
    } catch (jsonError: any) {
      // Se salvar no JSON falhar, ainda assim retorna erro
      return res.status(500).json({ erro: 'Salvou no banco, mas falhou no JSON', detalhes: jsonError.message })
    }
  } catch (error: any) {
    // Agora qualquer erro de banco ou lógica retorna erro mesmo
    res.status(500).json({ erro: 'Erro ao cadastrar funcionário', detalhes: error.message })
  }
})

export default router