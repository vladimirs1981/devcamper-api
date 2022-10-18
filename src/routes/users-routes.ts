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
import { checkCache } from '../middlewares/check-cache.middleware';

const router: Router = express.Router();

router.use(protect);
router.use(authorize('admin'));

router.route('/').get(advancedResults(User, 'user'), getUsers).post(createUser);

router
	.route('/:id')
	.get(checkCache, getSingleUser)
	.put(updateUser)
	.delete(deleteUser);

export default router;
