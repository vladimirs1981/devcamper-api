import { NextFunction, Request, Response } from "express";
import Bootcamp from '../models/Bootcamp';
import { ErrorResponse } from '../utils/error-response';
import asyncHandler from '../middlewares/async-await.middleware';


// @desc    Get all bootcamps
// @route   GET /api/v1/bootcamps
// @access  Public
export const getAllBootcamps = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {

    const bootcamps = await Bootcamp.find();
    res.status(200).json({ success: true, count: bootcamps.length, data: bootcamps });

});

// @desc    Get bootcamps
// @route   GET /api/v1/bootcamps/:id
// @access  Public
export const getBootcamp = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {

    const bootcamp = await Bootcamp.findById(req.params.id);
    if (!bootcamp) {
        return next(new ErrorResponse(`Bootcamp not found with ID of ${req.params.id}`, 404));
    }
    res.status(200).json({ success: true, data: bootcamp })

});

// @desc    Create bootcamp
// @route   POST /api/v1/bootcamps
// @access  Private
export const createBootcamp = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {

    const bootcamp = await Bootcamp.create(req.body);

    res.status(201).json({ success: true, data: bootcamp });

});

// @desc    Update bootcamp
// @route   PUT /api/v1/bootcamps/:id
// @access  Private
export const updateBootcamp = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {

    const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });

    if (!bootcamp) {
        return next(new ErrorResponse(`Bootcamp not found with ID of ${req.params.id}`, 404));
    }
    res.status(200).json({ status: true, data: bootcamp });

});

// @desc    Delete bootcamps
// @route   DELETE /api/v1/bootcamps/:id
// @access  Private
export const deleteBootcamp = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {

    const bootcamp = await Bootcamp.findByIdAndDelete(req.params.id);

    if (!bootcamp) {
        return next(new ErrorResponse(`Bootcamp not found with ID of ${req.params.id}`, 404));
    }
    res.status(200).json({ status: true, data: {} });

});