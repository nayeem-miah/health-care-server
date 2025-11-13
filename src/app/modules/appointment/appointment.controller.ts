import { Request, Response } from "express"
import catchAsync from "../../shared/catchAsync"
import { AppointmentService } from "./appointment.service"
import sendResponse from "../../shared/sendResponse";
import { IJwtPayload } from "../../types/common";

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




export const AppointmentController = {
    createAppointment
}