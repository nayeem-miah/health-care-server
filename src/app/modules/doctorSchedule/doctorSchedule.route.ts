import express from "express";
import { DoctorScheduleController } from "./doctorSchedule.controller";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";
import validateRequest from "../../middlewares/validateRequest";
import { doctorScheduleValidation } from "./doctorSchedule.validation";


const router = express.Router();

router.get(
    "/",
    auth(UserRole.DOCTOR), //* if user is doctor 
    DoctorScheduleController.getAllDoctorSchedule
)

router.get(
    '/my-schedule',
    auth(UserRole.DOCTOR),
    DoctorScheduleController.getMySchedule
)

router.post(
    "/",
    auth(UserRole.DOCTOR), //* if user is doctor 
    validateRequest(doctorScheduleValidation.createDoctorScheduleValidationSchema),
    DoctorScheduleController.insertIntoDB
)




export const doctorScheduleRoute = router;