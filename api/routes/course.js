import express from "express";
const router = express.Router();

import { getCourses, createCourse, updateCourse, deleteCourse } from "../controllers/auth/course.js";

router.route("/courses")
    .get(getCourses)
    .post(createCourse);

router.route("/courses/:id")
    .put(updateCourse)
    .delete(deleteCourse);

export default router;