import Database from "better-sqlite3"

export class Patient {
  constructor(
    public id: number,
    public name: string,
    public cpf: string,
    public age: number,
    public gender: 'M' | 'F',
    public address: string,
    public entryTime: Date,
  ) {}

  static fromRow(row: any): Patient {
    return new Patient(
      row.id,
      row.name,
      row.cpf,
      row.age,
      row.gender,
      row.address,
      new Date(row.entryTime),
    )
  }

  static create(patient: Omit<Patient, 'id'>): number {
    const db = new Database()
    
    const stmt = db.prepare(
      `INSERT INTO paciente (name, cpf, age, gender, address, entryTime)
       VALUES (?, ?, ?, ?, ?, ?)`,
    )
    const info = stmt.run(
      patient.name,
      patient.cpf,
      patient.age,
      patient.gender,
      patient.address,
      patient.entryTime.toISOString(),
    )
    return info.lastInsertRowid as number
  }

  static findAll(): Patient[] {
    const db = new Database()

    const rows = db.prepare('SELECT * FROM paciente').all()
    return rows.map((row: any) => Patient.fromRow(row))
  }

  static findById(id: number): Patient | null {
    const db = new Database()
    
    const row = db.prepare('SELECT * FROM paciente WHERE id = ?').get(id)
    return row ? Patient.fromRow(row) : null
  }
}
