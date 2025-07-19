import JWT from "jsonwebtoken";
import AppError from "../utils/apperror.js";

const isLoggedIn = async (req, res, next) => {
  try {
    const { token } = req.cookies;

    if (!token) {
      return next(new AppError("Unauthenticated,please login ", 500));
    }

    const userDetails = await JWT.verify(token, process.env.SECRET);
    req.user = {
      id: userDetails.id,
      email: userDetails.email,
      role: userDetails.role,
    };
  } catch (error) {
    return next(new AppError(error.message, 400));
  }

  next();
};

const CheckPaymentStatus = async (req, res, next) => {
  try {
    const { id, role, subscriptionStatus } = req.body;
    if (role == "ADMIN" && subscriptionStatus !== "active") {
      return next(new AppError("please buySubscription", 405));
    }
  } catch (error) {
    return next(new AppError(error.message, 400));
  }

  next();
};

const authorizeRoles =
  (...roles) =>
  async (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new AppError("you have not permission for this work", 400));
    }
    next();
  };
export { isLoggedIn, authorizeRoles, CheckPaymentStatus };
