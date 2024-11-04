import { useLocation, useNavigate } from "react-router-dom";
import HomeLayout from "../../Layout/homeLayout";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import {
  deleteCourseLecture,
  getCourseLecture,
} from "../../Redux/slice/LectureSlice";

function Lecture() {
  const Navigate = useNavigate();
  const dispatch = useDispatch();
  const { state } = useLocation();

  const { lecture } = useSelector((state) => state.lecture);

  const { role } = useSelector((state) => state.auth);
  const [currentVideo, setCurrentVideo] = useState(0);

  async function onLectureDelete(courseId, lectureId) {
    await dispatch(
      deleteCourseLecture({ courseId: courseId, lectureId: lectureId })
    );
    await dispatch(getCourseLecture(courseId));
  }

  useEffect(() => {
    if (!state) Navigate("/Courses");
    dispatch(getCourseLecture(state._id));
  }, []);

  return (
    <HomeLayout>
      <div className="flex flex-col gap-10 items-center justify-center min-h-[90vh] py-10 text-white mx-[5%]">
        <div className="text-center text-2xl font-semibold text-yellow-300">
          Course Name :{state?.title}
        </div>
        {lecture && lecture.length > 0 ? (
          <div className="flex justify-center gap-10 w-full">
            <div className=" space-y-5 w-[22rem] p-2 rounded-lg shadow-[0_0_10px_black]">
              <video
                src={lecture && lecture[currentVideo]?.lecture?.secure_url}
                className=" object-fill rounded-tl-lg rounded-tr-lg w-full  max-h-[350px]"
                controls
                disablePictureInPicture
                muted
                controlsList="nodownload"
              ></video>
              <div>
                <h1>
                  <span className="text-yellow-500">Title : </span>
                  {lecture && lecture[currentVideo]?.title}
                </h1>
                <p>
                  <span className="text-yellow-500 line-clamp-5 overflow-hidden">
                    Description :{" "}
                  </span>
                  {lecture && lecture[currentVideo]?.description}
                </p>
              </div>
            </div>
            <ul className="w-[22rem] p-2 rounded-sm space-y-5 shadow-[0_0_10px_black]">
              <li className="flex justify-between flex-col items-center text-2xl text-yellow-500 font-semibold">
                <p>Lecture list</p>
                {role == "ADMIN" && (
                  <button
                    onClick={() =>
                      Navigate("/Course/AddLectures", { state: { ...state } })
                    }
                    className="btn btn-primary px-2 py-1 rounded-sm font-semibold text-sm"
                  >
                    Add new Lecture
                  </button>
                )}
              </li>
              {lecture &&
                lecture.map((lecture, idx) => {
                  return (
                    <li className="space-y-5" key={lecture._id}>
                      <p
                        className=" cursor-pointer"
                        onClick={() => setCurrentVideo(idx)}
                      >
                        <span>Lecture : {idx + 1}: </span>
                        {lecture.title}
                      </p>
                      {role == "ADMIN" && (
                        <button
                          onClick={() =>
                            onLectureDelete(state?._id, lecture._id)
                          }
                          className="btn btn-accent px-2 py-1 rounded-sm font-semibold text-sm"
                        >
                          Delete Lecture
                        </button>
                      )}
                    </li>
                  );
                })}
            </ul>
          </div>
        ) : (
          role == "ADMIN" && (
            <button
              onClick={() =>
                Navigate("/Course/AddLectures", { state: { ...state } })
              }
              className="btn btn-primary px-2 py-1 rounded-sm font-semibold text-sm"
            >
              Add new Lecture
            </button>
          )
        )}
      </div>
    </HomeLayout>
  );
}
export default Lecture;
