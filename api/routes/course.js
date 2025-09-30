import express from "express";
const router = express.Router();

import { getCourses } from "../controllers/auth/course.js";

router.route("/")
    .get(getCourses)

export default router;