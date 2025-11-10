import express from "express";
import { DoctorScheduleController } from "./doctorSchedule.controller";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";


const router = express.Router();

router.post(
    "/",
    auth(UserRole.DOCTOR), //* if user is doctor 
    DoctorScheduleController.insertIntoDB
)




export const doctorScheduleRoute = router;