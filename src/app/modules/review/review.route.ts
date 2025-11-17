import { Router } from "express";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";
import { ReviewController } from "./review.controller";

const router = Router();

router.get('/', ReviewController.getAllFromDB)

router.post(
    "/",
    auth(UserRole.PATIENT),
    ReviewController.insertIntoDB

);

export const ReviewRoutes = router;