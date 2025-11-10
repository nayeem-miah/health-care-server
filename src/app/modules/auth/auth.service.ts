import httpStatus from 'http-status';
import bcrypt from 'bcryptjs';
import { UserStatus } from "@prisma/client"
import { prisma } from "../../shared/prisma"
import jwt from "jsonwebtoken"
import { jwtHelpers } from '../../helpers/jwt.Helpers';
import config from '../../../config';
import ApiError from '../../errors/ApiError';

const login = async (payload: { email: string, password: string }) => {
    const user = await prisma.user.findUniqueOrThrow({
        where: {
            email: payload.email,
            status: UserStatus.ACTIVE
        }
    });

    const isCorrectPassword = await bcrypt.compare(payload.password, user.password);

    if (!isCorrectPassword) {
        // throw new Error("Password is incorrect!")
        throw new ApiError(httpStatus.BAD_REQUEST, "Password is incorrect!")
    };

    const accessToken = jwtHelpers.generateToken({ email: user.email, role: user.role }, config.jwt.access_token_secret as string, "1h");

    const refreshToken = jwtHelpers.generateToken({ email: user.email, role: user.role }, config.jwt.refresh_token_secret!, "90d");


    return {
        accessToken,
        refreshToken,
        needPasswordChange: user.needPasswordChange
    }
}


export const AuthService = {
    login
}