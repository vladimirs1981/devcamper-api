import jwt, { JwtPayload } from 'jsonwebtoken';
import asyncHandler from './async-await.middleware';
import { ErrorResponse } from '../utils/error-response';
import { User } from '../models/User';
import { Schema } from 'mongoose';
import { NextFunction, Request, Response } from 'express';

// Protect routes
export const protect = asyncHandler(async (req, res, next) => {
	let token;

	if (
		req.headers.authorization &&
		req.headers.authorization.startsWith('Bearer')
	) {
		token = req.headers.authorization.split(' ')[1];
	}

	// else if(req.cookies.token) {
	//     token= req.cookies.token;
	// }

	// Make sure token exists
	if (!token) {
		return next(new ErrorResponse('Not authorized to access this route', 401));
	}

	interface Payload extends JwtPayload {
		id?: Schema.Types.ObjectId;
	}

	try {
		// Verify token
		const decoded = jwt.verify(
			token,
			process.env.JWT_SECRET as string
		) as Payload;

		console.log(decoded);

		req.user = await User.findById(decoded.id);

		next();
	} catch (error) {
		return next(new ErrorResponse('Not authorized to access this route', 401));
	}
});

// Grant access to specific roles
export const authorize = (...roles: string[]) => {
	return (req: Request, res: Response, next: NextFunction) => {
		if (!roles.includes(req.user.role)) {
			return next(
				new ErrorResponse(
					`User role ${req.user.role} is not authorized to access this route`,
					403
				)
			);
		}
		next();
	};
};
