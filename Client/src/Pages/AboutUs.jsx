import HomeLayout from "../Layout/homeLayout";
import AboutPageImage from "../assets/Images/aboutMainImage.png";
import CarouselSlide from "../components/CarouselSlice";
import { celebrities } from "../constants/CelebrityData";

function AboutPage() {
  return (
    <HomeLayout>
      <div className="pl-20 pt-20 flex flex-col text-white">
        <div className="flex items-center  gap-5 mx-10">
          <section className="w-1/2  space-y-10">
            <h1 className=" text-5xl font-semibold text-yellow-500">
              Affordable and quality education
            </h1>
            <p className="text-xl text-gray-200">
              Our goal is to provide the afoordable and quality education to the
              world. We are providing the platform for the aspiring teachers and
              students to share their skills, creativity and knowledge to each
              other to empower and contribute in the growth and wellness of
              mankind.
            </p>
          </section>
          <div className="w-1/2">
            <img
              id="test1"
              style={{ filter: "drop-shadow(0 10px 10px  rbg(0 0 0  ))" }}
              src={AboutPageImage}
              alt="About page image"
              className=" drop-shadow-2xl"
            />
          </div>
        </div>
        <div className="w-1/2 carousel m-auto my-16">
          {celebrities &&
            celebrities.map((celebrity) => (
              <CarouselSlide
                {...celebrity}
                key={celebrity.slideNumber}
                totalSlide={celebrities.length}
              />
            ))}
        </div>
      </div>
    </HomeLayout>
  );
}
export default AboutPage;
