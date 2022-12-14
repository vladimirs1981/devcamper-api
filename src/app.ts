import express, { Application } from 'express';
import dotenv from 'dotenv';
import fileUpload from 'express-fileupload';
import cookieParser from 'cookie-parser';
import { errorHandler } from './middlewares/error-handling.middleware';
//Routes
import bootcampRoutes from './routes/bootcamp-routes';
import courseRoutes from './routes/course-routes';
import authRoutes from './routes/auth-routes';
import userRoutes from './routes/users-routes';
import reviewRoutes from './routes/review-routes';
import morgan from 'morgan';
import connectDB from './config/db';
import path from 'path';
import mongoSanitize from 'express-mongo-sanitize';
import helmet from 'helmet';
import xss from 'xss-clean';
import rateLimit from 'express-rate-limit';
import hpp from 'hpp';
import cors from 'cors';

// Load env config
dotenv.config();

// Connect to DB
connectDB();

const app: Application = express();

// Body parser
app.use(express.json());

// Cookie parser
app.use(cookieParser());

const baseUrl = '/api/v1';

// Log middleware
app.use(morgan('dev'));

// File upload
app.use(fileUpload());

// Sanitize data
app.use(mongoSanitize());

// Set security headers
app.use(helmet());

// Prevent XSS attacks
app.use(xss());

// Rate limit
const limiter = rateLimit({
	windowMs: 10 * 60 * 1000, // 10 mins
	max: 100,
});

app.use(limiter);

// Prevent http param pollution
app.use(hpp());

// Enable cors
app.use(cors());

// Set static folder
app.use(express.static(path.join(__dirname, '../public')));

// Route initialization
app.use(`${baseUrl}/bootcamps`, bootcampRoutes);
app.use(`${baseUrl}/courses`, courseRoutes);
app.use(`${baseUrl}/auth`, authRoutes);
app.use(`${baseUrl}/auth/users`, userRoutes);
app.use(`${baseUrl}/reviews`, reviewRoutes);

// Error middleware, must be after route initialization
app.use(errorHandler);

const PORT = process.env.PORT ?? 5000;

const server = app.listen(PORT, () => {
	console.log(
		`App is running in ${
			process.env.NODE_ENV ?? ''
		} mode and listening to port ${PORT}`
	);
});

// Handle unhadled promise rejections
process.on('unhandledRejection', (err: Error, promise) => {
	console.log(`Error: ${err.message}`);
	// CLose server and exit process
	server.close(() => process.exit(1));
});
