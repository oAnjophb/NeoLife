import Database from 'better-sqlite3'
import fs from 'fs'

export function importPatients(db: any, jsonFile: string) {
  let json = fs.readFileSync(jsonFile).toString()
  const patientData = JSON.parse(json)

  db.prepare('DELETE FROM ENDERECO_PACIENTE').run()
  db.prepare('DELETE FROM PACIENTE').run()
  db.prepare('DELETE FROM ENDERECO').run()

  const enderecoStmt = db.prepare(
    `INSERT INTO ENDERECO(rua, bairro, cidade, estado, cep, numero) VALUES (?, ?, ?, ?, ?, ?)`,
  )
  const pacienteStmt = db.prepare(
    `INSERT INTO PACIENTE(nome, CPF, data_Nascimento, genero) VALUES (?, ?, ?, ?)`,
  )
  const associativaStmt = db.prepare(
    `INSERT INTO ENDERECO_PACIENTE(id_paciente, id_endereco) VALUES (?, ?)`,
  )

  for (const p of patientData) {
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
      p.CPF,
      p.data_Nascimento,
      p.genero,
    )
    const pacienteId = pacienteResult.lastInsertRowid

    associativaStmt.run(pacienteId, enderecoId)
  }
}

// Função para inserir UM paciente via API
export function insertPatient(db: any, patient: any) {
  try {
    const enderecoStmt = db.prepare(
      `INSERT INTO ENDERECO(rua, bairro, cidade, estado, cep, numero) VALUES (?, ?, ?, ?, ?, ?)`,
    )
    const pacienteStmt = db.prepare(
      `INSERT INTO PACIENTE(nome, CPF, data_Nascimento, genero) VALUES (?, ?, ?, ?)`,
    )
    const associativaStmt = db.prepare(
      `INSERT INTO ENDERECO_PACIENTE(id_paciente, id_endereco) VALUES (?, ?)`,
    )

    const endereco = patient.endereco
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
      patient.nome,
      patient.CPF,
      patient.data_Nascimento,
      patient.genero,
    )
    const pacienteId = pacienteResult.lastInsertRowid

    associativaStmt.run(pacienteId, enderecoId)
  } catch (err) {
    console.error('Erro detalhado ao inserir paciente:', err)
    throw err
  }
}

// As funções de importação de médicos, recepcionistas e enfermeiros continuam iguais
export function importDoctors(db: any, jsonFile: string) {
  let json = fs.readFileSync(jsonFile).toString()
  const doctorData = JSON.parse(json)

  db.prepare('DELETE FROM MEDICO').run()
  const stmt = db.prepare(`INSERT INTO MEDICO(nome, CRM) VALUES (?, ?)`)
  for (const d of doctorData) {
    stmt.run(d.nome, d.crm)
  }
}

export function importReceptionist(db: any, jsonFile: string) {
  let json = fs.readFileSync(jsonFile).toString()
  const data = JSON.parse(json)

  db.prepare('DELETE FROM RECEPCIONISTA').run()
  const stmt = db.prepare(`INSERT INTO RECEPCIONISTA(nome, CPF) VALUES (?, ?)`)
  for (const r of data) {
    stmt.run(r.nome, r.cpf)
  }
}

export function importEnfermeiras(db: any, jsonFile: string) {
  let json = fs.readFileSync(jsonFile).toString()
  const data = JSON.parse(json)

  db.prepare('DELETE FROM ENFERMEIRO').run()
  const stmt = db.prepare(`INSERT INTO ENFERMEIRO(nome, COREN) VALUES (?, ?)`)
  for (const e of data) {
    stmt.run(e.nome, e.coren)
  }
}
const db = new Database('./pronto_socorro.db')

importPatients(db, './JSON/patients.json')
importDoctors(db, './JSON/doctors.json')
importReceptionist(db, './JSON/receptionists.json')
importEnfermeiras(db, './JSON/nurses.json')
db.close()
