import Router from "express";
import {
  addLectureUpdate,
  createCourse,
  getAllCourses,
  getCourses,
  removeCourse,
  removeLectureById,
  updateCourses,
} from "../controllers/Course.controller.js";

import upload from "../middlewares/multermiddlewer.js";
import { isLoggedIn, authorizeRoles } from "../middlewares/auth.middelwer.js";
const CourseRouter = Router();

CourseRouter.route("/")
  .get(getAllCourses)
  .post(
    isLoggedIn,
    authorizeRoles("ADMIN"),
    upload.single("thumbnail"),
    createCourse
  )
  .delete(isLoggedIn, authorizeRoles("ADMIN"), removeLectureById);

CourseRouter.route("/:id")
  .get(isLoggedIn, getCourses)
  .put(isLoggedIn, authorizeRoles("ADMIN"), updateCourses)
  .delete(isLoggedIn, authorizeRoles("ADMIN"), removeCourse)
  .post(
    isLoggedIn,
    authorizeRoles("ADMIN"),
    upload.single("lecture"),
    addLectureUpdate
  );

export default CourseRouter;
