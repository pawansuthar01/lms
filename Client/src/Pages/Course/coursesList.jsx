import { useDispatch, useSelector } from "react-redux";
import HomeLayout from "../../Layout/homeLayout";
import { getAllCourseList } from "../../Redux/slice/courseList";
import { useEffect } from "react";
import CourseCard from "../../components/cousesCard";

function CoursesList() {
  const dispatch = useDispatch();

  const { courseData } = useSelector((state) => state.course);
  async function getCourses() {
    await dispatch(getAllCourseList());
  }
  useEffect(() => {
    getCourses();
  }, []);

  return (
    <HomeLayout>
      <div className="min-h-[90vh] flex pt-20 flex-col gap-10 text-white ">
        <h1 className="text-3xl text-center font-semibold mb-5">
          Explore the courses made by
          <span className="text-yellow-400 font-bold"> Industry exports </span>
        </h1>
        <div className="mb-10 flex flex-wrap gap-14 justify-center ">
          {courseData?.map((elements) => {
            return <CourseCard key={elements._id} Data={elements} />;
          })}
        </div>
      </div>
    </HomeLayout>
  );
}
export default CoursesList;
