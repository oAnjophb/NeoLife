export function insertAdmin(db: any, { usuario, senha }: { usuario: string, senha: string }) {
  const stmt = db.prepare('INSERT INTO admin (usuario, senha) VALUES (?, ?)');
  const info = stmt.run(usuario, senha);
  return info.lastInsertRowid;
}

export function getAdminByUsuario(db: any, usuario: string) {
  const stmt = db.prepare('SELECT * FROM admin WHERE usuario = ?');
  return stmt.get(usuario);
}