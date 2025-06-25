import express from 'express'
import * as employeeController from '../controllers/employeeController'

const router = express.Router()

router.post('/', employeeController.registerEmployee)

export default router