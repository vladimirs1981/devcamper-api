import express, { Router } from 'express';
import { updateCourse, deleteCourse } from '../controllers/courses-controller';
import {
	getCourses,
	getCourse,
	addCourse,
} from '../controllers/courses-controller';
import { authorize, protect } from '../middlewares/auth.middleware';
import advancedResults from '../middlewares/advanced-results.middleware';
import { Course } from '../models/Course';
import { checkCache } from '../middlewares/check-cache.middleware';

const router: Router = express.Router({ mergeParams: true });

router
	.route('/')
	.get(
		advancedResults(Course, 'course', {
			path: 'bootcamp',
			select: 'name description',
		}),
		getCourses
	)
	.post(protect, authorize('publisher', 'admin'), addCourse);

router
	.route('/:id')
	.get(checkCache, getCourse)
	.put(protect, authorize('publisher', 'admin'), updateCourse)
	.delete(protect, authorize('publisher', 'admin'), deleteCourse);

export default router;
