import { Schema, model } from "mongoose";

const PaymentSchema = new Schema(
  {
    razorpay_payment_id: {
      type: "string",
      required: true,
    },
    razorpay_subscription_id: {
      type: "string",
      required: true,
    },
    razorpay_signature: {
      type: "string",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);
const Payment = model("Payment", PaymentSchema);
export default Payment;
