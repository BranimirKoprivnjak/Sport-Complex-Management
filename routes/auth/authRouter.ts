import { Router } from 'express';
import {
  loginUser,
  registerUser,
  verifyUser,
} from '../../controllers/auth/authController';

const router = Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.put('/verify', verifyUser);

export default router;
