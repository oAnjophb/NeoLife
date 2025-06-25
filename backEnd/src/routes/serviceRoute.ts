import express from 'express'
import * as atendimentoController from '../controllers/serviceController'

const router = express.Router()

router.post('/:id/encerrar', atendimentoController.closeAttendance)

export default router
