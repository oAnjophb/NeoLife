import { Request, Response } from "express";
import { Database } from "../Data/data_Base_Conection";

const db = Database.getDatabase();


export const createDiagnostic = (req: Request, res: Response) => {
  const { id_atendimento, descricao_diagnostico } = req.body;

  if (!id_atendimento || !descricao_diagnostico) {
    return res.status(400).json({ error: "Campos obrigatórios não informados." });
  }

  try {
    const stmt = db.prepare(`
      INSERT INTO DIAGNOSTICO (id_atendimento, descricao_diagnostico)
      VALUES (?, ?)
    `);
    stmt.run(id_atendimento, descricao_diagnostico);
    res.status(201).json({ id_atendimento, descricao_diagnostico });
  } catch (err: any) {
    res.status(500).json({ error: "Erro ao inserir diagnóstico: " + err.message });
  }
};


export const getDiagnostic = (req: Request, res: Response) => {
  const id_atendimento = Number(req.params.id_atendimento);

  try {
    const stmt = db.prepare(
      "SELECT * FROM DIAGNOSTICO WHERE id_atendimento = ?"
    );
    const row = stmt.get(id_atendimento);
    if (!row) {
      return res.status(404).json({ error: "Diagnóstico não encontrado." });
    }
    res.json(row);
  } catch (err: any) {
    res.status(500).json({ error: "Erro ao buscar diagnóstico: " + err.message });
  }
};


export const getAllDiagnostics = (_: Request, res: Response) => {
  try {
    const stmt = db.prepare("SELECT * FROM DIAGNOSTICO");
    const rows = stmt.all();
    res.json(rows);
  } catch (err: any) {
    res.status(500).json({ error: "Erro ao listar diagnósticos: " + err.message });
  }
};