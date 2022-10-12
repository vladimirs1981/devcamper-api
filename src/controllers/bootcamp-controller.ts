import { NextFunction, Request, Response } from 'express';
import geocoder from '../utils/geocoder';
import Bootcamp from '../models/Bootcamp';
import { ErrorResponse } from '../utils/error-response';
import asyncHandler from '../middlewares/async-await.middleware';

// @desc    Get all bootcamps
// @route   GET /api/v1/bootcamps
// @access  Public
export const getAllBootcamps = asyncHandler(
	async (req: Request, res: Response, next: NextFunction) => {
		let query;

		// Copy req.query
		const reqQuery = { ...req.query };

		// Fields to exclude
		const removeFields = ['select', 'sort', 'page', 'limit'];

		// Loop over removeFields and delete them from reqQuery
		removeFields.forEach(param => delete reqQuery[param]);

		// Create a query string
		let queryStr = JSON.stringify(reqQuery);

		// Create operators ($gt, $gte)
		queryStr = queryStr.replace(
			/\b(gt|gte|lt|lte|in)\b/g,
			match => `$${match}`
		);

		// Finding resource
		query = Bootcamp.find(JSON.parse(queryStr)).populate('courses');

		// Select fields
		if (req.query.select) {
			const fields = (req.query.select as string).split(',').join(' ');
			query = query.select(fields);
		}

		// Sort
		if (req.query.sort) {
			const sortBy = (req.query.sort as string).split(',').join(' ');
			query = query.sort(sortBy);
		} else {
			query = query.sort('-createdAt');
		}

		// Pagination
		const page = parseInt(req.query.page as string, 10) || 1;
		const limit = parseInt(req.query.limit as string, 10) || 25;
		const startIndex = (page - 1) * limit;
		const endIndex = page * limit;
		const total = await Bootcamp.countDocuments();

		query = query.skip(startIndex).limit(limit);

		// Executing query
		const bootcamps = await query;

		// Pagination result
		const pagination: any = {};

		if (endIndex < total) {
			pagination.next = {
				page: page + 1,
				limit,
			};
		}

		if (startIndex > 0) {
			pagination.prev = {
				page: page - 1,
				limit,
			};
		}
		res.status(200).json({
			success: true,
			count: bootcamps.length,
			pagination,
			data: bootcamps,
		});
	}
);

// @desc    Get bootcamps
// @route   GET /api/v1/bootcamps/:id
// @access  Public
export const getBootcamp = asyncHandler(
	async (req: Request, res: Response, next: NextFunction) => {
		const bootcamp = await Bootcamp.findById(req.params.id);
		if (!bootcamp) {
			return next(
				new ErrorResponse(`Bootcamp not found with ID of ${req.params.id}`, 404)
			);
		}
		res.status(200).json({ success: true, data: bootcamp });
	}
);

// @desc    Create bootcamp
// @route   POST /api/v1/bootcamps
// @access  Private
export const createBootcamp = asyncHandler(
	async (req: Request, res: Response, next: NextFunction) => {
		const bootcamp = await Bootcamp.create(req.body);

		res.status(201).json({ success: true, data: bootcamp });
	}
);

// @desc    Update bootcamp
// @route   PUT /api/v1/bootcamps/:id
// @access  Private
export const updateBootcamp = asyncHandler(
	async (req: Request, res: Response, next: NextFunction) => {
		const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
			new: true,
			runValidators: true,
		});

		if (!bootcamp) {
			return next(
				new ErrorResponse(`Bootcamp not found with ID of ${req.params.id}`, 404)
			);
		}
		res.status(200).json({ status: true, data: bootcamp });
	}
);

// @desc    Delete bootcamps
// @route   DELETE /api/v1/bootcamps/:id
// @access  Private
export const deleteBootcamp = asyncHandler(
	async (req: Request, res: Response, next: NextFunction) => {
		const bootcamp = await Bootcamp.findById(req.params.id);

		if (!bootcamp) {
			return next(
				new ErrorResponse(`Bootcamp not found with ID of ${req.params.id}`, 404)
			);
		}

		bootcamp.remove();

		res.status(200).json({ status: true, data: {} });
	}
);

// @desc    Get bootcamps within the radius
// @route   GET /api/v1/bootcamps/radius/:zipcode/:distance
// @access  Private
export const getBootcampsInRadius = asyncHandler(
	async (req: Request, res: Response, next: NextFunction) => {
		const { zipcode, distance } = req.params;

		// Get lat/lng from geocoder
		const loc = await geocoder.geocode(zipcode);
		const lat = loc[0].latitude;
		const lng = loc[0].longitude;

		// Calc radius using radians
		// Divide distance by radius of Earth
		// Earth radius = 3,963 miles / 6,378 km
		const radius = parseInt(distance) / 3963;

		const bootcamps = await Bootcamp.find({
			location: { $geoWithin: { $centerSphere: [[lng, lat], radius] } },
		});

		res.status(200).json({
			success: true,
			count: bootcamps.length,
			data: bootcamps,
		});
	}
);
