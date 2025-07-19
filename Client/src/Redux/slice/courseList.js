import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import toast from "react-hot-toast";
import axiosInstance from "../../helper/axiosinstance";

const initialState = {
  courseData: [],
};
export const getAllCourseList = createAsyncThunk("/course/get", async () => {
  try {
    const res = axiosInstance.get("/api/v1/Course");
    toast.promise(res, {
      loading: "wait! Courses is Loading...",
      success: "successFully Courses Loaded...",
      error: "failed Courses Load..",
    });
    return (await res).data.courses;
  } catch (error) {
    toast.error(error?.response?.message);
  }
});
export const DeleteCourse = createAsyncThunk("/course/Deletes", async (id) => {
  try {
    const res = axiosInstance.delete(`/api/v1/Course/${id}`);
    toast.promise(res, {
      loading: "wait! Courses is Deletes...",
      success: "successFully Courses Deleted...",
      error: "failed Courses Deleted..",
    });
    return (await res).data.courses;
  } catch (error) {
    toast.error(error?.response?.message);
  }
});

export const createNewCourse = createAsyncThunk(
  "/Course/Create",
  async (data) => {
    console.log(data);
    try {
      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("description", data.description);
      formData.append("createdBy", data.createdBy);
      formData.append("category", data.category);
      formData.append("thumbnail", data.thumbnail);

      const res = axiosInstance.post("api/v1/Course", formData);
      toast.promise(res, {
        loading: "wait ! course is Creating..",

        success: (data) => {
          return data?.data?.message;
        },

        error: (data) => {
          console.log(error);

          return data?.response.message;
        },
      });
      return (await res).data;
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.message);
    }
  }
);

const courseSliceReducer = createSlice({
  name: "Course",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getAllCourseList.fulfilled, (state, action) => {
      if (action.payload) {
        state.courseData = [...action.payload];
      }
    });
  },
});
export default courseSliceReducer.reducer;
