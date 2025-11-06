import express, { NextFunction, Request, Response } from "express";
import { UserController } from "./user.controller";
import { fileUploader } from "../../helpers/fileUpload";
import { userValidation } from "./user.validation";

const router = express.Router();

router.post(
    "/create-patient",
    fileUploader.upload.single("file"), // uploading file
    (req: Request, res: Response, next: NextFunction) => {
        req.body = userValidation.createPatientValidationSchema.parse(JSON.parse(req.body.data))
        return UserController.createPatient(req, res, next)
    }, // upload data
)


export const userRoutes = router;