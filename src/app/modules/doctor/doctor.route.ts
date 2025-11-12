import { Router } from "express";
import { DoctorController } from "./doctor.controller";

const router = Router();

router.get(
    "/",
    DoctorController.getAllFromDB
);

router.post(
    "/suggestion",
    DoctorController.getAiSuggestion
);


router.patch(
    "/:id",
    DoctorController.updateIntoDb
);

export const DoctorRoutes = router;