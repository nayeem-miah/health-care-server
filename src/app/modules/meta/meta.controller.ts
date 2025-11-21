import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import { MetaService } from "./meta.service";
import { IJwtPayload } from "../../types/common";

const fetchDashboardMetaData = catchAsync(async (req: Request & { user?: IJwtPayload }, res: Response) => {
    const user = req.user;

    const result = await MetaService.fetchDashboardMetaData(user as IJwtPayload);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Dashboard meta data fetched successfully",
        data: result
    });
});


export const MetaController = {
    fetchDashboardMetaData
};