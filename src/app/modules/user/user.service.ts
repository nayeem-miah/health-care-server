import bcrypt from "bcryptjs";
import { Request } from "express";
import config from "../../../config";
import { fileUploader } from "../../helpers/fileUpload";
import { prisma } from "../../shared/prisma";


const createPatient = async (req: Request) => {
    if (req.file) {
        const uploadedResult = await fileUploader.uploadToCloudinary(req.file)
        req.body.patient.profilePhoto = uploadedResult?.secure_url;
    }

    const hashPassword = await bcrypt.hash(req.body.password, Number(config.bcrypt_salt_rounds));

    const result = await prisma.$transaction(async (tnx) => {
        await tnx.user.create({
            data: {
                email: req.body.patient.email,
                password: hashPassword
            }
        })

        return await tnx.patient.create({
            data: req.body.patient
        })
    })
    return result;

};

export const UserService = {
    createPatient
}