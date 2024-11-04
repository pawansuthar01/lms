import { Link } from "react-router-dom";
import HomeLayout from "../Layout/homeLayout";
import homePageImage from "../assets/Images/homePageMainImage.png";
function HomePage() {
  return (
    <HomeLayout>
      <div className="pt-10 text-white flex items-center justify-center gap-10 mx-16 h-[90vh]">
        <div className="w-1/2  space-y-6">
          <h1 className="text-5xl font-semibold">
            Find out best
            <samp className=" text-yellow-500 font-bold">Online courses</samp>
          </h1>
          <p className="text-xl text-gray-200">
            we have a large library of Courses taught by highly skilled and
            qualified at a very affordable cost..
          </p>
          <div className=" space-x-6">
            <Link to="/Courses">
              <button className=" rounded-md bg-yellow-500 px-5 py-3 font-semibold text-lg transition-all duration-300 hover:bg-yellow-600  ease-in-out">
                Explore Courses
              </button>
            </Link>
            <Link to="/Contact">
              <button className=" rounded-md border border-yellow-500 px-5 py-3 text-lg font-semibold transition-all duration-300 hover:bg-yellow-600  ease-in-out">
                Contact Us
              </button>
            </Link>
          </div>
        </div>
        <div className="w-1/2 flex  items-center justify-center">
          <img src={homePageImage} alt="Home Page image" />
        </div>
      </div>
    </HomeLayout>
  );
}
export default HomePage;
