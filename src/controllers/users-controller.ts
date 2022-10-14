import { NextFunction, Request, Response } from 'express';
import { InstanceMethods, IUser, User } from '../models/User';
import { ErrorResponse } from '../utils/error-response';
import asyncHandler from '../middlewares/async-await.middleware';
import { Document, Types } from 'mongoose';

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
		await User.findByIdAndDelete(req.params.id);

		res.status(200).json({
			success: true,
			data: {},
		});
	}
);