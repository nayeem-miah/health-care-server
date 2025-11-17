import httpStatus from 'http-status';
import { AppointmentStatus, PaymentStatus, Prescription, Prisma, UserRole } from "@prisma/client";
import { IJwtPayload } from "../../types/common";
import { prisma } from "../../shared/prisma";
import ApiError from "../../errors/ApiError";
import { IOptions, paginationHelper } from '../../helpers/paginationHelpers';


const createPrescription = async (user: IJwtPayload, payload: Partial<Prescription>) => {
    const appointmentData = await prisma.appointment.findUniqueOrThrow({
        where: {
            id: payload.appointmentId,
            status: AppointmentStatus.COMPLETED,
            paymentStatus: PaymentStatus.PAID
        },
        include: {
            doctor: true
        }
    })

    if (user.role === UserRole.DOCTOR) {
        if (!(user.email === appointmentData.doctor.email)) {
            throw new ApiError(httpStatus.BAD_REQUEST, "this is not your appointment")
        }

        const result = await prisma.prescription.create({
            data: {
                appointmentId: appointmentData.id,
                doctorId: appointmentData.doctorId,
                patientId: appointmentData.patientId,
                instructions: payload.instructions as string,
                followUpDate: payload.followUpDate || null
            },
            include: {
                patient: true
            }
        })
        return result;
    }
};

//? get my prescription as a patient
const getMyPrescription = async (user: IJwtPayload, options: IOptions) => {
    const { limit, page, skip, sortBy, sortOrder } = paginationHelper.calculatePagination(options);

    const result = await prisma.prescription.findMany({
        where: {
            patient: {
                email: user.email
            }
        },
        skip,
        take: limit,
        orderBy: {
            [sortBy]: sortOrder
        },
        include: {
            doctor: true,
            patient: true,
            appointment: true
        }
    })

    const total = await prisma.prescription.count({
        where: {
            patient: {
                email: user.email
            }
        }
    })

    return {
        meta: {
            total,
            page,
            limit
        },
        data: result
    }

};

export const PrescriptionService = {
    createPrescription,
    getMyPrescription
}