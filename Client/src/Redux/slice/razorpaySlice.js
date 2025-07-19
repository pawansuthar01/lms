import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../../helper/axiosinstance";
import toast from "react-hot-toast";

const initialState = {
  key: "",
  subscription_id: "",
  isPaymentVerified: false,
  allPayment: {},
  finalMonths: {},
  monthlySalesRecord: {},
};
export const getRazorPayId = createAsyncThunk("/razorPay/getId", async () => {
  try {
    const res = await axiosInstance.get("/api/v1/payment/razorpay-key");
    return res.data;
  } catch (error) {
    toast.error("Failed to load data");
  }
});

export const purchaseCourseBundle = createAsyncThunk(
  "/purchaseCourse",
  async () => {
    try {
      const response = await axiosInstance.post("/api/v1/payment/subscribe");

      return response.data;
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  }
);

export const verifyUserPayment = createAsyncThunk(
  "/payments/verify",
  async (data) => {
    try {
      const response = axiosInstance.post("/api/v1/payment/verify/", {
        razorpay_payment_id: data.razorpay_payment_id,
        razorpay_subscription_id: data.razorpay_subscription_id,
        razorpay_signature: data.razorpay_signature,
      });
      toast.promise(response, {
        loading: "check your payment ...",
        success: "successfully your payment..",
        error: "payment failed....",
      });
      return (await response).data;
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  }
);

export const getPaymentRecord = createAsyncThunk(
  "/payments/record",
  async () => {
    try {
      const response = axiosInstance.get("/api/v1/payment?count=100");
      toast.promise(response, {
        loading: "Getting the payment records",
        success: (data) => {
          return data?.data?.message;
        },
        error: "Failed to get payment records",
      });
      return (await response).data;
    } catch (error) {
      toast.error("Operation failed");
    }
  }
);

export const cancelCourseBundle = createAsyncThunk(
  "/payments/cancel",
  async (data) => {
    try {
      const response = axiosInstance.post("/api/v1/payment/unsubscribe", {
        role: data.role,
        subscriptionStatus: data.subscriptionStatus,
      });
      toast.promise(response, {
        loading: "unsubscribing the bundle",
        success: (data) => {
          return data?.data?.message;
        },
        error: "Failed to unSubscribe",
      });
      return (await response).data;
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  }
);

const courseSliceReducer = createSlice({
  name: "razorPay",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getRazorPayId.fulfilled, (state, action) => {
        state.key = action?.payload?.data;
      })
      .addCase(purchaseCourseBundle.fulfilled, (state, action) => {
        state.subscription_id = action?.payload?.subscriptionID;
      })
      .addCase(verifyUserPayment.fulfilled, (state, action) => {
        toast.success(action?.payload?.data?.message);
        state.isPaymentVerified = action?.payload?.data?.success;
      })
      .addCase(verifyUserPayment.rejected, (state, action) => {
        toast.success(action?.payload?.data?.message);
        state.isPaymentVerified = action?.payload?.data?.success;
      })
      .addCase(getPaymentRecord.fulfilled, (state, action) => {
        state.allPayments = action?.payload?.allPayments;
        state.finalMonths = action?.payload?.finalMonths;
        state.monthlySalesRecord = action?.payload?.monthlySalesRecord;
      });
  },
});

export default courseSliceReducer.reducer;
