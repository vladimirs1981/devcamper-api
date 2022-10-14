import express, { Router } from 'express';
import { User } from '../models/User';
import advancedResults from '../middlewares/advanced-results.middleware';
import { protect, authorize } from '../middlewares/auth.middleware';
import {
	getUsers,
	createUser,
	getSingleUser,
	updateUser,
	deleteUser,
} from '../controllers/users-controller';

const router: Router = express.Router();

router.use(protect);
router.use(authorize('admin'));

router.route('/').get(advancedResults(User), getUsers).post(createUser);

router.route('/:id').get(getSingleUser).put(updateUser).delete(deleteUser);

export default router;
