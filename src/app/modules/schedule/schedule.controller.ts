import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import { ScheduleService } from "./schedule.service";
import sendResponse from "../../shared/sendResponse";
import pick from "../../helpers/pick";

const insertIntoDB = catchAsync(async (req: Request, res: Response) => {
    const result = await ScheduleService.insertIntoDB(req.body);

    sendResponse(res, {
        statusCode: 201,
        success: true,
        message: "Schedule insert success",
        data: result
    })
});


const scheduleForDoctor = catchAsync(async (req: Request, res: Response) => {
    const options = pick(req.query, ["page", "limit", "sortBy", "sortOrder"]); // pagination
    const filters = pick(req.query, ["startDateTime", "endDateTime"]); // filtering

    const result = await ScheduleService.scheduleForDoctor(filters, options);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Schedule retrieved success",
        meta: result.meta,
        data: result.data
    })
});


const deleteScheduleFromDB = catchAsync(async (req: Request, res: Response) => {
    const result = await ScheduleService.deleteScheduleFromDB(req.params.id);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "schedule deleted successfully",
        data: result
    })
});


export const ScheduleController = {
    insertIntoDB,
    scheduleForDoctor,
    deleteScheduleFromDB
}