import { NextFunction, Request, Response } from 'express';
import { InstanceMethods, IUser, User } from '../models/User';
import { ErrorResponse } from '../utils/error-response';
import asyncHandler from '../middlewares/async-await.middleware';
import { Document, Types } from 'mongoose';

export type TUser = Document<unknown, any, IUser> &
	IUser & {
		_id: Types.ObjectId;
	} & InstanceMethods;

// @desc    Register user
// @route   POST /api/v1/auth/register
// @access  Public
export const register = asyncHandler(
	async (req: Request, res: Response, next: NextFunction) => {
		const { name, email, password, role } = req.body;

		// Create user
		const user = await User.create({
			name,
			email,
			password,
			role,
		});

		sendTokenResponse(user, 200, res);
	}
);

// @desc    Login user
// @route   POST /api/v1/auth/login
// @access  Public
export const login = asyncHandler(
	async (req: Request, res: Response, next: NextFunction) => {
		const { email, password } = req.body;

		// Validate email & password
		if (!email || !password) {
			return next(
				new ErrorResponse(`Please provide an email and password`, 400)
			);
		}

		// Check for user
		const user = await User.findOne({ email }).select('+password');

		if (!user) {
			return next(new ErrorResponse(`Invalid credentials`, 401));
		}

		// Check if password matches
		const isMatch = await user.matchPassword(password);

		if (!isMatch) {
			return next(new ErrorResponse(`Invalid credentials`, 401));
		}

		sendTokenResponse(user, 200, res);
	}
);

// Get token from model, create cookie, send response
const sendTokenResponse = (user: TUser, statusCode: number, res: Response) => {
	// Create token
	const token = user.getSignedJwtToken();

	const cookieExpire: Number = parseInt(
		<string>process.env.JWT_COOKIE_EXPIRE,
		10
	);

	const options = {
		expires: new Date(Date.now() + Number(cookieExpire) * 24 * 60 * 60 * 1000),
		httpOnly: true,
		secure: false,
	};

	if (process.env.NODE_ENV === 'production') {
		options.secure = true;
	}

	res.status(statusCode).cookie('token', token, options).json({
		success: true,
		token,
	});
};

// @desc    Get current logged in user
// @route   POST /api/v1/auth/me
// @access  Private
export const getMe = asyncHandler(async (req, res, next) => {
	const user = await User.findById(req.user);

	res.status(200).json({
		success: true,
		data: user,
	});
});
