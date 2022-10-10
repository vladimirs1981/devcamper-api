import express, { Application } from 'express';
import dotenv from 'dotenv';
import { errorHandler } from './middlewares/error-handling.middleware';
//Routes
import bootcampRoutes from './routes/bootcamp-routes';
import morgan from 'morgan';
import connectDB from './config/db';


// Load env config
dotenv.config();

// Connect to DB
connectDB();

const app: Application = express();

// Body parser
app.use(express.json());

const baseUrl = '/api/v1';

// Log middleware
app.use(morgan('dev'));

// Route initialization
app.use(`${baseUrl}/bootcamps`, bootcampRoutes);

// Error middleware, must be after route initialization
app.use(errorHandler);



const PORT = process.env.PORT ?? 5000;

const server = app.listen(PORT, () => {
    console.log(`App is running in ${process.env.NODE_ENV ?? ''} mode and listening to port ${PORT}`);
});

// Handle unhadled promise rejections
process.on('unhandledRejection', (err: Error, promise) => {
    console.log(`Error: ${err.message}`);
    // CLose server and exit process
    server.close(() => process.exit(1));
});