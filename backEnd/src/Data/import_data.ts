import Database from 'better-sqlite3'
import fs from 'fs'

// --- PACIENTE ---
export function importarPacientes(db: any, jsonFile: string) {
  const json = fs.readFileSync(jsonFile).toString()
  const pacientesData = JSON.parse(json)

  db.prepare('DELETE FROM ENDERECO_PACIENTE').run()
  db.prepare('DELETE FROM PACIENTE').run()
  db.prepare('DELETE FROM ENDERECO').run()

  const enderecoStmt = db.prepare(
    `INSERT INTO ENDERECO(rua, bairro, cidade, estado, cep, numero) VALUES (?, ?, ?, ?, ?, ?)`
  )
  const pacienteStmt = db.prepare(
    `INSERT INTO PACIENTE(nome, cpf, data_nascimento, genero) VALUES (?, ?, ?, ?)`
  )
  const associativaStmt = db.prepare(
    `INSERT INTO ENDERECO_PACIENTE(id_paciente, id_endereco) VALUES (?, ?)`
  )

  for (const p of pacientesData) {
    const endereco = p.endereco
    const enderecoResult = enderecoStmt.run(
      endereco.rua,
      endereco.bairro,
      endereco.cidade,
      endereco.estado,
      endereco.cep,
      endereco.numero
    )
    const enderecoId = enderecoResult.lastInsertRowid

    const pacienteResult = pacienteStmt.run(
      p.nome,
      p.cpf,
      p.data_nascimento,
      p.genero
    )
    const pacienteId = pacienteResult.lastInsertRowid

    associativaStmt.run(pacienteId, enderecoId)
  }
}

export function inserirPaciente(db: any, paciente: any) {
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
    const enderecoStmt = db.prepare(
      `INSERT INTO ENDERECO(rua, bairro, cidade, estado, cep, numero) VALUES (?, ?, ?, ?, ?, ?)`
    )
    const pacienteStmt = db.prepare(
      `INSERT INTO PACIENTE(nome, cpf, data_nascimento, genero) VALUES (?, ?, ?, ?)`
    )
    const associativaStmt = db.prepare(
      `INSERT INTO ENDERECO_PACIENTE(id_paciente, id_endereco) VALUES (?, ?)`
    )

    const endereco = paciente.endereco
    const enderecoResult = enderecoStmt.run(
      endereco.rua,
      endereco.bairro,
      endereco.cidade,
      endereco.estado,
      endereco.cep,
      endereco.numero
    )
    const enderecoId = enderecoResult.lastInsertRowid

    const pacienteResult = pacienteStmt.run(
      paciente.nome,
      paciente.cpf,
      paciente.data_nascimento,
      paciente.genero
    )
    const pacienteId = pacienteResult.lastInsertRowid

    associativaStmt.run(pacienteId, enderecoId)

    return pacienteId
  } catch (err) {
    console.error('Erro detalhado ao inserir paciente:', err)
    throw err
  }
}

export function buscarPacientesPorCPF(db: any, search: string) {
  const stmt = db.prepare(`
    SELECT id_paciente, nome, cpf, data_nascimento, genero
    FROM PACIENTE
    WHERE REPLACE(REPLACE(REPLACE(cpf, '.', ''), '-', ''), ' ', '') LIKE ?
    ORDER BY nome
    LIMIT 20
  `)
  return stmt.all(`%${search.replace(/\D/g, '')}%`)
}

export function buscarPacientePorId(db: any, id_paciente: number) {
  const stmt = db.prepare(`
    SELECT p.id_paciente, p.nome, p.cpf, p.data_nascimento, p.genero,
           e.rua, e.bairro, e.cidade, e.estado, e.cep, e.numero
    FROM PACIENTE p
    LEFT JOIN ENDERECO_PACIENTE ep ON ep.id_paciente = p.id_paciente
    LEFT JOIN ENDERECO e ON e.id = ep.id_endereco
    WHERE p.id_paciente = ?
    LIMIT 1
  `)
  return stmt.get(id_paciente)
}

