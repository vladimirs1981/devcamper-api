import { ErrorRequestHandler, NextFunction, Request, Response } from "express";
import { ErrorResponse } from '../utils/error-response';

export const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
    let error = {...err};

    error.message = err.message;

    // Log to console for dev
    console.log(err.stack);

    // Mongoose bad ObjectId
    if(err.name === 'CastError') {
        const message = `Bootcamp not found with ID of ${err.value}`;
        error = new ErrorResponse(message, 404);
    }

   // Mongoose duplicate key
    if(err.code === 11000) {
        const message = `Duplicate field value entered`;
        error = new ErrorResponse(message, 400);
    }

    // Mongoose validation error
    if(err.name === 'ValidationError') {
        const messages = Object.values(err.errors as object).map(val => val.message);
        const message = messages.join(', ');
        error = new ErrorResponse(message, 400);
       console.log(message);
    }
    
    res.status(error.statusCode || 500).json({
        success: false,
        error: error.message || 'Server Error'
    });
};