import { NextFunction, Request, Response } from 'express';
import { Course } from '../models/Course';
import { ErrorResponse } from '../utils/error-response';
import asyncHandler from '../middlewares/async-await.middleware';
import Bootcamp from '../models/Bootcamp';
import redisClient from '../config/redis';
import { Schema } from 'mongoose';

// @desc    Get all courses
// @route   GET /api/v1/courses
// @route   GET /api/v1/bootcamps/:bootcampId/courses
// @access  Public
export const getCourses = asyncHandler(
	async (req: Request, res: Response, next: NextFunction) => {
		if (req.params.bootcampId) {
			const courses = await Course.find({ bootcamp: req.params.bootcampId });

			return res.status(200).json({
				success: true,
				count: courses.length,
				data: courses,
			});
		} else {
			res.status(200).json(res.advancedResults);
		}
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

		redisClient.setEx(
			req.params.id,
			Number(process.env.REDIS_EXP),
			JSON.stringify(course)
		);

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
		req.body.user = req.user.id;

		const bootcamp = await Bootcamp.findById(req.params.bootcampId);

		if (!bootcamp) {
			return next(
				new ErrorResponse(
					`Bootcamp not found with ID of ${req.params.bootcampId}`,
					404
				)
			);
		}

		// Make sure user is bootcamp owner
		if (
			(bootcamp.user as Schema.Types.ObjectId).toString() !== req.user.id &&
			req.user.role !== 'admin'
		) {
			return next(
				new ErrorResponse(
					`User ${req.user.id} is not authorized to add a course to bootcamp ${bootcamp._id}`,
					401
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

		// Make sure user is course owner
		if (course.user?.toString() !== req.user.id && req.user.role !== 'admin') {
			return next(
				new ErrorResponse(
					`User ${req.user.id} is not authorized to update course  ${course._id}`,
					401
				)
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

		// Make sure user is course owner
		if (course.user?.toString() !== req.user.id && req.user.role !== 'admin') {
			return next(
				new ErrorResponse(
					`User ${req.user.id} is not authorized to delete course  ${course._id}`,
					401
				)
			);
		}

		await course.remove();

		res.status(200).json({
			success: true,
			data: {},
		});
	}
);
