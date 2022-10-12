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
import Bootcamp from '../models/Bootcamp';

// Middleware
import advancedResults from '../middlewares/advanced-results.middleware';

// Include other resourse routers
import courseRouter from './course-routes';

const router: Router = express.Router();

// Re-route into other resource routers
router.use('/:bootcampId/courses', courseRouter);

router.route('/radius/:zipcode/:distance').get(getBootcampsInRadius);

router
	.route('/')
	.get(advancedResults(Bootcamp, 'courses'), getAllBootcamps)
	.post(createBootcamp);

router.route('/:id/photo').put(bootcampPhotoUpload);

router
	.route('/:id')
	.get(getBootcamp)
	.put(updateBootcamp)
	.delete(deleteBootcamp);

export default router;
