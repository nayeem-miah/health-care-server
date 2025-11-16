import { Request, Response } from 'express';
import catchAsync from "../../shared/catchAsync";
import { PrescriptionService } from './prescription.service';
import { IJwtPayload } from '../../types/common';
import sendResponse from '../../shared/sendResponse';
import pick from '../../helpers/pick';
import { IOptions } from '../../helpers/paginationHelpers';

const getMyPrescription = catchAsync(async (req: Request & { user?: IJwtPayload }, res: Response) => {

    const options = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);
    const filters = pick(req.query, [""]);

    const user = req.user
    const result = await PrescriptionService.getMyPrescription(user as IJwtPayload, filters, options as IOptions);

    sendResponse(res, {
        statusCode: 201,
        success: true,
        message: "Prescription create successfully",
        data: result
    })
});

const createPrescription = catchAsync(async (req: Request & { user?: IJwtPayload }, res: Response) => {
    const user = req.user
    const result = await PrescriptionService.createPrescription(user as IJwtPayload, req.body);

    sendResponse(res, {
        statusCode: 201,
        success: true,
        message: "Prescription create successfully",
        data: result
    })
});

export const PrescriptionController = {
    createPrescription,
    getMyPrescription,
}