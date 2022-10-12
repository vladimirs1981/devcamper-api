import express, { Router } from 'express';
import { updateCourse, deleteCourse } from '../controllers/courses-controller';
import {
	getCourses,
	getCourse,
	addCourse,
} from '../controllers/courses-controller';

const router: Router = express.Router({ mergeParams: true });

router.route('/').get(getCourses).post(addCourse);

router.route('/:id').get(getCourse).put(updateCourse).delete(deleteCourse);

export default router;
