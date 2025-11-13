import { Router } from "express";
import { DoctorController } from "./doctor.controller";
import { UserRole } from "@prisma/client";
import auth from "../../middlewares/auth";

const router = Router();

router.get(
    "/",
    DoctorController.getAllFromDB
);

router.post(
    "/suggestion",
    DoctorController.getAiSuggestion
);



router.get('/:id', DoctorController.getByIdFromDB);

router.patch(
    "/:id",
    auth(UserRole.ADMIN, UserRole.DOCTOR),
    DoctorController.updateIntoDB
);

router.delete(
    '/:id',
    auth(UserRole.ADMIN),
    DoctorController.deleteFromDB
);

router.delete(
    '/soft/:id',
    auth(UserRole.ADMIN),
    DoctorController.softDelete);


export const DoctorRoutes = router;