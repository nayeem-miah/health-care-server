import { Prisma } from "@prisma/client";
import ApiError from "../../errors/ApiError";
import { IOptions, paginationHelper } from "../../helpers/paginationHelpers";
import { prisma } from "../../shared/prisma";
import { IJwtPayload } from "../../types/common";
import httpStatus from "http-status"

const insertIntoDB = async (user: IJwtPayload, payload: any) => {
    const patientData = await prisma.patient.findFirstOrThrow({
        where: {
            email: user.email
        }
    });

    const appointmentData = await prisma.appointment.findUniqueOrThrow({
        where: {
            id: payload.appointmentId
        }
    });

    if ((patientData.id !== appointmentData.patientId)) {
        throw new ApiError(httpStatus.BAD_REQUEST, "This is not your appointment")
    };


    return await prisma.$transaction(async (tnx) => {
        //1. create a review ---> patient
        const result = await tnx.review.create({
            data: {
                appointmentId: appointmentData.id,
                doctorId: appointmentData.doctorId,
                patientId: appointmentData.patientId,
                rating: payload.rating,
                comment: payload.comment
            }
        });

        //2. calculate average rating 
        const avgRating = await tnx.review.aggregate({
            _avg: {
                rating: true
            },
            where: {
                doctorId: appointmentData.doctorId
            }
        })

        // 3. update doctor profile
        await prisma.doctor.update({
            where: {
                id: appointmentData.doctorId
            },
            data: {
                averageRating: avgRating._avg.rating as number
            }
        })

        return result;
    })





    // const result = await prisma.review.create()
}

const getAllFromDB = async (filter: any, options: IOptions) => {
    const { page, limit, skip, sortBy, sortOrder } = paginationHelper.calculatePagination(options);
    const { patientEmail, doctorEmail } = filter;

    const andConditions: Prisma.ReviewWhereInput[] = [];

    if (patientEmail) {
        andConditions.push({
            patient: {
                email: patientEmail
            }
        })
    }

    if (doctorEmail) {
        andConditions.push({
            doctor: {
                email: doctorEmail
            }
        })
    };


    const whereConditions: Prisma.ReviewWhereInput =
        andConditions.length > 0 ? { AND: andConditions } : {};


    const result = await prisma.review.findMany({
        where: whereConditions,
        skip,
        take: limit,
        orderBy:
            options.sortBy && options.sortOrder
                ? { [options.sortBy]: options.sortOrder }
                : {
                    createdAt: 'desc',
                },
        include: {
            doctor: true,
            patient: true
        }
    });


    const total = await prisma.review.count({
        where: whereConditions,
    });

    return {
        meta: {
            total,
            page,
            limit,
        },
        data: result,
    };
}



export const ReviewService = {
    insertIntoDB,
    getAllFromDB
}