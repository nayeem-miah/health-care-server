import httpStatus from 'http-status';
import { PaymentStatus, UserRole } from "@prisma/client";
import { IJwtPayload } from "../../types/common"
import ApiError from "../../errors/ApiError";
import { prisma } from '../../shared/prisma';

const fetchDashboardMetaData = async (user: IJwtPayload) => {
    let metaData;

    switch (user.role) {
        case UserRole.ADMIN:
            metaData = getAdminMetaData();
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
    });

    const barChartsData = await getBarChartData();
    const pieChartsData = await getPicChartData();

    return {
        patientCount,
        doctorCount,
        adminCount,
        appointmentCount,
        paymentCount,
        totalRevenue,
        barChartsData,
        pieChartsData
    }
}

const getBarChartData = async () => {
    const appointmentCountPerMonth = prisma.$queryRaw`
    SELECT DATE_TRUNC('month', "createdAt") AS month,
    CAST(COUNT(*) as INTEGER) AS count
    FROM "appointments" -- from @@map("appointments")
    GROUP BY month
    ORDER BY month ASC
    `

    return appointmentCountPerMonth;
};

const getPicChartData = async () => {
    const appointmentStatusDistribution = await prisma.appointment.groupBy({
        by: ['status'],
        _count: {
            id: true
        }
    });

    const formattedAppointmentStatusDistribution = appointmentStatusDistribution.map(({ status, _count }) => ({
        status,
        count: Number(_count.id)
    }))

    return formattedAppointmentStatusDistribution
}



export const MetaService = {
    fetchDashboardMetaData
}

