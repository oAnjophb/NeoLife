import express from 'express'
import * as patientController from '../controllers/patientController'

const router = express.Router()

router.get('/', patientController.listAllPatients)

router.get('/ping', patientController.ping)

router.post('/', patientController.registerPatient)

router.get('/cpf/:cpf', patientController.getByCPF)

router.get('/:id_paciente', patientController.getById)

router.put('/:id_paciente', patientController.updatePatient)

router.post('/atendimento', patientController.startAttendance)

router.get('/', patientController.searchPatients)

export default router
