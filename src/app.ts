import expres, {Application, Request, Response } from 'express';
import dotenv from 'dotenv';

// Load env config
dotenv.config();

const app: Application = expres();

const baseUrl = '/api/v1'

app.get(`${baseUrl}/bootcamps`, (req: Request, res: Response) => {
    res.status(200).json({ status: true, msg: 'Show all bootcamps'});
});

app.get(`${baseUrl}/bootcamps/:id`, (req: Request, res: Response) => {
    res.status(200).json({ status: true, msg: `Show bootcamp ${req.params.id}`});
});

app.post(`${baseUrl}/bootcamps`, (req: Request, res: Response) => {
    res.status(200).json({ status: true, msg: 'Create bootcamp'});
});


app.put(`${baseUrl}/bootcamps/:id`, (req: Request, res: Response) => {
    res.status(200).json({ status: true, msg: `Update bootcamp ${req.params.id}`});
});

app.delete(`${baseUrl}/bootcamps/:id`, (req: Request, res: Response) => {
    res.status(200).json({ status: true, msg: `Delete bootcamp ${req.params.id}`});
});

const PORT = process.env.PORT ?? 5000;

app.listen(PORT, () => {
    console.log(`App is running in ${process.env.NODE_ENV ?? ''} mode and listening to port ${PORT}`);
});