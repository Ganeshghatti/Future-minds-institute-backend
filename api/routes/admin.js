import express from "express";
import { adminLogin } from "../controllers/admin/auth.js";
import { getCourses, createCourse, updateCourse, deleteCourse } from "../controllers/admin/course.js";
import { getCategories, createCategory, updateCategory, deleteCategory } from "../controllers/admin/category.js";
import adminAuth from "../middlewares/admin-auth.js";

const router = express.Router();

router.route("/login").post(adminLogin);

router.route("/courses")
    .get(adminAuth, getCourses)
    .post(adminAuth, createCourse);

router.route("/courses/:id")
    .put(adminAuth, updateCourse)
    .delete(adminAuth, deleteCourse);

router.route("/categories")
    .get(adminAuth, getCategories)
    .post(adminAuth, createCategory);

router.route("/categories/:id")
    .put(adminAuth, updateCategory)
    .delete(adminAuth, deleteCategory);

export default router;