import { Doctor, Prisma, UserStatus } from "@prisma/client";
import httpStatus from 'http-status';
import ApiError from "../../errors/ApiError";
import { openai } from "../../helpers/openRouter";
import { IOptions, paginationHelper } from "../../helpers/paginationHelpers";
import { parseDoctorInfo } from "../../helpers/parseDoctorInfo";
import { prisma } from "../../shared/prisma";
import { doctorSearchableFields } from "./doctor.constant";
import { IDoctorUpdateInput } from "./doctor.interface";

const getAllFromDB = async (filters: any, options: IOptions) => {
    const { page, limit, skip, sortBy, sortOrder } = paginationHelper.calculatePagination(options);
    const { searchTerm, specialties, ...filterData } = filters;

    const andConditions: Prisma.DoctorWhereInput[] = [];

    // ? searching
    if (searchTerm) {
        andConditions.push({
            OR:
                doctorSearchableFields.map((filed) => ({
                    [filed]: {
                        contains: searchTerm,
                        mode: "insensitive"
                    }
                }))
        })
    }

    // "" , "medicine"
    if (specialties && specialties.length > 0) {
        andConditions.push({
            doctorSpecialties: {
                some: {
                    specialities: {
                        title: {
                            contains: specialties,
                            mode: "insensitive"
                        }
                    }
                }
            }
        })
    }

    //? filtering
    if (Object.keys(filterData).length > 0) {
        const filterConditions = Object.keys(filterData).map((key) => ({
            [key]: {
                equals: (filterData as any)[key]
            }
        }));
        andConditions.push(...filterConditions)
    }

    const whereCondition: Prisma.DoctorWhereInput = andConditions.length > 0 ? { AND: andConditions } : {}

    const result = await prisma.doctor.findMany({
        where: whereCondition,
        skip,
        take: limit,
        orderBy: {
            [sortBy]: sortOrder
        },
        include: {
            doctorSpecialties: {
                include: {
                    specialities: true
                }
            }
        }
    });

    const total = await prisma.doctor.count({
        where: whereCondition
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

const updateIntoDB = async (id: string, payload: Partial<IDoctorUpdateInput>) => {
    const doctorInfo = await prisma.doctor.findUniqueOrThrow({
        where: {
            id
        }
    });

    const { specialties, ...doctorData } = payload;

    return await prisma.$transaction(async (tnx) => {
        if (specialties && specialties.length > 0) {
            const deleteSpecialtyIds = specialties.filter((specialty) => specialty.isDeleted);

            for (const specialty of deleteSpecialtyIds) {
                await tnx.doctorSpecialties.deleteMany({
                    where: {
                        doctorId: id,
                        specialitiesId: specialty.specialtyId
                    }
                })
            }

            const createSpecialtyIds = specialties.filter((specialty) => !specialty.isDeleted);

            for (const specialty of createSpecialtyIds) {
                await tnx.doctorSpecialties.create({
                    data: {
                        doctorId: id,
                        specialitiesId: specialty.specialtyId
                    }
                })
            }

        }

        const updatedData = await tnx.doctor.update({
            where: {
                id: doctorInfo.id
            },
            data: doctorData,
            include: {
                doctorSpecialties: {
                    include: {
                        specialities: true
                    }
                }
            }

            //  doctor - doctorSpecailties - specialities 
        })

        return updatedData
    })


}

const getByIdFromDB = async (id: string): Promise<Doctor | null> => {
    const result = await prisma.doctor.findUnique({
        where: {
            id,
            isDeleted: false,
        },
        include: {
            doctorSpecialties: {
                include: {
                    specialities: true,
                },
            },
            doctorSchedules: {
                include: {
                    schedule: true
                }
            }
        },
    });
    return result;
};

const deleteFromDB = async (id: string): Promise<Doctor> => {
    return await prisma.$transaction(async (transactionClient) => {
        const deleteDoctor = await transactionClient.doctor.delete({
            where: {
                id,
            },
        });

        await transactionClient.user.delete({
            where: {
                email: deleteDoctor.email,
            },
        });

        return deleteDoctor;
    });
};

const softDelete = async (id: string): Promise<Doctor> => {
    return await prisma.$transaction(async (transactionClient) => {
        const deleteDoctor = await transactionClient.doctor.update({
            where: { id },
            data: {
                isDeleted: true,
            },
        });

        await transactionClient.user.update({
            where: {
                email: deleteDoctor.email,
            },
            data: {
                status: UserStatus.DELETED,
            },
        });

        return deleteDoctor;
    });
};







const getAiSuggestion = async (payload: { symptoms: string }) => {
    if (!(payload && payload.symptoms)) {
        throw new ApiError(httpStatus.BAD_REQUEST, "Symptoms is required")
    }
    //  find doctor 
    const doctors = await prisma.doctor.findMany({
        where: {
            isDeleted: false
        },
        include: {
            doctorSpecialties: {
                include: {
                    specialities: true
                }
            }
        }
    })

    // console.log("doctor data loaded............\n");

    // step 2 --> copy from cheatGpt
    const prompt = `
You are a medical assistant AI. 
A patient described these symptoms: "${payload.symptoms}".
Based on the following doctors and their specialties, suggest the 3 most suitable doctors.

Doctors List:
${JSON.stringify(doctors, null, 2)}

Return your answer in this format with full individual doctor data.
`;

    // console.log("analeysing ............\n");
    // step 3 --> copy openRouter doc
    const completion = await openai.chat.completions.create({
        model: 'z-ai/glm-4.5-air:free',
        messages: [
            {
                role: "system",
                content:
                    "You are an AI medical assistant. You DO NOT diagnose diseases, but you can recommend suitable doctors based on symptoms and specialties.",
            },

            {
                role: 'user',
                content: prompt,
            },
        ],
    });
    const messageContent = typeof completion.choices?.[0]?.message === "string"
        ? completion.choices[0].message
        : (completion.choices?.[0]?.message?.content ?? "");
    const result = await parseDoctorInfo(messageContent);
    // console.log(completion.choices[0].message.content);
    return result;

}





export const DoctorService = {
    getAllFromDB,
    updateIntoDB,
    getAiSuggestion,
    softDelete,
    deleteFromDB,
    getByIdFromDB
};