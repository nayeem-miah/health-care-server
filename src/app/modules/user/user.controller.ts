import { NextFunction, Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import { UserService } from "./user.service";
import sendResponse from "../../shared/sendResponse";


const createPatient = catchAsync(async (req: Request, res: Response) => {
    const result = await UserService.createPatient(req);

    sendResponse(res, {
        statusCode: 201,
        success: true,
        message: "Patient created successfully",
        data: result
    })
})

const createAdmin = catchAsync(async (req: Request, res: Response) => {
    const result = await UserService.createAdmin(req);

    sendResponse(res, {
        statusCode: 201,
        success: true,
        message: "Admin created successfully",
        data: result
    })
})

const createDoctor = catchAsync(async (req: Request, res: Response) => {
    const result = await UserService.createDoctor(req);

    sendResponse(res, {
        statusCode: 201,
        success: true,
        message: "Doctor created successfully",
        data: result
    })
});

// * * ?page=1&limit=10&searchTerm="email searching" 
const getAllFRomDB = catchAsync(async (req: Request, res: Response) => {
    const { page, limit, searchTerm, sortBy, sortOrder } = req.query;

    const result = await UserService.getAllFRomDB({ page: Number(page), limit: Number(limit), searchTerm, sortBy, sortOrder });

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "gel all user successfully",
        data: result
    })
})



export const UserController = {
    createPatient,
    createAdmin,
    createDoctor,
    getAllFRomDB
}