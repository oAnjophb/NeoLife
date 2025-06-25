import { Request, Response } from 'express'
import { getAdminByUsuario, insertAdmin, Admin } from '../models/adminModel'

function getErrorMessage(error: unknown): string {
  if (typeof error === 'string') return error
  if (
    error &&
    typeof error === 'object' &&
    'message' in error &&
    typeof (error as any).message === 'string'
  ) {
    return (error as any).message
  }
  return 'Erro desconhecido'
}

export function loginAdmin(req: Request, res: Response) {
  const { usuario, senha } = req.body
  const admin: Admin | undefined = getAdminByUsuario(usuario)
  if (admin && admin.senha === senha) {
    res.json({ mensagem: 'Login admin OK', usuario: admin.usuario })
  } else {
    res.status(401).json({ erro: 'Usuário ou senha inválidos' })
  }
}

export function registerAdmin(req: Request, res: Response) {
  const { usuario, senha } = req.body
  try {
    const id = insertAdmin({ usuario, senha })
    res.status(201).json({ mensagem: 'Admin cadastrado', id })
  } catch (error) {
    res.status(400).json({
      erro: 'Erro ao cadastrar admin',
      detalhes: getErrorMessage(error),
    })
  }
}
