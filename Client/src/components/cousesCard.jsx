import { useNavigate } from "react-router-dom";

function CourseCard({ Data }) {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate("/Description", { state: { ...Data } })}
      className="text-white w-[22rem] h-[430px] shadow-lg rounded-lg cursor-pointer group overflow-hidden bg-zinc-600 "
    >
      <div className=" overflow-hidden">
        <img
          src={Data?.thumbnail?.secure_url}
          alt="courses_image"
          className="h-48 w-full rounded-tl-lg rounded-tr-lg group-hover:scale-[1,2] transition-all ease-in-out "
        />
      </div>
      <div className="p-3 space-y-1 text-white">
        <h2 className="text-yellow-300 line-clamp-2 text-xl font-bold">
          {Data?.title}
        </h2>
        <p className="line-clamp-2">{Data?.description}</p>
        <p className="font-semibold">
          <span className="text-yellow-300 font-bold">Category :</span>

          {Data?.category}
        </p>
        <p className="font-semibold">
          <span className="text-yellow-300 font-bold">Total Lectures :</span>
          {Data?.numberOfLectures}
        </p>
        <p className="font-semibold">
          <span className="text-yellow-300 font-bold">Instructor :</span>
          {Data?.createdBy}
        </p>
      </div>
    </div>
  );
}
export default CourseCard;
