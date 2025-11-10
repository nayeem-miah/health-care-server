import { UserRole } from "@prisma/client";

export type IJwtPayload = {
    email: string;
    role: UserRole;
    iat: number;
    exp: number;
}