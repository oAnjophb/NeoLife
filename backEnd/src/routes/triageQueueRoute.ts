import express from 'express'
import * as filaTriagemController from '../controllers/triageQueueController'

const router = express.Router()

router.get('/', filaTriagemController.listTriageQueue)
router.post('/chamar', filaTriagemController.callNextPatient)

export default router