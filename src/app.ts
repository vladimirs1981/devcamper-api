import express, {Application } from 'express';
import dotenv from 'dotenv';



//Routes
import bootcampRoutes from './routes/bootcamp-routes';
import morgan from 'morgan';




// Load env config
dotenv.config();

const app: Application = express();

const baseUrl = '/api/v1';

// Log middleware
app.use(morgan('dev'));

// Route initialization
app.use(`${baseUrl}/bootcamps`, bootcampRoutes);



const PORT = process.env.PORT ?? 5000;

app.listen(PORT, () => {
    console.log(`App is running in ${process.env.NODE_ENV ?? ''} mode and listening to port ${PORT}`);
});