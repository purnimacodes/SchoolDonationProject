import { Router } from 'express';
import { getAllSchool } from '../Controllers/school.controller.js';

const router = Router();

router.route("/get-all").get(getAllSchool);

export default router;