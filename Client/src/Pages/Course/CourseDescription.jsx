import { useLocation, useNavigate } from "react-router-dom";
import HomeLayout from "../../Layout/homeLayout";
import { useSelector } from "react-redux";

function CourseDescription() {
  const Navigate = useNavigate();
  const { state } = useLocation();
  const { role, data } = useSelector((state) => state.auth);
  return (
    <HomeLayout>
      <div className="min-h-[90vh] text-white pt-12 px-20 flex flex-col justify-center items-center ">
        <div className=" grid grid-cols-2 gap-10 relative">
          <div className=" space-y-6">
            <img
              src={state?.thumbnail?.secure_url}
              alt="thumbnail_image"
              className="w-full h-64"
            />
            <div className="space-y-5">
              <div className="flex flex-col justify-between items-center text-xl">
                <p className="font-semibold">
                  <span className="text-yellow-400 font-bold">
                    Total lectures :{" "}
                  </span>
                  {state?.numberOfLectures}
                </p>
                <p className="font-semibold">
                  <span className="text-yellow-400 font-bold">
                    Instructor :{" "}
                  </span>
                  {state?.createdBy}
                </p>
              </div>
              {role === "ADMIN" || data?.subscription?.status == "active" ? (
                <button
                  onClick={() =>
                    Navigate("/Course/Lecture", { state: { ...state } })
                  }
                  className="bg-yellow-500 text-xl rounded-sm font-bold px-5 py-2 w-full hover:bg-yellow-400 transition-all duration-300"
                >
                  Watch Lecture
                </button>
              ) : (
                <button
                  onClick={() => Navigate("/checkout")}
                  className="bg-yellow-500 text-xl rounded-sm font-bold px-5 py-2 w-full hover:bg-yellow-400 transition-all duration-300"
                >
                  Subscription
                </button>
              )}
            </div>
          </div>
          <div className=" space-y-5 text-xl">
            <h1 className="text-3xl font-bold text-yellow-400 mb-5 text-center">
              {state?.title}
            </h1>
            <p className="text-yellow-500"> Course Description</p>
            <p>{state?.description}</p>
          </div>
        </div>
      </div>
    </HomeLayout>
  );
}
export default CourseDescription;