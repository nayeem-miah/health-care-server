import httpStatus from 'http-status';
import { PaymentStatus, UserRole } from "@prisma/client";
import { IJwtPayload } from "../../types/common"
import ApiError from "../../errors/ApiError";
import { prisma } from '../../shared/prisma';

const fetchDashboardMetaData = async (user: IJwtPayload) => {
    let metaData;

    switch (user.role) {
        case UserRole.ADMIN:
            metaData = "Admin metaData"
            break;

        case UserRole.DOCTOR:
            metaData = "Doctor metadata"
            break;

        case UserRole.PATIENT:
            metaData = "Patient metadata"
            break;
        default:
            throw new ApiError(httpStatus.BAD_REQUEST, "Invalid user role")
    }

    return metaData;
}

const getAdminMetaData = async () => {
    const patientCount = await prisma.patient.count();
    const doctorCount = await prisma.doctor.count();
    const adminCount = await prisma.admin.count();
    const appointmentCount = await prisma.appointment.count();
    const paymentCount = await prisma.payment.count();

    const totalRevenue = await prisma.payment.aggregate({
        _sum: {
            amount: true
        },
        where: {
            status: PaymentStatus.PAID
        }
    })


}


export const MetaService = {
    fetchDashboardMetaData
}

