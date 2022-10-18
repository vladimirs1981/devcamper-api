import express, { Router } from 'express';
import {
	getReviews,
	getReview,
	addReview,
} from '../controllers/review-controller';
import Review from '../models/Review';
import advancedResults from '../middlewares/advanced-results.middleware';
import { protect, authorize } from '../middlewares/auth.middleware';
import { updateReview, deleteReview } from '../controllers/review-controller';
import { checkCache } from '../middlewares/check-cache.middleware';

const router: Router = express.Router({ mergeParams: true });

router
	.route('/')
	.get(
		advancedResults(Review, 'review', {
			path: 'bootcamp',
			select: 'name description',
		}),
		getReviews
	)
	.post(protect, authorize('admin', 'user'), addReview);

router
	.route('/:id')
	.get(checkCache, getReview)
	.put(protect, authorize('user', 'admin'), updateReview)
	.delete(protect, authorize('user', 'admin'), deleteReview);

export default router;
