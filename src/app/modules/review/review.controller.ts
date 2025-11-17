import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import { ReviewService } from "./review.service";
import { IJwtPayload } from "../../types/common";
import sendResponse from "../../shared/sendResponse";

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



export const ReviewController = {
    insertIntoDB
}