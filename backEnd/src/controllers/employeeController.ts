import { Request, Response } from 'express'
import fs from 'fs'
import path from 'path'
import * as doctorService from '../services/doctorService'
import * as nurseService from '../services/nurseService'
import * as receptionistService from '../services/receptionistService'

function saveEmployeeToJson(type: string, data: any) {
  let filename = ''
  if (type === 'medico') filename = 'medicos.json'
  else if (type === 'enfermeiro') filename = 'enfermeiros.json'
  else if (type === 'recepcionista') filename = 'recepcionistas.json'
  else throw new Error('Tipo de funcionário inválido')

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

export function registerEmployee(req: Request, res: Response) {
  try {
    const { tipo, ...payload } = req.body

    if (!tipo) {
      return res.status(400).json({ erro: 'Tipo de funcionário é obrigatório' })
    }

    let dbId: number | undefined
    if (tipo === 'medico') dbId = doctorService.registerDoctor(payload)
    else if (tipo === 'enfermeiro') dbId = nurseService.registerNurse(payload)
    else if (tipo === 'recepcionista') dbId = receptionistService.registerReceptionist(payload)
    else return res.status(400).json({ erro: 'Tipo de funcionário inválido' })

    if (!dbId) {
      return res
        .status(500)
        .json({ erro: 'Erro ao salvar funcionário no banco de dados' })
    }

    try {
      const employeeJson = saveEmployeeToJson(tipo, payload)
      res.status(201).json({
        mensagem: 'Funcionário cadastrado!',
        dbId,
        jsonId: employeeJson.id,
      })
    } catch (jsonError: any) {
      return res.status(500).json({
        erro: 'Salvou no banco, mas falhou no JSON',
        detalhes: jsonError.message,
      })
    }
  } catch (error: any) {
    res
      .status(500)
      .json({ erro: 'Erro ao cadastrar funcionário', detalhes: error.message })
  }
}