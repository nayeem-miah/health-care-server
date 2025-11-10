import { prisma } from "../../shared/prisma";
import { IJwtPayload } from "../../types/common";

const insertIntoDB = async (user: IJwtPayload, payload: {
    scheduleIds: string[]
}) => {
    const doctorData = await prisma.doctor.findUniqueOrThrow({
        where: { email: user?.email }
    })

    const doctorScheduleData = payload.scheduleIds.map(scheduleId => ({
        doctorId: doctorData.id,
        scheduleId
    }));

    return await prisma.doctorSchedules.createMany({
        data: doctorScheduleData
    })
}


export const DoctorScheduleService = {
    insertIntoDB,
}