import { NextFunction, Request, Response } from 'express';
import geocoder from '../utils/geocoder';
import Bootcamp from '../models/Bootcamp';
import { ErrorResponse } from '../utils/error-response';
import asyncHandler from '../middlewares/async-await.middleware';
import path from 'path';
import { Schema } from 'mongoose';
import redisClient from '../config/redis';

// @desc    Get all bootcamps
// @route   GET /api/v1/bootcamps
// @access  Public
export const getAllBootcamps = asyncHandler(
	async (req: Request, res: Response, next: NextFunction) => {
		res.status(200).json(res.advancedResults);
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

		redisClient.setEx(
			req.params.id,
			Number(process.env.REDIS_EXP),
			JSON.stringify(bootcamp)
		);

		res.status(200).json({ success: true, data: bootcamp });
	}
);

// @desc    Create bootcamp
// @route   POST /api/v1/bootcamps
// @access  Private
export const createBootcamp = asyncHandler(
	async (req: Request, res: Response, next: NextFunction) => {
		// Add user to req.body
		req.body.user = req.user;

		// Check for published bootcamp
		const publishedBootcamp = await Bootcamp.findOne({ user: req.user.id });

		// If the user is not an admin, they can only add one bootcamp
		if (publishedBootcamp && req.user.role !== 'admin') {
			return next(
				new ErrorResponse(
					`User with ID of ${req.user.id} has already published a bootcamp`,
					400
				)
			);
		}

		const bootcamp = await Bootcamp.create(req.body);

		res.status(201).json({ success: true, data: bootcamp });
	}
);

// @desc    Update bootcamp
// @route   PUT /api/v1/bootcamps/:id
// @access  Private
export const updateBootcamp = asyncHandler(
	async (req: Request, res: Response, next: NextFunction) => {
		let bootcamp = await Bootcamp.findById(req.params.id);

		if (!bootcamp) {
			return next(
				new ErrorResponse(`Bootcamp not found with ID of ${req.params.id}`, 404)
			);
		}

		// Make sure user is bootcamp owner
		if (
			(bootcamp.user as Schema.Types.ObjectId).toString() !== req.user.id &&
			req.user.role !== 'admin'
		) {
			return next(
				new ErrorResponse(
					`User ${req.user.id} is not authorized to update this bootcamp`,
					401
				)
			);
		}

		bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
			new: true,
			runValidators: true,
		});

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

		// Make sure user is bootcamp owner
		if (
			(bootcamp.user as Schema.Types.ObjectId).toString() !== req.user.id &&
			req.user.role !== 'admin'
		) {
			return next(
				new ErrorResponse(
					`User ${req.user.id} is not authorized to delete this bootcamp`,
					401
				)
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

interface fileType {
	name: string;
	data: Buffer;
	size: number;
	encoding: string;
	tempFilePath: string;
	truncated: boolean;
	mimetype: string;
	md5: string;
	mv: Function;
}

// @desc    Upload photo for bootcamp
// @route   PUT /api/v1/bootcamps/:id/photo
// @access  Private
export const bootcampPhotoUpload = asyncHandler(
	async (req: Request, res: Response, next: NextFunction) => {
		const bootcamp = await Bootcamp.findById(req.params.id);

		if (!bootcamp) {
			return next(
				new ErrorResponse(`Bootcamp not found with ID of ${req.params.id}`, 404)
			);
		}

		// Make sure user is bootcamp owner
		if (
			(bootcamp.user as Schema.Types.ObjectId).toString() !== req.user.id &&
			req.user.role !== 'admin'
		) {
			return next(
				new ErrorResponse(
					`User ${req.user.id} is not authorized to update this bootcamp`,
					401
				)
			);
		}

		if (!req.files) {
			return next(new ErrorResponse(`Please upload a file`, 400));
		}

		const file = req.files.file as fileType;

		// Make sure that the file is a photo
		if (!file.mimetype.startsWith('image')) {
			return next(new ErrorResponse(`Please upload an image file`, 400));
		}

		const maxFileUpload: Number = parseInt(
			<string>process.env.MAX_FILE_UPLOAD,
			10
		);

		// Check filesize
		if (file.size > maxFileUpload) {
			return next(
				new ErrorResponse(
					`Please upload an image less than ${process.env.MAX_FILE_UPLOAD}`,
					400
				)
			);
		}

		// Create  custom filename
		file.name = `photo_${bootcamp._id}${path.parse(file.name).ext}`;

		// Upload a file
		file.mv(
			`${process.env.FILE_UPLOAD_PATH}/${file.name}`,
			async (err: Error) => {
				if (err) {
					console.error(err);
					return next(new ErrorResponse(`Problem with file upload`, 500));
				}

				await Bootcamp.findByIdAndUpdate(req.params.id, { photo: file.name });

				res.status(200).json({
					success: true,
					data: file.name,
				});
			}
		);
	}
);
