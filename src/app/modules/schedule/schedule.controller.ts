import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import { ScheduleService } from "./schedule.service";
import sendResponse from "../../shared/sendResponse";

const insertIntoDB = catchAsync(async (req: Request, res: Response) => {
    const result = await ScheduleService.insertIntoDB(req.body);

    sendResponse(res, {
        statusCode: 201,
        success: true,
        message: "Schedule insert success",
        data: result
    })
});


export const ScheduleController = {
    insertIntoDB,
}