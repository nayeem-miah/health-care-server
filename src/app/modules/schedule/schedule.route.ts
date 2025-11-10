import { Router } from "express";
import { ScheduleController } from "./schedule.controller";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";
import { userRoutes } from "../user/user.route";

const router = Router();


router.get(
    "/",
    auth(UserRole.ADMIN, UserRole.DOCTOR),
    ScheduleController.scheduleForDoctor
)


router.post(
    "/",
    auth(UserRole.ADMIN),
    ScheduleController.insertIntoDB
)

router.delete(
    "/:id",
    auth(UserRole.ADMIN),
    ScheduleController.deleteScheduleFromDB
)





export const ScheduleRouter = router