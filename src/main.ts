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
importPatients(db, './src/JSON/patients.json')
importDoctors(db, './src/JSON/doctors.json')
importReceptionist(db, './src/JSON/receptionists.json')
importEnfermeiras(db, './src/JSON/nurses.json')

  db.close()
  console.log('Importação concluída com sucesso!')
}

main()
