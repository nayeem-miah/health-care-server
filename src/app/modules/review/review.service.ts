import ApiError from "../../errors/ApiError";
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




export const ReviewService = {
    insertIntoDB
}