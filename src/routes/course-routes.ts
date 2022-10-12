import express, { Router } from 'express';
import { updateCourse, deleteCourse } from '../controllers/courses-controller';
import {
	getCourses,
	getCourse,
	addCourse,
} from '../controllers/courses-controller';
import advancedResults from '../middlewares/advanced-results.middleware';
import Course from '../models/Course';

const router: Router = express.Router({ mergeParams: true });

router
	.route('/')
	.get(
		advancedResults(Course, {
			path: 'bootcamp',
			select: 'name description',
		}),
		getCourses
	)
	.post(addCourse);

router.route('/:id').get(getCourse).put(updateCourse).delete(deleteCourse);

export default router;
