
import { Router } from 'express';
import { loginUser, registerUser, logoutUser, getCurrentUser } from '../Controllers/auth.controller.js';




const router = Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/logout").post(logoutUser);
router.route("/current-user").get(getCurrentUser);
module.exports = router;
