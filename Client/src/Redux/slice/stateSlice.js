import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import toast from "react-hot-toast";
import axiosInstance from "../../helper/axiosinstance";

const initialState = {
  allUserCount: 0,
  subscription: 0,
};

export const getStatsData = createAsyncThunk(
  "/Admin/Dashboard/getStets",
  async () => {
    try {
      try {
        const response = axiosInstance.get("/api/v1/Admin");
        toast.promise(response, {
          loading: "Getting the stats...",
          success: (data) => {
            return data?.data?.message;
          },
          error: "Failed to load data stats",
        });
        return (await response).data;
      } catch (error) {
        toast.error(error?.response?.data?.message);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  }
);
const StateSlice = createSlice({
  name: "state",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getStatsData.fulfilled, (state, action) => {
      state.allUserCount = action?.payload?.allUsersCount;
      state.subscription = action?.payload?.subscribedUsersCount;
    });
  },
});
export const {} = StateSlice.actions;
export default StateSlice.reducer;
