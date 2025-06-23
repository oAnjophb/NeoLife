import fs from 'fs'
import { Database } from './data_Base_Conection'

export function importarPacientes(jsonFile: string) {
  const json = fs.readFileSync(jsonFile).toString()
  const pacientesData = JSON.parse(json)

  Database.queryNone('DELETE FROM ENDERECO_PACIENTE')
  Database.queryNone('DELETE FROM PACIENTE')
  Database.queryNone('DELETE FROM ENDERECO')

  const db = Database.getDatabase()
  const enderecoStmt = db.prepare(
    `INSERT INTO ENDERECO(rua, bairro, cidade, estado, cep, numero) VALUES (?, ?, ?, ?, ?, ?)`,
  )
  const pacienteStmt = db.prepare(
    `INSERT INTO PACIENTE(nome, cpf, data_nascimento, genero) VALUES (?, ?, ?, ?)`,
  )
  const associativaStmt = db.prepare(
    `INSERT INTO ENDERECO_PACIENTE(id_paciente, id_endereco) VALUES (?, ?)`,
  )

  for (const p of pacientesData) {
    const endereco = p.endereco
    const enderecoResult = enderecoStmt.run(
      endereco.rua,
      endereco.bairro,
      endereco.cidade,
      endereco.estado,
      endereco.cep,
      endereco.numero,
    )
    const enderecoId = enderecoResult.lastInsertRowid

    const pacienteResult = pacienteStmt.run(
      p.nome,
      p.cpf,
      p.data_nascimento,
      p.genero,
    )
    const pacienteId = pacienteResult.lastInsertRowid

    associativaStmt.run(pacienteId, enderecoId)
  }
}

export function inserirPaciente(paciente: any): number {
  try {
    if (
      !paciente.nome ||
      !paciente.cpf ||
      !paciente.data_nascimento ||
      !paciente.genero ||
      !paciente.endereco
    ) {
      throw new Error('Campos obrigatórios de paciente faltando.')
    }
    const db = Database.getDatabase()
    const enderecoStmt = db.prepare(
      `INSERT INTO ENDERECO(rua, bairro, cidade, estado, cep, numero) VALUES (?, ?, ?, ?, ?, ?)`,
    )
    const pacienteStmt = db.prepare(
      `INSERT INTO PACIENTE(nome, cpf, data_nascimento, genero) VALUES (?, ?, ?, ?)`,
    )
    const associativaStmt = db.prepare(
      `INSERT INTO ENDERECO_PACIENTE(id_paciente, id_endereco) VALUES (?, ?)`,
    )

    const endereco = paciente.endereco
    const enderecoResult = enderecoStmt.run(
      endereco.rua,
      endereco.bairro,
      endereco.cidade,
      endereco.estado,
      endereco.cep,
      endereco.numero,
    )
    const enderecoId = enderecoResult.lastInsertRowid

    const pacienteResult = pacienteStmt.run(
      paciente.nome,
      paciente.cpf,
      paciente.data_nascimento,
      paciente.genero,
    )
    const pacienteId = pacienteResult.lastInsertRowid

    associativaStmt.run(pacienteId, enderecoId)

    return Number(pacienteId)
  } catch (err) {
    console.error('Erro detalhado ao inserir paciente:', err)
    throw err
  }
}

export function buscarPacientesPorCPF(search: string) {
  const db = Database.getDatabase()
  const stmt = db.prepare(`
    SELECT id_paciente, nome, cpf, data_nascimento, genero
    FROM PACIENTE
    WHERE REPLACE(REPLACE(REPLACE(cpf, '.', ''), '-', ''), ' ', '') LIKE ?
    ORDER BY nome
    LIMIT 20
  `)
  return stmt.all(`%${search.replace(/\D/g, '')}%`)
}

export function buscarPacientePorId(id_paciente: number) {
  const db = Database.getDatabase()
  const stmt = db.prepare(`
    SELECT p.id_paciente, p.nome, p.cpf, p.data_nascimento, p.genero,
           e.rua, e.bairro, e.cidade, e.estado, e.cep, e.numero
    FROM PACIENTE p
    LEFT JOIN ENDERECO_PACIENTE ep ON ep.id_paciente = p.id_paciente
    LEFT JOIN ENDERECO e ON e.id_endereco = ep.id_endereco
    WHERE p.id_paciente = ?
    LIMIT 1
  `)
  return stmt.get(id_paciente)
}

