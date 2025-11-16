import { Request, Response } from "express"
import catchAsync from "../../shared/catchAsync"
import { AppointmentService } from "./appointment.service"
import sendResponse from "../../shared/sendResponse";
import { IJwtPayload } from "../../types/common";
import pick from "../../helpers/pick";

const createAppointment = catchAsync(async (req: Request & { user?: IJwtPayload }, res: Response) => {
    const user = req.user;
    const result = await AppointmentService.createAppointment(user as IJwtPayload, req.body);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Appointment created successfully",
        data: result
    })
})

const getMyAppointment = catchAsync(async (req: Request & { user?: IJwtPayload }, res: Response) => {
    const options = pick(req.query, ["page", "limit", "sortBy", "sortOrder"]);
    const filters = pick(req.query, ["status", "paymentStatus"])
    const user = req.user;

    const result = await AppointmentService.getAllAppointment(user as IJwtPayload, filters, options);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Appointment recived successfully",
        data: result
    })
})

const getAllAppointment = catchAsync(async (req: Request & { user?: IJwtPayload }, res: Response) => {
    const options = pick(req.query, ["page", "limit", "sortBy", "sortOrder"]);
    const filters = pick(req.query, ["status", "paymentStatus"])
    const user = req.user;

    const result = await AppointmentService.getMyAppointment(user as IJwtPayload, filters, options);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Appointment get successfully",
        data: result
    })
})




export const AppointmentController = {
    createAppointment,
    getMyAppointment,
    getAllAppointment,
}