import express, { Router } from 'express';
import {
	register,
	login,
	getMe,
	forgotPassword,
	resetPassword,
} from '../controllers/auth-controller';
import { protect } from '../middlewares/auth.middleware';
import { updateDetails, updatePassword } from '../controllers/auth-controller';

const router: Router = express.Router();

router.post('/register', register);

router.post('/login', login);

router.get('/me', protect, getMe);
router.put('/updatedetails', protect, updateDetails);
router.put('/updatepassword', protect, updatePassword);

router.post('/forgotpassword', forgotPassword);

router.put('/resetpassword/:resettoken', resetPassword);

export default router;
