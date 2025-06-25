import express from 'express'
import { authenticateJWT } from '../middleware/authMiddleware'
import * as triagemController from '../controllers/triageController'

const router = express.Router()

router.get('/:id_atendimento', triagemController.getTriagemByAtendimento)

router.get('/paciente/:id_paciente', triagemController.getTriagensByPaciente)

router.post('/iniciar', triagemController.iniciarTriagem)

router.post('/', authenticateJWT, triagemController.cadastrarTriagem)

router.get('/', triagemController.listarTriagens)

export default router