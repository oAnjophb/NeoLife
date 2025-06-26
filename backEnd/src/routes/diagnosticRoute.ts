import { Router } from "express";
import { 
  createDiagnostic, 
  getDiagnostic, 
  getAllDiagnostics 
} from "../controllers/diagnosticController";

const router = Router();

router.post("/", createDiagnostic);

router.get("/", getAllDiagnostics);

router.get("/:id_atendimento", getDiagnostic);

export default router;