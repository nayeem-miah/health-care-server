import { Router } from "express";
import { ScheduleController } from "./schedule.controller";

const router = Router();


router.get(
    "/",
    ScheduleController.scheduleForDoctor
)


router.post(
    "/",
    ScheduleController.insertIntoDB
)

router.delete(
    "/:id",
    ScheduleController.deleteScheduleFromDB
)





export const ScheduleRouter = router