import { Request } from "express"
import { NextFunction, Response } from "express-serve-static-core"
import { jwtHelpers } from "../helpers/jwt.Helpers";
import config from "../../config";
import createError from 'http-errors';

const auth = (...roles: string[]) => {
    return async (req: Request & { user?: any }, res: Response, next: NextFunction) => {
        try {
            const token = req.cookies.accessToken;

            if (!token) {
                throw createError(401, "Authentication required");
            }


            const verifyUser = jwtHelpers.verifyToken(token, config.jwt.access_token_secret as string);

            req.user = verifyUser;

            if (roles.length && !roles.includes(verifyUser.role)) {
                throw new Error("You are not authorized!")
            }

            next();
        } catch (error) {
            next(error)
        }
    }
};

export default auth;