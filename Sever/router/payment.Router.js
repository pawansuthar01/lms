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

PaymentRouter.route("/subscribe").post(buySubscription);

PaymentRouter.route("/verify").post(verifySubscription);

PaymentRouter.route("/unsubscribe").post(
  CheckPaymentStatus,
  cancelSubscription
);

PaymentRouter.route("/razorpay-key").get(getRazorpayApiKey);

PaymentRouter.route("/").get(allPayments);
export default PaymentRouter;
