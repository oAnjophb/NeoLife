import express from 'express'
import * as filaController from '../controllers/queueController'

const router = express.Router()

router.get('/', filaController.getQueue)
router.post('/chamar', filaController.callNext)
router.get('/fila-prioridade', filaController.getQueuPriority)

export default router
