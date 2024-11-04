import Course from "../module/Course.module.js";
import AppError from "../utils/apperror.js";
import cloudinary from "cloudinary";
import fs from "fs/promises";

const getAllCourses = async (req, res, next) => {
  try {
    const courses = await Course.find({}).select("-lectures");

    if (!courses) {
      return next(new AppError("courses does not exits please try again", 400));
    }
    res.status(200).json({
      success: true,
      message: "all courses ",
      courses,
    });
  } catch (error) {
    return next(new AppError(error, 400));
  }
};
const getCourses = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!id) {
      return next(new AppError("course id not get"));
    }
    const course = await Course.findById(id);
    if (!course) {
      return next(new AppError("course does not exit please try again", 400));
    }
    res.status(200).json({
      success: true,
      message: "get courses ",
      lectures: course.lectures,
    });
  } catch (error) {
    return next(new AppError(error, 400));
  }
};
const createCourse = async (req, res, next) => {
  const { title, description, category, createdBy } = req.body;

  if (!title || !description || !category || !createdBy) {
    return next(new AppError("All fields are required", 400));
  }

  const course = await Course.create({
    title,
    description,
    category,
    createdBy,
    thumbnail: {
      public_id: "this one time use",
      secure_url: "this one time use",
    },
  });

  if (!course) {
    return next(
      new AppError("Course could not be created, please try again", 400)
    );
  }

  if (req.file) {
    try {
      const result = await cloudinary.v2.uploader.upload(req.file.path, {
        folder: "lms",
      });

      if (result) {
        course.thumbnail.public_id = result.public_id;

        course.thumbnail.secure_url = result.secure_url;
      }
      fs.rm(`uploads/${req.file.filename}`);
    } catch (error) {
      fs.rm(`uploads/${req.file.filename}`);

      return next(
        new AppError(JSON.stringify(error) || "file is not uploaded", 400)
      );
    }
  }

  await course.save();

  res.status(201).json({
    success: true,
    message: "Course created successfully",
    course,
  });
};
const updateCourses = async (req, res, next) => {
  const { id } = req.params;

  if (!id) {
    return next(new AppError("id does not exits ", 400));
  }

  try {
    const course = await Course.findByIdAndUpdate(
      id,
      {
        $set: req.body,
      },
      {
        runValidators: true,
      }
    );
    if (!course) {
      return next(new AppError("course does not exits please try again ", 400));
    }
    res.status(200).json({
      success: true,
      message: "successfully course updated",
      course,
    });
  } catch (e) {
    return next(new AppError(e, 500));
  }
};
const removeCourse = async (req, res, next) => {
  const { id } = req.params;
  if (!id) {
    return next(new AppError("id does not exits ", 400));
  }

  try {
    const course = await Course.findByIdAndDelete(id);
    if (!course) {
      return next(
        new AppError("course does not exits please try again  ", 400)
      );
    }
    res.status(200).json({
      success: true,
      message: "delete successfully",
    });
  } catch (e) {
    return next(new AppError(e.message, 500));
  }
};

const addLectureUpdate = async (req, res, next) => {
  const { title, description } = req.body;
  const { id } = req.params;
  console.log(req.files);
  let lectureData = {};

  if (!title || !description) {
    return next(new AppError("Title and Description are required", 400));
  }

  const course = await Course.findById(id);

  if (!course) {
    return next(new AppError("Invalid course id or course not found.", 400));
  }

  // Run only if user sends a file
  if (req.file) {
    try {
      const result = await cloudinary.v2.uploader.upload(req.file.path, {
        folder: "lms", // Save files in a folder named lms
        chunk_size: 50000000, // 50 mb size
        resource_type: "video",
      });

      // If success
      if (result) {
        // Set the public_id and secure_url in array
        lectureData.public_id = result.public_id;
        lectureData.secure_url = result.secure_url;
      }

      // After successful upload remove the file from local storage
      fs.rm(`uploads/${req.file.filename}`);
    } catch (error) {
      // Empty the uploads directory without deleting the uploads directory
      for (const file of await fs.readdir("uploads/")) {
        await fs.unlink(path.join("uploads/", file));
      }

      // Send the error message
      return next(
        new AppError(
          JSON.stringify(error) || "File not uploaded, please try again",
          400
        )
      );
    }
  }

  course.lectures.push({
    title,
    description,
    lecture: lectureData,
  });

  course.numberOfLectures = course.lectures.length;

  // Save the course object
  await course.save();

  res.status(200).json({
    success: true,
    message: "Course lecture added successfully",
    course,
  });
};

const removeLectureById = async (req, res, next) => {
  const { courseId, lectureId } = req.query;
  try {
    if (!courseId) {
      return next(new AppError("Course ID is required", 400));
    }

    if (!lectureId) {
      return next(new AppError("Lecture ID is required", 400));
    }
    const course = await Course.findById(courseId);
    if (!course) {
      return next(new AppError("Invalid ID or Course does not exist.", 404));
    }
    const lectureIndex = await course.lectures.findIndex(
      (lecture) => lecture.id.toString() === lectureId.toString()
    );
    if (lectureIndex === -1) {
      return next(new AppError("Lecture does not exist.", 404));
    }
    await cloudinary.v2.uploader.destroy(
      course.lectures[lectureIndex].lecture.public_id,
      {
        resource_type: "video",
      }
    );

    course.lectures.splice(lectureIndex, 1);
    course.numberOfLectures = course.lectures.length;
    await course.save();
    res.status(200).json({
      success: true,
      message: "successfully deleted",
      course,
    });
  } catch (error) {
    return next(new AppError(error, 500));
  }
};

export {
  getAllCourses,
  getCourses,
  createCourse,
  updateCourses,
  removeCourse,
  addLectureUpdate,
  removeLectureById,
};
