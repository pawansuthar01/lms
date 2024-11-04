import Router from "express";
import {
  changePassword,
  getProfile,
  logIn,
  logOut,
  registerUser,
  resetPassword,
  updatePassword,
  updateUser,
} from "../controllers/authController.js";

import upload from "../middlewares/multermiddlewer.js";
import { isLoggedIn } from "../middlewares/auth.middelwer.js";

const authRouters = Router();

authRouters.post("/register", upload.single("avatar"), registerUser);
authRouters.post("/login", logIn);
authRouters.get("/logout", isLoggedIn, logOut);
authRouters.get("/me", isLoggedIn, getProfile);
authRouters.post("/resetPassword", resetPassword);
authRouters.post("/changePassword/:resetToken", changePassword);
authRouters.post("/updatePassword", isLoggedIn, updatePassword);
authRouters.put("/updateUser", isLoggedIn, upload.single("avatar"), updateUser);
export default authRouters;
