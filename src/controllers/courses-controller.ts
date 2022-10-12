import { NextFunction, Request, Response } from 'express';
import Course from '../models/Course';
import { ErrorResponse } from '../utils/error-response';
import asyncHandler from '../middlewares/async-await.middleware';
import Bootcamp from '../models/Bootcamp';

// @desc    Get all courses
// @route   GET /api/v1/courses
// @route   GET /api/v1/bootcamps/:bootcampId/courses
// @access  Public
export const getCourses = asyncHandler(
	async (req: Request, res: Response, next: NextFunction) => {
		let query;

		if (req.params.bootcampId) {
			query = Course.find({ bootcamp: req.params.bootcampId });
		} else {
			query = Course.find().populate({
				path: 'bootcamp',
				select: 'name description',
			});
		}

		const courses = await query;

		res.status(200).json({
			success: true,
			count: courses.length,
			data: courses,
		});
	}
);

// @desc    Get single course
// @route   GET /api/v1/courses/:id
// @access  Public
export const getCourse = asyncHandler(
	async (req: Request, res: Response, next: NextFunction) => {
		const course = await Course.findById(req.params.id).populate({
			path: 'bootcamp',
			select: 'name description',
		});

		if (!course) {
			return next(
				new ErrorResponse(`Course not found with ID of ${req.params.id}`, 404)
			);
		}

		res.status(200).json({
			success: true,
			data: course,
		});
	}
);

// @desc    Add a course
// @route   POST /api/v1/bootcamps/:bootcampId/courses
// @access  Private
export const addCourse = asyncHandler(
	async (req: Request, res: Response, next: NextFunction) => {
		req.body.bootcamp = req.params.bootcampId;

		const bootcamp = await Bootcamp.findById(req.params.bootcampId);

		if (!bootcamp) {
			return next(
				new ErrorResponse(
					`Bootcamp not found with ID of ${req.params.bootcampId}`,
					404
				)
			);
		}

		const course = await Course.create(req.body);

		res.status(200).json({
			success: true,
			data: course,
		});
	}
);

// @desc    Update course
// @route   PUT /api/v1/courses/:id
// @access  Private
export const updateCourse = asyncHandler(
	async (req: Request, res: Response, next: NextFunction) => {
		let course = await Course.findById(req.params.id);

		if (!course) {
			return next(
				new ErrorResponse(`Course not found with ID of ${req.params.id}`, 404)
			);
		}

		course = await Course.findByIdAndUpdate(req.params.id, req.body, {
			new: true,
			runValidators: true,
		});

		res.status(200).json({
			success: true,
			data: course,
		});
	}
);

// @desc    Delete course
// @route   DELETE /api/v1/courses/:id
// @access  Private
export const deleteCourse = asyncHandler(
	async (req: Request, res: Response, next: NextFunction) => {
		const course = await Course.findById(req.params.id);

		if (!course) {
			return next(
				new ErrorResponse(`Course not found with ID of ${req.params.id}`, 404)
			);
		}

		await course.remove();

		res.status(200).json({
			success: true,
			data: {},
		});
	}
);
