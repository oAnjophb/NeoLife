import Database from 'better-sqlite3'
import fs from 'fs'

export function importPatients(db: any, jsonFile: string) {
  let json = fs.readFileSync(jsonFile).toString()
  const patientData = JSON.parse(json)

  db.prepare('DELETE FROM PACIENTE').run()
  const stmt = db.prepare(
    `INSERT INTO paciente(name, cpf, age, gender, address, entryTime) VALUES (?, ?, ?, ?, ?, ?)`,
  )
  for (const p of patientData) {
    stmt.run(p.name, p.cpf, p.age, p.gender, p.address, p.entryTime)
  }
}

export function importDoctors(db: any, jsonFile: string) {
  let json = fs.readFileSync(jsonFile).toString()
  const doctorData = JSON.parse(json)

  db.prepare('DELETE FROM MEDICO').run()
  const stmt = db.prepare(`INSERT INTO medico(nome, crm) VALUES (?, ?)`)
  for (const d of doctorData) {
    stmt.run(d.nome, d.crm)
  }
}

export function importReceptionist(db: any, jsonFile: string) {
  let json = fs.readFileSync(jsonFile).toString()
  const data = JSON.parse(json)

  db.prepare('DELETE FROM recepcionista').run()
  const stmt = db.prepare(
    `INSERT INTO recepcionista(nome, cpf) VALUES (?, ?)`,
  )
  for (const r of data) {
    stmt.run(r.nome, r.cpf)
  }
}

export function importEnfermeiras(db: any, jsonFile: string) {
  let json = fs.readFileSync(jsonFile).toString()
  const data = JSON.parse(json)

  db.prepare('DELETE FROM enfermeira').run()
  const stmt = db.prepare(
    `INSERT INTO enfermeira(nome, coren) VALUES (?, ?)`,
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
