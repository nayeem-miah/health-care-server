import express from 'express';
import { AppointmentRoutes } from '../modules/appointment/appointment.route';
import { authRoutes } from '../modules/auth/auth.route';
import { DoctorRoutes } from '../modules/doctor/doctor.route';
import { doctorScheduleRoute } from '../modules/doctorSchedule/doctorSchedule.route';
import { MetaRoutes } from '../modules/meta/meta.route';
import { PatientRoutes } from '../modules/patient/patient.route';
import { PrescriptionRoutes } from '../modules/prescription/prescription.route';
import { ReviewRoutes } from '../modules/review/review.route';
import { ScheduleRouter } from '../modules/schedule/schedule.route';
import { SpecialtiesRoutes } from '../modules/specialties/specialties.route';
import { userRoutes } from '../modules/user/user.route';


const router = express.Router();

const moduleRoutes = [
    {
        path: '/user',
        route: userRoutes
    },
    {
        path: '/auth',
        route: authRoutes
    },
    {
        path: "/schedule",
        route: ScheduleRouter
    },
    {
        path: "/doctor-schedule",
        route: doctorScheduleRoute
    },
    {
        path: "/specialties",
        route: SpecialtiesRoutes
    },
    {
        path: "/doctor",
        route: DoctorRoutes
    },
    {
        path: "/patient",
        route: PatientRoutes
    },
    {
        path: "/appointment",
        route: AppointmentRoutes
    },
    {
        path: "/prescription",
        route: PrescriptionRoutes
    },
    {
        path: "/review",
        route: ReviewRoutes
    },
    {
        path: "/metadata",
        route: MetaRoutes
    },
];

moduleRoutes.forEach(route => router.use(route.path, route.route))

export default router;