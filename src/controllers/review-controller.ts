import { NextFunction, Request, Response } from 'express';
import { Course } from '../models/Course';
import { ErrorResponse } from '../utils/error-response';
import asyncHandler from '../middlewares/async-await.middleware';
import Review from '../models/Review';
import Bootcamp from '../models/Bootcamp';

// @desc    Get all reviews
// @route   GET /api/v1/reviews
// @route   GET /api/v1/bootcamps/:bootcampId/reviews
// @access  Public
export const getReviews = asyncHandler(
	async (req: Request, res: Response, next: NextFunction) => {
		if (req.params.bootcampId) {
			const reviews = await Review.find({ bootcamp: req.params.bootcampId });

			return res.status(200).json({
				success: true,
				count: reviews.length,
				data: reviews,
			});
		} else {
			res.status(200).json(res.advancedResults);
		}
	}
);

// @desc    Get single review
// @route   GET /api/v1/reviews/:id
// @access  Public
export const getReview = asyncHandler(
	async (req: Request, res: Response, next: NextFunction) => {
		const review = await Review.findById(req.params.id).populate({
			path: 'bootcamp',
			select: 'name description',
		});

		if (!review) {
			return next(
				new ErrorResponse(`Review not found with ID of ${req.params.id}`, 404)
			);
		}

		res.status(200).json({
			success: true,
			data: review,
		});
	}
);

// @desc    Addreview
// @route   POST /api/v1/bootcamps/:bootcampId/reviews
// @access  Private
export const addReview = asyncHandler(
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

		const review = await Review.create(req.body);

		res.status(200).json({
			success: true,
			data: review,
		});
	}
);

// @desc    Update review
// @route   PUT /api/v1/reviews/:id
// @access  Private
export const updateReview = asyncHandler(
	async (req: Request, res: Response, next: NextFunction) => {
		let review = await Review.findById(req.params.id);

		if (!review) {
			return next(
				new ErrorResponse(`Review not found with ID of ${req.params.id}`, 404)
			);
		}

		console.log(review.user.toString);

		// Make sure user is review owner or user is an admin
		if (review.user?.toString() !== req.user.id && req.user.role !== 'admin') {
			return next(
				new ErrorResponse(
					`User ${req.user.id} is not authorized to update review  ${review._id}`,
					401
				)
			);
		}

		review = await Review.findByIdAndUpdate(req.params.id, req.body, {
			new: true,
			runValidators: true,
		});

		res.status(200).json({
			success: true,
			data: review,
		});
	}
);

// @desc    Delete review
// @route   DELETE /api/v1/reviews/:id
// @access  Private
export const deleteReview = asyncHandler(
	async (req: Request, res: Response, next: NextFunction) => {
		const review = await Review.findById(req.params.id);

		if (!review) {
			return next(
				new ErrorResponse(`Review not found with ID of ${req.params.id}`, 404)
			);
		}

		// Make sure user is reviews owner
		if (review.user?.toString() !== req.user.id && req.user.role !== 'admin') {
			return next(
				new ErrorResponse(
					`User ${req.user.id} is not authorized to delete reviews  ${review._id}`,
					401
				)
			);
		}

		await review.remove();

		res.status(200).json({
			success: true,
			data: {},
		});
	}
);
