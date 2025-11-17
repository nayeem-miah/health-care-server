import bcrypt from "bcryptjs";
import { Request } from "express";
import config from "../../../config";
import { fileUploader } from "../../helpers/fileUpload";
import { prisma } from "../../shared/prisma";
import { Admin, Doctor, Prisma, UserRole, UserStatus } from "@prisma/client";
import { IOptions, paginationHelper } from "../../helpers/paginationHelpers";
import { userSearchableFields } from "./user.constant";
import { IJwtPayload } from "../../types/common";


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

const createAdmin = async (req: Request): Promise<Admin> => {

    const file = req.file;

    if (file) {
        const uploadToCloudinary = await fileUploader.uploadToCloudinary(file);
        req.body.admin.profilePhoto = uploadToCloudinary?.secure_url
    }

    const hashedPassword: string = await bcrypt.hash(req.body.password, 10)

    const userData = {
        email: req.body.admin.email,
        password: hashedPassword,
        role: UserRole.ADMIN
    }

    const result = await prisma.$transaction(async (transactionClient) => {
        await transactionClient.user.create({
            data: userData
        });

        const createdAdminData = await transactionClient.admin.create({
            data: req.body.admin
        });

        return createdAdminData;
    });

    return result;
};

const createDoctor = async (req: Request): Promise<Doctor> => {

    const file = req.file;

    if (file) {
        const uploadToCloudinary = await fileUploader.uploadToCloudinary(file);
        req.body.doctor.profilePhoto = uploadToCloudinary?.secure_url
    }
    const hashedPassword: string = await bcrypt.hash(req.body.password, 10)

    const userData = {
        email: req.body.doctor.email,
        password: hashedPassword,
        role: UserRole.DOCTOR
    }

    const result = await prisma.$transaction(async (transactionClient) => {
        await transactionClient.user.create({
            data: userData
        });

        const createdDoctorData = await transactionClient.doctor.create({
            data: req.body.doctor
        });

        return createdDoctorData;
    });

    return result;
};

const getAllFRomDB = async (params: any, options: IOptions) => {
    const { page, limit, skip, sortBy, sortOrder } = paginationHelper.calculatePagination(options)
    const { searchTerm, ...filterData } = params;

    const andConditions: Prisma.UserWhereInput[] = [];

    // * searching
    if (searchTerm) {
        andConditions.push({
            OR: userSearchableFields.map(field => ({
                [field]: {
                    contains: searchTerm,
                    mode: "insensitive"
                }
            }))
        })
    };

    // * filtering
    if (Object.keys(filterData.length > 0)) {
        andConditions.push({
            AND: Object.keys(filterData).map(key => ({
                [key]: {
                    equals: (filterData as any)[key]
                }
            }))
        })
    }

    const whereConditions: Prisma.UserWhereInput = andConditions.length > 0 ? { AND: andConditions } : {};


    const result = await prisma.user.findMany({

        // ? pagination
        skip,
        take: limit,

        //? searching && filtering
        where: whereConditions,
        // ? sorting
        orderBy: {
            [sortBy]: sortOrder
        }
    });

    const total = await prisma.user.count({
        where: whereConditions
    })


    return {
        meta: {
            page,
            limit,
            total
        },
        data: result
    }
}

const getMeProfile = async (user: IJwtPayload) => {

    const userInfo = await prisma.user.findUniqueOrThrow({
        where: {
            email: user.email,
            status: UserStatus.ACTIVE
        },
        select: {
            id: true,
            email: true,
            needPasswordChange: true,
            role: true,
            status: true,
        },

    });

    let profileData;

    if (userInfo.role === UserRole.PATIENT) {
        profileData = await prisma.patient.findUniqueOrThrow({
            where: {
                email: user.email
            }
        })
    }
    else if (userInfo.role === UserRole.DOCTOR) {
        profileData = await prisma.doctor.findUniqueOrThrow({
            where: {
                email: user.email
            }
        })
    }
    else if (userInfo.role === UserRole.ADMIN) {
        profileData = await prisma.admin.findUniqueOrThrow({
            where: {
                email: user.email
            }
        })
    }

    return {
        ...userInfo,
        ...profileData
    }
};


const changeProfileStatus = async (id: string, payload: { status: UserStatus }) => {
    const userData = await prisma.user.findUniqueOrThrow({
        where: {
            id
        }
    });

    const updateUserStatus = await prisma.user.update({
        where: {
            id
        },
        data: payload
    })

    return updateUserStatus;
}

export const UserService = {
    createPatient,
    createAdmin,
    createDoctor,
    getAllFRomDB,
    getMeProfile,
    changeProfileStatus
}