import Database from 'better-sqlite3'
// Importe as funções do seu arquivo de importação
import {
  importPatients,
  importDoctors,
  importReceptionist,
  importEnfermeiras,
} from './Data/import_data'

function main() {
  const db = new Database('./pronto_socorro.db')

  // Importar dados
importPatients(db, './JSON/patients.json')
importDoctors(db, './JSON/doctors.json')
importReceptionist(db, './JSON/receptionists.json')
importEnfermeiras(db, './JSON/nurses.json')

  db.close()
  console.log('Importação concluída com sucesso!')
}

main()
