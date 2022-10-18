import express, { Router } from 'express';
import {
	getAllBootcamps,
	getBootcamp,
	createBootcamp,
	updateBootcamp,
	deleteBootcamp,
	getBootcampsInRadius,
	bootcampPhotoUpload,
} from '../controllers/bootcamp-controller';
import { authorize, protect } from '../middlewares/auth.middleware';
import Bootcamp from '../models/Bootcamp';

// Middleware
import advancedResults from '../middlewares/advanced-results.middleware';

// Include other resourse routers
import courseRouter from './course-routes';
import reviewRouter from './review-routes';
import { checkCache } from '../middlewares/check-cache.middleware';

const router: Router = express.Router();

// Re-route into other resource routers
router.use('/:bootcampId/courses', courseRouter);
router.use('/:bootcampId/reviews', reviewRouter);

router.route('/radius/:zipcode/:distance').get(getBootcampsInRadius);

router
	.route('/')
	.get(advancedResults(Bootcamp, 'bootcamp', 'courses'), getAllBootcamps)
	.post(protect, authorize('publisher', 'admin'), createBootcamp);

router
	.route('/:id/photo')
	.put(protect, authorize('publisher', 'admin'), bootcampPhotoUpload);

router
	.route('/:id')
	.get(checkCache, getBootcamp)
	.put(protect, authorize('publisher', 'admin'), updateBootcamp)
	.delete(protect, authorize('publisher', 'admin'), deleteBootcamp);

export default router;
