import express, { NextFunction, Request, Response } from "express";
import { UserController } from "./user.controller";
import { fileUploader } from "../../helpers/fileUpload";
import { userValidation } from "./user.validation";
import { UserRole } from "@prisma/client";
import auth from "../../middlewares/auth";

const router = express.Router();

router.get(
    "/",
    auth(UserRole.ADMIN),
    UserController.getAllFRomDB
)

router.get(
    "/me",
    auth(UserRole.ADMIN, UserRole.PATIENT, UserRole.DOCTOR),
    UserController.getMeProfile
)

router.post(
    "/create-patient",
    fileUploader.upload.single("file"), // uploading file
    (req: Request, res: Response, next: NextFunction) => {
        req.body = userValidation.createPatientValidationSchema.parse(JSON.parse(req.body.data))
        return UserController.createPatient(req, res, next)
    }, // upload data
)

router.post(
    "/create-admin",
    auth(UserRole.ADMIN),
    fileUploader.upload.single("file"),
    (req: Request, res: Response, next: NextFunction) => {
        req.body = userValidation.createAdminValidationSchema.parse(JSON.parse(req.body.data));

        return UserController.createAdmin(req, res, next)
    }
);

router.post(
    "/create-doctor",
    auth(UserRole.DOCTOR),
    fileUploader.upload.single("file"),
    (req: Request, res: Response, next: NextFunction) => {
        req.body = userValidation.createDoctorValidationSchema.parse(JSON.parse(req.body.data));

        return UserController.createDoctor(req, res, next)
    }
)

router.patch(
    "/:id/status",
    auth(UserRole.ADMIN),
    UserController.changeProfileStatus
)

export const userRoutes = router;