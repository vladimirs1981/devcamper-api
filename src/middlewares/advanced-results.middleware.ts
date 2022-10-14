import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';

export interface AdvancedResponse extends Response {
	advancedResults: {};
}

const advancedResults =
	(model: any, populate?: any) =>
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
		query = model.find(JSON.parse(queryStr));

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
		const total = await model.countDocuments();

		query = query.skip(startIndex).limit(limit);

		if (populate) {
			query = query.populate(populate);
		}

		// Executing query
		const results = await query;

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

		res.advancedResults = {
			success: true,
			count: results.length,
			pagination,
			data: results,
		};

		next();
	};

export default advancedResults;
