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
    fileUploader.upload.single("file"),
    (req: Request, res: Response, next: NextFunction) => {
        req.body = userValidation.createAdminValidationSchema.parse(JSON.parse(req.body.data));

        return UserController.createAdmin(req, res, next)
    }
);

router.post(
    "/create-doctor",
    fileUploader.upload.single("file"),
    (req: Request, res: Response, next: NextFunction) => {
        req.body = userValidation.createDoctorValidationSchema.parse(JSON.parse(req.body.data));

        return UserController.createDoctor(req, res, next)
    }
)


export const userRoutes = router;