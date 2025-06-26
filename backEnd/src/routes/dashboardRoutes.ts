import { Router } from 'express';
import {
  TriageForRiskToday,
  allTriageForDay,
  nextService,
  criticalPatients,
} from '../controllers/dashboardController';

const router = Router();

router.get('/triagens-por-risco', TriageForRiskToday);
router.get('/triagens-por-dia', allTriageForDay);
router.get('/proximas-consultas', nextService);
router.get('/pacientes-criticos', criticalPatients);

export default router;