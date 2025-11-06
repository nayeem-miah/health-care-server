import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import { AuthService } from "./auth.service";

const login = catchAsync(async (req: Request, res: Response) => {

    const result = await AuthService.login(req.body);
    const { accessToken, refreshToken, needPasswordChange } = result;

    //* set token in cookie
    res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge: 1000 * 60 * 60
    })

    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge: 1000 * 60 * 60 * 24 * 90
    })

    sendResponse(res, {
        success: true,
        statusCode: 200,
        message: "Patient login successfully",
        data: {
            needPasswordChange
        }
    })
})


export const AuthController = {
    login
}