import { AiOutlineArrowLeft } from "react-icons/ai";
import HomeLayout from "../../Layout/homeLayout";
import { useState } from "react";
import toast from "react-hot-toast";
import { createNewCourse } from "../../Redux/slice/courseList";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

function CoursesCreate() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [userInput, setUserInput] = useState({
    title: "",
    createdBy: "",
    category: "",
    description: "",
    thumbnail: null,
    previewImage: "",
  });

  function handelImageUploads(e) {
    e.preventDefault();

    const uploadedImage = e.target.files[0];

    if (uploadedImage) {
      const fileReader = new FileReader();

      fileReader.readAsDataURL(uploadedImage);
      fileReader.addEventListener("load", function () {
        setUserInput({
          ...userInput,
          previewImage: this.result,
          thumbnail: uploadedImage,
        });
      });
    }
  }

  function handelUserInput(e) {
    e.preventDefault();
    const { name, value } = e.target;
    setUserInput({
      ...userInput,
      [name]: value,
    });
  }

  async function onFormSubmit(e) {
    e.preventDefault();
    if (
      !userInput.title ||
      !userInput.thumbnail ||
      !userInput.category ||
      !userInput.createdBy ||
      !userInput.description
    ) {
      toast.error("all failed is required");
      return;
    }
    const response = await dispatch(createNewCourse(userInput));
    if (response?.payload?.success) {
      setUserInput({
        title: "",
        category: "",
        createdBy: "",
        description: "",
        thumbnail: null,
        previewImage: "",
      });
      navigate("/courses");
    }
  }

  return (
    <HomeLayout>
      <div className="flex justify-center max-[780px]:p-2   max-[780px]:pt-10   items-center min-h-[90vh]">
        <form
          onSubmit={onFormSubmit}
          className="flex flex-col   justify-center gap-5 rounded-sm p-4 text-white w-[700px] my-10 shadow-[0_0_10px_white] relative"
        >
          <Link
            onClick={() => navigate(-1)}
            className=" absolute top-8 text-2xl link text-accent cursor-pointer"
          >
            <AiOutlineArrowLeft />
          </Link>
          <h1 className="text-center text-2xl font-bold ">Create New Course</h1>

          <main className="grid max-[780px]:grid-cols-1 grid-cols-2 gap-x-10">
            <div className="gap-y-6">
              <div>
                <label htmlFor="image_uploads">
                  {userInput.previewImage ? (
                    <img
                      src={userInput.previewImage}
                      alt="course_thumbnail"
                      className="w-full h-44 m-auto border"
                    />
                  ) : (
                    <div className="flex justify-center items-center w-full h-44 border cursor-pointer ">
                      <h1 className="text-lg font-bold">
                        Upload Course Thumbnail
                      </h1>
                    </div>
                  )}
                </label>
                <input
                  className="hidden"
                  type="file"
                  accept="jpg, jpeg, png"
                  name="image_]uploads"
                  id="image_uploads"
                  onChange={handelImageUploads}
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-lg font-semibold" htmlFor="title">
                  Course Title
                </label>
                <input
                  type="text"
                  name="title"
                  id="title"
                  placeholder="Enter Course title... "
                  className="bg-transparent px-2 py-1 border"
                  value={userInput.title}
                  onChange={handelUserInput}
                />
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <div className="flex flex-col gap-1">
                <label className="text-lg font-semibold" htmlFor="createdBy">
                  Course Instructor
                </label>
                <input
                  type="text"
                  name="createdBy"
                  id="createdBy"
                  placeholder="Enter Course Instructor... "
                  className="bg-transparent px-2 py-1 border"
                  value={userInput.createdBy}
                  onChange={handelUserInput}
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-lg font-semibold" htmlFor="category">
                  Course Category
                </label>
                <input
                  type="text"
                  name="category"
                  id="category"
                  placeholder="Enter Course Category... "
                  className="bg-transparent px-2 py-1 border"
                  value={userInput.category}
                  onChange={handelUserInput}
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-lg font-semibold" htmlFor="description">
                  Course Description
                </label>
                <textarea
                  type="text"
                  name="description"
                  id="description"
                  placeholder="Enter Course Description... "
                  className="bg-transparent px-2 py-1 border resize-none overflow-y-auto h-24"
                  value={userInput.description}
                  onChange={handelUserInput}
                />
              </div>
            </div>
          </main>
          <button
            type="submit"
            className="bg-yellow-500 text-lg px-4 py-2 rounded-sm font-semibold hover:bg-yellow-300 transition-all ease-in-out duration-300"
          >
            Create Course
          </button>
        </form>
      </div>
    </HomeLayout>
  );
}
export default CoursesCreate;
