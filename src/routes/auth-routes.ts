import express, { Router } from 'express';
import { register, login, getMe } from '../controllers/auth-controller';
import { protect } from '../middlewares/auth.middleware';

const router: Router = express.Router();

router.post('/register', register);

router.post('/login', login);

router.get('/me', protect, getMe);

export default router;
