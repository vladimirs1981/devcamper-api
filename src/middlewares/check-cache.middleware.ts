import { RequestHandler } from 'express';
import redisClient from '../config/redis';
export const checkCache: RequestHandler = async (req, res, next) => {
	let key = req.params.id;
	const data = await redisClient.get(key);
	if (!data) {
		return next();
	} else {
		console.log('CACHE HIT!');
		res.status(200).json({
			success: true,
			data: JSON.parse(data),
		});
	}
};
