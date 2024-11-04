import { configureStore } from "@reduxjs/toolkit";
import authSliceReducer from "./slice/AuthSlice";
import courseSliceReducer from "../Redux/slice/courseList";
import razorPaySliceReducer from "../Redux/slice/razorpaySlice";
import LectureReducer from "./slice/LectureSlice";
import StateSlice from "./slice/stateSlice";
const Store = configureStore({
  reducer: {
    auth: authSliceReducer,
    course: courseSliceReducer,
    razorpay: razorPaySliceReducer,
    lecture: LectureReducer,
    state: StateSlice,
  },
  devTools: true,
});
export default Store;
