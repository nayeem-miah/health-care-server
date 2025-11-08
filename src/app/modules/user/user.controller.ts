import { NextFunction, Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import { UserService } from "./user.service";
import sendResponse from "../../shared/sendResponse";
import pick from "../../helpers/pick";


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
    //  page, limit, sortBy, sortOrder ---> pagination, sorting
    //  fields, searchTerm --> searching , filtering
    const filters = pick(req.query, ["status", "role", "email", "searchTerm"])
    const options = pick(req.query, ["page", "limit", "sortBy", "sortOrder"])



    // const { page, limit, searchTerm, sortBy, sortOrder, role, status } = req.query;
    const result = await UserService.getAllFRomDB(filters, options);

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