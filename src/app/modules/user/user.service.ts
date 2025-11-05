import bcrypt from "bcryptjs";
import config from "../../../config";
import { CreatePatientInput } from "./user.interface";
import { prisma } from "../../shared/prisma";


const createPatient = async (payload: CreatePatientInput) => {
    const hashPassword = await bcrypt.hash(payload.password, Number(config.BCRYPT_SALT));

    const result = await prisma.$transaction(async (tnx) => {
        await tnx.user.create({
            data: {
                email: payload.email,
                password: hashPassword
            }
        })

        return await tnx.patient.create({
            data: {
                name: payload.name,
                email: payload.email
            }
        })
    })
    return result;

};

export const UserService = {
    createPatient
}