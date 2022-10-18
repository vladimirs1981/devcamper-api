import * as redis from 'redis';

const redisClient = redis.createClient({
	socket: {
		host: process.env.REDIS_HOST,
		port: Number(process.env.REDIS_PORT),
	},
	password: process.env.REDIS_PW,
});

redisClient.on('error', error => {
	console.error(error);
});

redisClient.connect();

export default redisClient;
