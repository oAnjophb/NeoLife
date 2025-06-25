import express from 'express'
import * as adminController from '../controllers/adminController'

const router = express.Router()

router.post('/login', adminController.loginAdmin)
router.post('/cadastro', adminController.registerAdmin)

export default router