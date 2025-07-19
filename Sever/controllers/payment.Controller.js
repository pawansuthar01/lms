import Payment from "../module/payment.module.js";
import user from "../module/user.module.js";
import crypto from "crypto";
import { razorpay } from "../server.js";

import AppError from "../utils/apperror.js";

const buySubscription = async (req, res, next) => {
  const { id } = req.user; // Extracting id from req.user correctly
  console.log(id);
  try {
    // Make sure to await the findById method since it's an async operation
    const User = await user.findById(id);

    if (!User) {
      return next(new AppError("Unauthorized, please login", 400));
    }

    if (User.role === "ADMIN") {
      return next(
        new AppError("ADMIN cannot buy a subscription, please login", 400)
      );
    }

    // Ensure the PLAN_ID exists and log it for debugging
    if (!process.env.PLAN_ID) {
      return next(
        new AppError("Plan ID is not defined in environment variables", 500)
      );
    }

    // Create Razorpay subscription, wrap it in try-catch to handle errors
    const subscription = await razorpay.subscriptions.create({
      plan_id: process.env.PLAN_ID,
      customer_notify: 1,
      total_count: 12,
    });

    // Update User with subscription details
    User.subscription.id = subscription.id;
    User.subscription.status = subscription.status;

    // Save the updated user
    await User.save();

    // Return response
    res.status(200).json({
      success: true,
      message: "Subscription created successfully",
      subscriptionID: User.subscription.id,
    });
  } catch (error) {
    // Handle potential errors from the async operations
    console.error(error);
    return next(
      new AppError("Something went wrong. Please try again later.", 500)
    );
  }
};
const verifySubscription = async (req, res, next) => {
  const { id } = req.user;
  const { razorpay_payment_id, razorpay_subscription_id, razorpay_signature } =
    req.body;

  const User = await user.findById(id);

  if (!User) {
    return next(new AppError("unAuthorized ,please login", 400));
  }

  const subscriptionId = User.subscription.id;
  console.log(subscriptionId);
  const generatedSignature = crypto
    .createHmac("sha256", process.env.KEY_ID)
    .update(`${razorpay_payment_id}|${subscriptionId}`)
    .digest("hex");

  if (!generatedSignature == razorpay_signature) {
    return next(
      new AppError("payment does not successfully please try again", 400)
    );
  }
  await Payment.create({
    razorpay_payment_id,
    razorpay_subscription_id,
    razorpay_signature,
  });

  User.subscription.status = "active";
  await User.save();
  res.status(200).json({
    success: true,
    message: "'Payment verified successfully",
  });
};
const cancelSubscription = async (req, res, next) => {
  const { id } = req.user;

  const User = await user.findById(id);
  if (!User) {
    return next(new AppError("user does not exits", 400));
  }
  if (User.role === "ADMIN") {
    return next(
      new AppError("Admin does not need to cannot cancel subscription", 400)
    );
  }
  const subscriptionId = User.subscription.id;
  try {
    const subscription = await razorpay.subscriptions.cancel(subscriptionId);
    User.subscription.status = subscription.status;
    await User.save();
    res.status(200).json({
      success: true,
      message: "successfully unsubscribe",
    });
  } catch (error) {
    return next(new AppError(error.message, 500));
  }
};
const getRazorpayApiKey = (req, res, next) => {
  try {
    res.status(200).json({
      success: true,
      message: "razorpay key",
      data: process.env.KEY_ID,
    });
  } catch (error) {
    return next(new AppError(error.message, 500));
  }
};
export const allPayments = async (req, res, next) => {
  const { count, skip } = req.query;

  try {
    const allPayments = await razorpay.subscriptions.all({
      count: count ? count : 10,
      skip: skip ? skip : 0,
    });

    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    const finalMonths = {
      January: 0,
      February: 0,
      March: 0,
      April: 0,
      May: 0,
      June: 0,
      July: 0,
      August: 0,
      September: 0,
      October: 0,
      November: 0,
      December: 0,
    };

    const monthlyWisePayments = allPayments.items.map((payment) => {
      const monthsInNumbers = new Date(payment.start_at * 1000);

      return monthNames[monthsInNumbers.getMonth()];
    });

    monthlyWisePayments.map((month) => {
      Object.keys(finalMonths).forEach((objMonth) => {
        if (month === objMonth) {
          finalMonths[month] += 1;
        }
      });
    });

    const monthlySalesRecord = [];

    Object.keys(finalMonths).forEach((monthName) => {
      monthlySalesRecord.push(finalMonths[monthName]);
    });

    res.status(200).json({
      success: true,
      message: "All payments",
      allPayments,
      finalMonths,
      monthlySalesRecord,
    });
  } catch (error) {
    return next(new AppError(error.message, 500));
  }
};

export {
  cancelSubscription,
  verifySubscription,
  buySubscription,
  getRazorpayApiKey,
};
