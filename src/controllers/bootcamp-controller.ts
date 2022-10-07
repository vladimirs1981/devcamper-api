import { NextFunction, Request, Response } from "express";


// @desc    Get all bootcamps
// @route   GET /api/v1/bootcamps
// @access  Public
export const getAllBootcamps = (req: Request, res: Response, next: NextFunction) => {
    res.status(200).json({ status: true, msg: 'Show all bootcamps'});
}

// @desc    Get bootcamps
// @route   GET /api/v1/bootcamps/:id
// @access  Public
export const getBootcamp = (req: Request, res: Response, next: NextFunction) => {
    res.status(200).json({ status: true, msg: `Show bootcamp ${req.params.id}`});
}

// @desc    Create bootcamp
// @route   POST /api/v1/bootcamps
// @access  Private
export const createBootcamp = (req: Request, res: Response, next: NextFunction) => {
    res.status(200).json({ status: true, msg: 'Create bootcamp'});
}

// @desc    Update bootcamp
// @route   PUT /api/v1/bootcamps/:id
// @access  Private
export const updateBootcamp = (req: Request, res: Response, next: NextFunction) => {
    res.status(200).json({ status: true, msg: `Update bootcamp ${req.params.id}`});
}

// @desc    Delete bootcamps
// @route   DELETE /api/v1/bootcamps/:id
// @access  Private
export const deleteBootcamp = (req: Request, res: Response, next: NextFunction) => {
    res.status(200).json({ status: true, msg: `Delete bootcamp ${req.params.id}`});
}