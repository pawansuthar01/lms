import { Router } from "express";
import {
  authorizeRoles,
  CheckPaymentStatus,
  isLoggedIn,
} from "../middlewares/auth.middelwer.js";
import {
  allPayments,
  buySubscription,
  cancelSubscription,
  getRazorpayApiKey,
  verifySubscription,
} from "../controllers/payment.Controller.js";
const PaymentRouter = Router();

PaymentRouter.route("/subscribe").post(isLoggedIn, buySubscription);

PaymentRouter.route("/verify").post(isLoggedIn, verifySubscription);

PaymentRouter.route("/unsubscribe").post(
  isLoggedIn,
  CheckPaymentStatus,
  cancelSubscription
);

PaymentRouter.route("/razorpay-key").get(isLoggedIn, getRazorpayApiKey);

PaymentRouter.route("/").get(isLoggedIn, authorizeRoles("ADMIN"), allPayments);
export default PaymentRouter;
