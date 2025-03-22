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
authRouters.get("/logout", logOut);
authRouters.get("/me", getProfile);
authRouters.post("/resetPassword", resetPassword);
authRouters.post("/changePassword/:resetToken", changePassword);
authRouters.post("/updatePassword", updatePassword);
authRouters.put("/updateUser", upload.single("avatar"), updateUser);
export default authRouters;
