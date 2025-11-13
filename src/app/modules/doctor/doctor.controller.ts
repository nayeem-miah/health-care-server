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

const updateIntoDB = catchAsync(async (req: Request, res: Response) => {

    const { id } = req.params;

    const result = await DoctorService.updateIntoDB(id, req.body);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Doctor updated successfully!",
        data: result
    })
})


const getByIdFromDB = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await DoctorService.getByIdFromDB(id);
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Doctor retrieval successfully',
        data: result,
    });
});

const deleteFromDB = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await DoctorService.deleteFromDB(id);
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Doctor deleted successfully',
        data: result,
    });
});


const softDelete = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await DoctorService.softDelete(id);
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Doctor soft deleted successfully',
        data: result,
    });
});

const getAiSuggestion = catchAsync(async (req: Request, res: Response) => {
    const result = await DoctorService.getAiSuggestion(req.body);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Doctor AI suggestion fetched successfully",
        data: result
    })
});

export const DoctorController = {
    getAllFromDB,
    updateIntoDB,
    getAiSuggestion,
    softDelete,
    deleteFromDB,
    getByIdFromDB
}