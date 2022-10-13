import express, { Application } from 'express';
import dotenv from 'dotenv';
import fileUpload from 'express-fileupload';
import cookieParser from 'cookie-parser';
import { errorHandler } from './middlewares/error-handling.middleware';
//Routes
import bootcampRoutes from './routes/bootcamp-routes';
import courseRoutes from './routes/course-routes';
import authRoutes from './routes/auth-routes';
import morgan from 'morgan';
import connectDB from './config/db';
import path from 'path';

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

// Set static folder
console.log(path.join(__dirname, '../public'));
app.use(express.static(path.join(__dirname, '../public')));

// Route initialization
app.use(`${baseUrl}/bootcamps`, bootcampRoutes);
app.use(`${baseUrl}/courses`, courseRoutes);
app.use(`${baseUrl}/auth`, authRoutes);

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
