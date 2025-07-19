import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import toast from "react-hot-toast";
import axiosInstance from "../../helper/axiosinstance";
import reducer from "./AuthSlice";

const initialState = {
  lecture: [],
};

export const getCourseLecture = createAsyncThunk(
  "/Course/Lecture",
  async (cdi) => {
    try {
      const response = axiosInstance.get(`/api/v1/Course/${cdi}`);
      toast.promise(response, {
        loading: "wait! lecture is Loading..",
        success: (data) => {
          return data?.data?.message;
        },
        error: "Failed to fetch lectures",
      });

      return (await response).data;
    } catch (error) {
      toast.error(error?.response?.data.message);
    }
  }
);
export const addCourseLecture = createAsyncThunk(
  "/course/lecture/add",
  async (data) => {
    const formData = new FormData();
    formData.append("lecture", data.lecture);
    formData.append("title", data.title);
    formData.append("description", data.description);

    try {
      const res = axiosInstance.post(`/api/v1/Course/${data.id}`, formData);

      toast.promise(res, {
        loading: "Adding the lecture...",
        success: "Lecture added successfully",
        error: "Failed to add lecture",
      });

      const response = await res;

      return response.data;
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  }
);
export const deleteCourseLecture = createAsyncThunk(
  "/Course/DeleteLecture",
  async (data) => {
    console.log(data);
    try {
      const response = axiosInstance.delete(
        `/api/v1/Course/?courseId=${data?.courseId}&lectureId=${data?.lectureId}`
      );
      toast.promise(response, {
        loading: "wait! lecture is Deleting..",
        success: (data) => {
          return data?.data?.message;
        },

        error: (data) => {
          return data?.response.message;
        },
      });
      return (await response).data;
    } catch (error) {
      toast.error(error?.response?.message);
    }
  }
);

const LectureReducer = createSlice({
  name: "lecture",
  initialState,
  reducers: {},

  extraReducers: (builder) => {
    builder
      .addCase(getCourseLecture.fulfilled, (state, action) => {
        state.lecture = action?.payload?.lectures;
      })
      .addCase(addCourseLecture.fulfilled, (state, action) => {
        state.lecture = action?.payload?.Course?.lectures;
      });
  },
});
export const {} = LectureReducer.actions;
export default LectureReducer.reducer;
