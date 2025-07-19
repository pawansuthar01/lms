import { stringify } from "querystring";
import upload from "../middlewares/multermiddlewer.js";
import user from "../module/user.module.js";
import AppError from "../utils/apperror.js";
import bcrypt from "bcryptjs";
import cloudinary from "cloudinary";
import Fs from "fs/promises";
import SendMail from "../utils/SendMail.js";
import crypto from "crypto";

const cookieOption = {
  maxAge: 7 * 24 * 60 * 60 * 1000,
  httpOnly: true,
  secure: true,
};
const registerUser = async (req, res, next) => {
  const { fullName, email, password } = req.body;
  if (!fullName || !email || !password) {
    return next(new AppError("All fields are required", 406));
  }

  try {
    const userExists = await user.findOne({ email });
    if (userExists) {
      return next(new AppError("email has already exist", 402));
    }
    const User = await user.create({
      fullName,
      email,
      password,
      avatar: {
        public_id: email,
        secure_url:
          "https://res.cloudinary.com/du9jzqlpt/image/upload/v1674647316/avatar_drzgxv.jpg",
      },
    });
    if (!User) {
      return next(
        new AppError("user registration failed 'please try again", 401)
      );
    }
    if (req.file) {
      try {
        const result = await cloudinary.v2.uploader.upload(req.file.path, {
          folder: "lms",
          width: 250,
          height: 250,
          gravity: "faces",
          crop: "fill",
        });

        if (result) {
          User.avatar.public_id = result.public_id;
          User.avatar.secure_url = result.secure_url;

          //
          Fs.rm(`uploads/${req.file.filename}`);
        }
      } catch (error) {
        Fs.rm(`uploads/${req.file.filename}`);
        return next(
          new AppError(`file upload file try again ${error.message}`, 4020)
        );
      }
    }

    await User.save();
    const token = await User.generateJWTToken();
    User.password = undefined;
    res.cookie("token", token, cookieOption);
    res.status(200).json({
      success: true,
      Data: User,
      message: "account has successfully created",
    });
  } catch (error) {
    return next(new AppError(error.message, 400));
  }
};
const logIn = async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new AppError("ALL filed is required", 400));
  }

  try {
    const userExists = await user.findOne({ email }).select("+password");
    if (!userExists) {
      return next(new AppError("user is Does't exits", 400));
    }

    if (!(await bcrypt.compare(password, userExists.password))) {
      return next(new AppError("password Does't match", 400));
    }

    const token = await userExists.generateJWTToken();
    userExists.password = undefined;
    res.cookie("token", token, cookieOption);
    console.log("token =" + token);
    res.status(200).json({
      success: true,
      data: userExists,
      message: "account has successfully logIn",
    });
  } catch (error) {
    return next(new AppError(error.message, 400));
  }
};
const logOut = (req, res, next) => {
  try {
    res.cookie("token", null, {
      maxAge: 0,
      httpOnly: true,
      secure: true,
    });
    res.status(200).json({
      success: true,
      data: user,
      message: "successfully logout",
    });
  } catch (error) {
    return next(new AppError(error.message, 400));
  }
};
const getProfile = async (req, res, next) => {
  try {
    const User = await user.findById(req.body.id);

    res.status(200).json({
      success: true,
      data: User,
      message: "successfully getProfile",
    });
  } catch (error) {
    return next(new AppError(error.message, 400));
  }
};

const resetPassword = async (req, res, next) => {
  const { email } = req.body;

  if (!email) {
    return next(new AppError("Email is required", 400));
  }

  const findUser = await user.findOne({ email });
  if (!findUser) {
    return next(new AppError("Email does not exist", 400));
  }

  const resetToken = await findUser.generatePasswordResetToken();
  await findUser.save();

  const resetPasswordUrl = `${process.env.FRONTEND_URL}/changePassword/${resetToken}`;
  console.log(resetPasswordUrl);
  const subject = "Reset Password";
  const message = `You can reset your password by clicking <a href=${resetPasswordUrl} target="_blank">Reset your password</a>.
    If the above link does not work for some reason, copy-paste this link in a new tab: ${resetPasswordUrl}.
    If you did not request this, kindy ignore this email.`;

  try {
    await SendMail(email, subject, message);
    res.status(200).json({
      success: true,

      message: `Successfully sent mail to ${email}`,
    });
  } catch (error) {
    findUser.forgotPasswordToken = undefined;
    findUser.forgotPasswordExpiry = undefined;
    await findUser.save();

    return next(new AppError("Failed to send email " + error.message, 500));
  }
};

const changePassword = async (req, res, next) => {
  const { resetToken } = req.params;
  const { password } = req.body;
  if (!password) {
    return next(new AppError("all finds are required", 400));
  }
  try {
    const forgotPasswordToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    const User = await user.findOne({
      forgotPasswordToken,
      forgotPasswordExpiry: { $gt: Date.now() },
    });

    if (!User) {
      return next(
        new AppError("token is does't exits or expiry ,please try again", 400)
      );
    }
    User.password = password;
    User.forgotPasswordExpiry = undefined;
    User.forgotPasswordToken = undefined;
    await User.save();
    res.status(200).json({
      success: true,
      message: "password is updated successfully",
    });
  } catch (error) {
    return next(new AppError(error.message, 400));
  }
};

const updatePassword = async (req, res, next) => {
  const { password, newPassword } = req.body;

  if (!password || !newPassword) {
    return next(new AppError("All filed is required", 400));
  }
  try {
    const User = await user.findById(req.body.id).select("+password");
    if (!(await bcrypt.compare(password, User.password))) {
      return next(new AppError("password Does't match", 400));
    }
    User.password = newPassword;
    await User.save();
    User.password = undefined;
    res.status(200).json({
      success: true,
      message: "password successfully updated ",
    });
  } catch (error) {
    return next(new AppError(error.message, 400));
  }
};

const updateUser = async (req, res, next) => {
  const { fullName } = req.body;
  const User = await user.findById(req.user.id);
  if (!User) {
    return next(new AppError("user does not exits", 400));
  }
  if (fullName) {
    User.fullName = fullName;
  }
  if (req.file) {
    await cloudinary.v2.uploader.destroy(User.avatar.public_id);
  }
  if (req.file) {
    try {
      const result = await cloudinary.v2.uploader.upload(req.file.path, {
        folder: "lms",
        width: 250,
        height: 250,
        gravity: "faces",
        crop: "fill",
      });

      if (result) {
        console.log(result);
        User.avatar.public_id = result.public_id;
        User.avatar.secure_url = result.secure_url;

        Fs.rm(`uploads/${req.file.filename}`);
      }
    } catch (error) {
      return next(
        new AppError(`file upload file try again ${error.message}`, 400)
      );
    }
  }

  await User.save();
  res.status(200).json({
    success: true,
    message: "successfully update profile",
  });
};
export const userState = async (req, res, next) => {
  try {
    const allUsersCount = await user.countDocuments();
    const subscribedUsersCount = await user.countDocuments({
      "subscription.status": "active",
    });

    res.status(200).json({
      success: true,
      message: "get data",
      allUsersCount,
      subscribedUsersCount,
    });
  } catch (error) {
    return next(new AppError(error.message, 400));
  }
};

export {
  registerUser,
  logIn,
  logOut,
  getProfile,
  resetPassword,
  changePassword,
  updatePassword,
  updateUser,
};
