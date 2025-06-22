import Database from 'better-sqlite3'
import fs from 'fs'

// ------------ PACIENTE ------------
export function importPatients(db: any, jsonFile: string) {
  let json = fs.readFileSync(jsonFile).toString()
  const patientData = JSON.parse(json)

  db.prepare('DELETE FROM ENDERECO_PACIENTE').run()
  db.prepare('DELETE FROM PACIENTE').run()
  db.prepare('DELETE FROM ENDERECO').run()

  const enderecoStmt = db.prepare(
    `INSERT INTO ENDERECO(rua, bairro, cidade, estado, cep, numero) VALUES (?, ?, ?, ?, ?, ?)`
  )
  const pacienteStmt = db.prepare(
    `INSERT INTO PACIENTE(nome, cpf, data_Nascimento, genero) VALUES (?, ?, ?, ?)`
  )
  const associativaStmt = db.prepare(
    `INSERT INTO ENDERECO_PACIENTE(id_paciente, id_endereco) VALUES (?, ?)`
  )

  for (const p of patientData) {
    const endereco = p.endereco
    const enderecoResult = enderecoStmt.run(
      endereco.rua, endereco.bairro, endereco.cidade, endereco.estado, endereco.cep, endereco.numero
    )
    const enderecoId = enderecoResult.lastInsertRowid

    const pacienteResult = pacienteStmt.run(
      p.nome, p.cpf, p.data_Nascimento, p.genero
    )
    const pacienteId = pacienteResult.lastInsertRowid

    associativaStmt.run(pacienteId, enderecoId)
  }
}

// Inserir UM paciente via API
export function insertPatient(db: any, patient: any) {
  try {
    if (!patient.nome || !patient.cpf || !patient.data_Nascimento || !patient.genero || !patient.endereco) {
      throw new Error('Campos obrigatórios de paciente faltando.')
    }
    const enderecoStmt = db.prepare(
      `INSERT INTO ENDERECO(rua, bairro, cidade, estado, cep, numero) VALUES (?, ?, ?, ?, ?, ?)`
    )
    const pacienteStmt = db.prepare(
      `INSERT INTO PACIENTE(nome, cpf, data_Nascimento, genero) VALUES (?, ?, ?, ?)`
    )
    const associativaStmt = db.prepare(
      `INSERT INTO ENDERECO_PACIENTE(id_paciente, id_endereco) VALUES (?, ?)`
    )

    const endereco = patient.endereco
    const enderecoResult = enderecoStmt.run(
      endereco.rua, endereco.bairro, endereco.cidade, endereco.estado, endereco.cep, endereco.numero
    )
    const enderecoId = enderecoResult.lastInsertRowid

    const pacienteResult = pacienteStmt.run(
      patient.nome, patient.cpf, patient.data_Nascimento, patient.genero
    )
    const pacienteId = pacienteResult.lastInsertRowid

    associativaStmt.run(pacienteId, enderecoId)

    return pacienteId
  } catch (err) {
    console.error('Erro detalhado ao inserir paciente:', err)
    throw err
  }
}

// ------------ MÉDICO ------------
export function importDoctors(db: any, jsonFile: string) {
  let json = fs.readFileSync(jsonFile).toString()
  const doctorData = JSON.parse(json)

  db.prepare('DELETE FROM MEDICO').run()
  const stmt = db.prepare(`INSERT INTO MEDICO(nome, cpf, crm, senha) VALUES (?, ?, ?, ?)`)
  for (const d of doctorData) {
    stmt.run(d.nome, d.cpf, d.crm, d.senha)
  }
}

export function insertDoctor(db: any, doctor: any) {
  try {
    // Verifica se todos os campos obrigatórios estão presentes
    if (!doctor.nome || !doctor.cpf || !doctor.crm || !doctor.senha) {
      throw new Error('Nome, CPF, CRM e senha são obrigatórios para cadastrar médico.')
    }
    const stmt = db.prepare(`INSERT INTO MEDICO(nome, cpf, crm, senha) VALUES (?, ?, ?, ?)`)
    const result = stmt.run(doctor.nome, doctor.cpf, doctor.crm, doctor.senha)
    return result.lastInsertRowid
  } catch (err) {
    console.error('Erro ao inserir médico:', err)
    throw err
  }
}

// ------------ RECEPCIONISTA ------------
export function importReceptionist(db: any, jsonFile: string) {
  let json = fs.readFileSync(jsonFile).toString()
  const data = JSON.parse(json)

  db.prepare('DELETE FROM RECEPCIONISTA').run()
  const stmt = db.prepare(`INSERT INTO RECEPCIONISTA(nome, cpf, senha) VALUES (?, ?, ?)`)
  for (const r of data) {
    stmt.run(r.nome, r.cpf, r.senha)
  }
}

export function insertReceptionist(db: any, recep: any) {
  try {
    if (!recep.nome || !recep.cpf || !recep.senha) {
      throw new Error('Nome, CPF e senha são obrigatórios para cadastrar recepcionista.')
    }
    const stmt = db.prepare(`INSERT INTO RECEPCIONISTA(nome, cpf, senha) VALUES (?, ?, ?)`)
    const result = stmt.run(recep.nome, recep.cpf, recep.senha)
    return result.lastInsertRowid
  } catch (err) {
    console.error('Erro ao inserir recepcionista:', err)
    throw err
  }
}

// ------------ ENFERMEIRO ------------
export function importEnfermeiras(db: any, jsonFile: string) {
  let json = fs.readFileSync(jsonFile).toString()
  const data = JSON.parse(json)

  db.prepare('DELETE FROM ENFERMEIRO').run()
  const stmt = db.prepare(`INSERT INTO ENFERMEIRO(nome, cpf, coren, senha) VALUES (?, ?, ?, ?)`)
  for (const e of data) {
    stmt.run(e.nome, e.cpf, e.coren, e.senha)
  }
}

export function insertNurse(db: any, nurse: any) {
  try {
    if (!nurse.nome || !nurse.cpf || !nurse.coren || !nurse.senha) {
      throw new Error('Nome, CPF, COREN e senha são obrigatórios para cadastrar enfermeiro.')
    }
    const stmt = db.prepare(`INSERT INTO ENFERMEIRO(nome, cpf, coren, senha) VALUES (?, ?, ?, ?)`)
    const result = stmt.run(nurse.nome, nurse.cpf, nurse.coren, nurse.senha)
    return result.lastInsertRowid
  } catch (err) {
    console.error('Erro ao inserir enfermeiro:', err)
    throw err
  }
}

// ------------ EXECUÇÃO AUTOMÁTICA (opcional) ------------
if (require.main === module) {
  const db = new Database('./pronto_socorro.db')

  importPatients(db, './JSON/patients.json')
  importDoctors(db, './JSON/doctors.json')
  importReceptionist(db, './JSON/receptionists.json')
  importEnfermeiras(db, './JSON/nurses.json')

  db.close()
}