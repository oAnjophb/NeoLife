import Database from "better-sqlite3"

export class Patient {
  constructor(
    public id_paciente: number,
    public nome: string,
    public cpf: string,
    public idade: string,
    public genero: string,
    public endereco: string,
    public horario_entrada: Date,
  ) {}

  static fromRow(row: any): Patient {
    return new Patient(
      row.id_paciente,
      row.nome,
      row.cpf,
      row.idade,
      row.genero,
      row.endereco,
      new Date(row.horario_entrada),
    )
  }

  static create(patient: Omit<Patient, 'id_paciente'>): number {
    const db = new Database()
    const stmt = db.prepare(
      `INSERT INTO paciente (nome, cpf, idade, genero, endereco, horario_entrada)
       VALUES (?, ?, ?, ?, ?, ?)`
    )
    const info = stmt.run(
      patient.nome,
      patient.cpf,
      patient.idade,
      patient.genero,
      patient.endereco,
      patient.horario_entrada.toISOString(),
    )
    return info.lastInsertRowid as number
  }

  static findAll(): Patient[] {
    const db = new Database()
    const rows = db.prepare('SELECT * FROM paciente').all()
    return rows.map((row: any) => Patient.fromRow(row))
  }

  static findById(id_paciente: number): Patient | null {
    const db = new Database()
    const row = db.prepare('SELECT * FROM paciente WHERE id_paciente = ?').get(id_paciente)
    return row ? Patient.fromRow(row) : null
  }
}