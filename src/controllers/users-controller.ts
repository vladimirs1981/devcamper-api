import { NextFunction, Request, Response } from 'express';
import { User } from '../models/User';
import { ErrorResponse } from '../utils/error-response';
import asyncHandler from '../middlewares/async-await.middleware';
import redisClient from '../config/redis';

// @desc    Get all users
// @route   GET /api/v1/auth/users
// @access  Private/Admin
export const getUsers = asyncHandler(
	async (req: Request, res: Response, next: NextFunction) => {
		res.status(200).json(res.advancedResults);
	}
);

// @desc    Get singleUser
// @route   GET /api/v1/auth/users/:id
// @access  Private/Admin
export const getSingleUser = asyncHandler(
	async (req: Request, res: Response, next: NextFunction) => {
		const user = await User.findById(req.params.id);
		if (!user) {
			return next(
				new ErrorResponse(`User not found with ID of ${req.params.id}`, 404)
			);
		}

		redisClient.setEx(
			req.params.id,
			Number(process.env.REDIS_EXP),
			JSON.stringify(user)
		);

		res.status(200).json({
			success: true,
			data: user,
		});
	}
);

// @desc    Create user
// @route   POST /api/v1/auth/users
// @access  Private/Admin
export const createUser = asyncHandler(
	async (req: Request, res: Response, next: NextFunction) => {
		const user = await User.create(req.body);

		res.status(201).json({
			success: true,
			data: user,
		});
	}
);

// @desc    Update user
// @route   PUT /api/v1/auth/users/:id
// @access  Private/Admin
export const updateUser = asyncHandler(
	async (req: Request, res: Response, next: NextFunction) => {
		const user = await User.findByIdAndUpdate(req.params.id, req.body, {
			new: true,
			runValidators: true,
		});

		if (!user) {
			return next(
				new ErrorResponse(`User not found with ID of ${req.params.id}`, 404)
			);
		}

		res.status(200).json({
			success: true,
			data: user,
		});
	}
);

// @desc    Delete user
// @route   DELETE /api/v1/auth/users/:id
// @access  Private/Admin
export const deleteUser = asyncHandler(
	async (req: Request, res: Response, next: NextFunction) => {
		const user = await User.findById(req.params.id);

		if (!user) {
			return next(
				new ErrorResponse(`User not found with ID of ${req.params.id}`, 404)
			);
		}

		user.remove();

		res.status(200).json({
			success: true,
			data: {},
		});
	}
);
