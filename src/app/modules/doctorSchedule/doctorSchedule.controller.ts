import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import { DoctorScheduleService } from "./doctorSchedule.service";
import sendResponse from "../../shared/sendResponse";
import { IJwtPayload } from "../../types/common";
import pick from "../../helpers/pick";
import httpStatus from "http-status"


const insertIntoDB = catchAsync(async (req: Request & { user?: IJwtPayload }, res: Response) => {
    const user = req.user;


    const result = await DoctorScheduleService.insertIntoDB(user as IJwtPayload, req.body);

    sendResponse(res, {
        statusCode: 201,
        success: true,
        message: "Doctor schedule create successfully",
        data: result
    })
});

const getAllDoctorSchedule = catchAsync(async (req: Request & { user?: IJwtPayload }, res: Response) => {
    const user = req.user;


    const result = await DoctorScheduleService.getAllDoctorSchedule();

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Doctor schedule retrieved successfully",
        data: result
    })
});

const getMySchedule = catchAsync(async (req: Request & { user?: IJwtPayload }, res: Response) => {
    const filters = pick(req.query, ['startDate', 'endDate', 'isBooked']);
    const options = pick(req.query, ['limit', 'page', 'sortBy', 'sortOrder']);

    const user = req.user;
    const result = await DoctorScheduleService.getMySchedule(filters, options, user as IJwtPayload);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "My Schedule fetched successfully!",
        data: result
    });
});


export const DoctorScheduleController = {
    insertIntoDB,
    getAllDoctorSchedule,
    getMySchedule
}