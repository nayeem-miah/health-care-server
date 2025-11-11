import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import { DoctorService } from "./doctor.service";
import sendResponse from "../../shared/sendResponse";
import pick from "../../helpers/pick";
import { doctorFilterableFields, doctorOptionsFields } from "./doctor.constant";

const getAllFromDB = catchAsync(async (req: Request, res: Response) => {
    const options = pick(req.query, doctorOptionsFields);
    const filter = pick(req.query, doctorFilterableFields);

    const result = await DoctorService.getAllFromDB(filter, options);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Doctor fetched successfully",
        meta: result.meta,
        data: result.data,
    })
});

export const DoctorController = {
    getAllFromDB
}