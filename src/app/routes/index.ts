import express from 'express';
import { userRoutes } from '../modules/user/user.route';
import { authRoutes } from '../modules/auth/auth.route';
import { ScheduleRouter } from '../modules/schedule/schedule.route';
import { doctorScheduleRoute } from '../modules/doctorSchedule/doctorSchedule.route';
import { SpecialtiesRoutes } from '../modules/specialties/specialties.route';
import { DoctorRoutes } from '../modules/doctor/doctor.route';


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
    }
];

moduleRoutes.forEach(route => router.use(route.path, route.route))

export default router;