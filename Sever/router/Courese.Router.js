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
  .post(upload.single("thumbnail"), createCourse)
  .delete(removeLectureById);

CourseRouter.route("/:id")
  .get(getCourses)
  .put(updateCourses)
  .delete(removeCourse)
  .post(upload.single("lecture"), addLectureUpdate);

export default CourseRouter;
