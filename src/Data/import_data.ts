import Database from 'better-sqlite3'
import fs from 'fs'

export function importPatients(db: any, jsonFile: string) {
  let json = fs.readFileSync(jsonFile).toString()
  const patientData = JSON.parse(json)

  db.prepare('DELETE FROM PACIENTE').run()
  db.prepare('DELETE FROM ENDERECO_PACIENTE').run()

  const enderecoStmt = db.prepare(
    `INSERT INTO ENDERECO_PACIENTE(rua, bairro, cidade, estado) VALUES (?, ?, ?, ?)`,
  )
  const pacienteStmt = db.prepare(
    `INSERT INTO PACIENTE(nome, CPF, data_Nascimento, genero, id_endereco) VALUES (?, ?, ?, ?, ?)`,
  )
  

  // JOIN, serve para dados de tabelas distintas interagirem entre si.
  
  const patient_Queue = db.join(
    `INSERT INTO FILA_PARA_ATENDIMENTO()`
  )

  for (const p of patientData) {
    const endereco = p.endereco
    const enderecoResult = enderecoStmt.run(
      endereco.rua,
      endereco.bairro,
      endereco.cidade,
      endereco.estado,
    )
    const enderecoId = enderecoResult.lastInsertRowid

    pacienteStmt.run(p.nome, p.CPF, p.data_Nascimento, p.genero, enderecoId)
  }
}

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