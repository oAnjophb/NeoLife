import Database from 'better-sqlite3'
import fs from 'fs'

export function importPatients(db: any, jsonFile: string) {
  let json = fs.readFileSync(jsonFile).toString()
  const patientData = JSON.parse(json)

  db.prepare('DELETE FROM PACIENTE').run()
  const stmt = db.prepare(
    `INSERT INTO PACIENTE(nome, CPF, data_Nascimento, genero, endereco) VALUES (?, ?, ?, ?, ?)`,
  )
  for (const p of patientData) {
    stmt.run(p.nome, p.CPF, p.data_Nascimento, p.genero, p.endereco)
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
  const stmt = db.prepare(
    `INSERT INTO RECEPCIONISTA(nome, CPF) VALUES (?, ?)`,
  )
  for (const r of data) {
    stmt.run(r.nome, r.cpf)
  }
}

export function importEnfermeiras(db: any, jsonFile: string) {
  let json = fs.readFileSync(jsonFile).toString()
  const data = JSON.parse(json)

  db.prepare('DELETE FROM ENFERMEIRO').run()
  const stmt = db.prepare(
    `INSERT INTO ENFERMEIRO(nome, COREN) VALUES (?, ?)`,
  )
  for (const e of data) {
    stmt.run(e.nome, e.coren)
  }
}

const db = new Database('./pronto_socorro.db')

importPatients(db, './src/JSON/patients.json')
importDoctors(db, './src/JSON/doctors.json')
importReceptionist(db, './src/JSON/receptionists.json')
importEnfermeiras(db, './src/JSON/nurses.json')
db.close()

console.log('Importação concluída com sucesso!')