// --- MÉDICO ---
export function importarMedicos(db: any, jsonFile: string) {
  const json = fs.readFileSync(jsonFile).toString()
  const medicosData = JSON.parse(json)

  db.prepare('DELETE FROM MEDICO').run()
  const stmt = db.prepare(
    `INSERT INTO MEDICO(nome, cpf, crm, senha) VALUES (?, ?, ?, ?)`
  )
  for (const d of medicosData) {
    stmt.run(d.nome, d.cpf, d.crm, d.senha)
  }
}

export function inserirMedico(db: any, medico: any) {
  try {
    if (!medico.nome || !medico.cpf || !medico.crm || !medico.senha) {
      throw new Error('Nome, CPF, CRM e senha são obrigatórios para cadastrar médico.')
    }
    const stmt = db.prepare(
      `INSERT INTO MEDICO(nome, cpf, crm, senha) VALUES (?, ?, ?, ?)`
    )
    const result = stmt.run(medico.nome, medico.cpf, medico.crm, medico.senha)
    return result.lastInsertRowid
  } catch (err) {
    console.error('Erro ao inserir médico:', err)
    throw err
  }
}

// --- RECEPCIONISTA ---
export function importarRecepcionistas(db: any, jsonFile: string) {
  const json = fs.readFileSync(jsonFile).toString()
  const dados = JSON.parse(json)

  db.prepare('DELETE FROM RECEPCIONISTA').run()
  const stmt = db.prepare(
    `INSERT INTO RECEPCIONISTA(nome, cpf, senha) VALUES (?, ?, ?)`
  )
  for (const r of dados) {
    stmt.run(r.nome, r.cpf, r.senha)
  }
}

export function inserirRecepcionista(db: any, recep: any) {
  try {
    if (!recep.nome || !recep.cpf || !recep.senha) {
      throw new Error('Nome, CPF e senha são obrigatórios para cadastrar recepcionista.')
    }
    const stmt = db.prepare(
      `INSERT INTO RECEPCIONISTA(nome, cpf, senha) VALUES (?, ?, ?)`
    )
    const result = stmt.run(recep.nome, recep.cpf, recep.senha)
    return result.lastInsertRowid
  } catch (err) {
    console.error('Erro ao inserir recepcionista:', err)
    throw err
  }
}

// --- ENFERMEIRO ---
export function importarEnfermeiros(db: any, jsonFile: string) {
  const json = fs.readFileSync(jsonFile).toString()
  const dados = JSON.parse(json)

  db.prepare('DELETE FROM ENFERMEIRO').run()
  const stmt = db.prepare(
    `INSERT INTO ENFERMEIRO(nome, cpf, coren, senha) VALUES (?, ?, ?, ?)`
  )
  for (const e of dados) {
    stmt.run(e.nome, e.cpf, e.coren, e.senha)
  }
}

export function inserirEnfermeiro(db: any, enfermeiro: any) {
  try {
    if (!enfermeiro.nome || !enfermeiro.cpf || !enfermeiro.coren || !enfermeiro.senha) {
      throw new Error('Nome, CPF, COREN e senha são obrigatórios para cadastrar enfermeiro.')
    }
    const stmt = db.prepare(
      `INSERT INTO ENFERMEIRO(nome, cpf, coren, senha) VALUES (?, ?, ?, ?)`
    )
    const result = stmt.run(enfermeiro.nome, enfermeiro.cpf, enfermeiro.coren, enfermeiro.senha)
    return result.lastInsertRowid
  } catch (err) {
    console.error('Erro ao inserir enfermeiro:', err)
    throw err
  }
}

// --- MAIN ---
if (require.main === module) {
  const db = new Database('./pronto_socorro.db')

  importarPacientes(db, './JSON/pacientes.json')
  importarMedicos(db, './JSON/medicos.json')
  importarRecepcionistas(db, './JSON/recepcionistas.json')
  importarEnfermeiros(db, './JSON/enfermeiros.json')

  db.close()
}