export function importarMedicos(jsonFile: string) {
  const json = fs.readFileSync(jsonFile).toString()
  const medicosData = JSON.parse(json)

  Database.queryNone('DELETE FROM MEDICO')
  const db = Database.getDatabase()
  const stmt = db.prepare(
    `INSERT INTO MEDICO(nome, cpf, crm, senha) VALUES (?, ?, ?, ?)`,
  )
  for (const d of medicosData) {
    stmt.run(d.nome, d.cpf, d.crm, d.senha)
  }
}

export function inserirMedico(medico: any): number {
  try {
    if (!medico.nome || !medico.cpf || !medico.crm || !medico.senha) {
      throw new Error(
        'Nome, CPF, CRM e senha são obrigatórios para cadastrar médico.',
      )
    }
    const db = Database.getDatabase()
    const stmt = db.prepare(
      `INSERT INTO MEDICO(nome, cpf, crm, senha) VALUES (?, ?, ?, ?)`,
    )
    const result = stmt.run(medico.nome, medico.cpf, medico.crm, medico.senha)
    return Number(result.lastInsertRowid)
  } catch (err) {
    console.error('Erro ao inserir médico:', err)
    throw err
  }
}

export function importarRecepcionistas(jsonFile: string) {
  const json = fs.readFileSync(jsonFile).toString()
  const dados = JSON.parse(json)

  Database.queryNone('DELETE FROM RECEPCIONISTA')
  const db = Database.getDatabase()
  const stmt = db.prepare(
    `INSERT INTO RECEPCIONISTA(nome, cpf, senha) VALUES (?, ?, ?)`,
  )
  for (const r of dados) {
    stmt.run(r.nome, r.cpf, r.senha)
  }
}

export function inserirRecepcionista(recep: any): number {
  try {
    if (!recep.nome || !recep.cpf || !recep.senha) {
      throw new Error(
        'Nome, CPF e senha são obrigatórios para cadastrar recepcionista.',
      )
    }
    const db = Database.getDatabase()
    const stmt = db.prepare(
      `INSERT INTO RECEPCIONISTA(nome, cpf, senha) VALUES (?, ?, ?)`,
    )
    const result = stmt.run(recep.nome, recep.cpf, recep.senha)
    return Number(result.lastInsertRowid)
  } catch (err) {
    console.error('Erro ao inserir recepcionista:', err)
    throw err
  }
}

export function importarEnfermeiros(jsonFile: string) {
  const json = fs.readFileSync(jsonFile).toString()
  const dados = JSON.parse(json)

  Database.queryNone('DELETE FROM ENFERMEIRO')
  const db = Database.getDatabase()
  const stmt = db.prepare(
    `INSERT INTO ENFERMEIRO(nome, cpf, coren, senha) VALUES (?, ?, ?, ?)`,
  )
  for (const e of dados) {
    stmt.run(e.nome, e.cpf, e.coren, e.senha)
  }
}

export function inserirEnfermeiro(enfermeiro: any): number {
  try {
    if (
      !enfermeiro.nome ||
      !enfermeiro.cpf ||
      !enfermeiro.coren ||
      !enfermeiro.senha
    ) {
      throw new Error(
        'Nome, CPF, COREN e senha são obrigatórios para cadastrar enfermeiro.',
      )
    }
    const db = Database.getDatabase()
    const stmt = db.prepare(
      `INSERT INTO ENFERMEIRO(nome, cpf, coren, senha) VALUES (?, ?, ?, ?)`,
    )
    const result = stmt.run(
      enfermeiro.nome,
      enfermeiro.cpf,
      enfermeiro.coren,
      enfermeiro.senha,
    )
    return Number(result.lastInsertRowid)
  } catch (err) {
    console.error('Erro ao inserir enfermeiro:', err)
    throw err
  }
}

if (require.main === module) {
  Database.connect()
  importarPacientes('./JSON/pacientes.json')
  importarMedicos('./JSON/medicos.json')
  importarRecepcionistas('./JSON/recepcionistas.json')
  importarEnfermeiros('./JSON/enfermeiros.json')
  Database.disconnect()
}
