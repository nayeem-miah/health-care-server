import { Prisma } from "@prisma/client";
import { IOptions, paginationHelper } from "../../helpers/paginationHelpers";
import { prisma } from "../../shared/prisma"
import { doctorSearchableFields } from "./doctor.constant";

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


export const DoctorService = {
    getAllFromDB
};