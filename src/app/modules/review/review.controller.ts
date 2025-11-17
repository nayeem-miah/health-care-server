import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import { ReviewService } from "./review.service";
import { IJwtPayload } from "../../types/common";
import sendResponse from "../../shared/sendResponse";
import pick from "../../helpers/pick";
import { reviewFilterableFields } from "./review.constant";

const insertIntoDB = catchAsync(async (req: Request & { user?: IJwtPayload }, res: Response) => {
    const user = req.user
    const result = await ReviewService.insertIntoDB(user as IJwtPayload, req.body);

    sendResponse(res, {
        statusCode: 201,
        success: true,
        message: "Review Created Successfully",
        data: result
    })
});


const getAllFromDB = catchAsync(async (req: Request, res: Response) => {
    const filters = pick(req.query, reviewFilterableFields);
    const options = pick(req.query, ['limit', 'page', 'sortBy', 'sortOrder']);
    const result = await ReviewService.getAllFromDB(filters, options);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Review get Successfully",
        meta: result.meta,
        data: result.data
    })
});



export const ReviewController = {
    insertIntoDB,
    getAllFromDB
}