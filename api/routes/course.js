import express from "express";
const router = express.Router();

import { getCourses, createCourse, updateCourse, deleteCourse } from "../controllers/auth/course.js";

router.route("/")
    .get(getCourses)
    .post(createCourse);

router.route("/:id")
    .put(updateCourse)
    .delete(deleteCourse);

export default router;