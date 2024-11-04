import { useDispatch, useSelector } from "react-redux";
import HomeLayout from "../../Layout/homeLayout";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { profileLoad } from "../../Redux/slice/AuthSlice";
import { cancelCourseBundle } from "../../Redux/slice/razorpaySlice";

function Profile() {
  const UserData = useSelector((state) => state?.auth?.data);

  const dispatch = useDispatch();
  async function handelUnsubscribe() {
    if (UserData?.subscription?.status == "active") {
      const UserInfo = {
        role: UserData.role,
        subscriptionStatus: UserData.subscription.status
          ? UserData.subscription.status
          : "",
      };
      toast("Initiating cancellation");
      await dispatch(cancelCourseBundle([UserInfo]));
      await dispatch(profileLoad());
    }
  }
  return (
    <HomeLayout>
      <div className="min-h-[90vh] flex flex-col justify-center items-center ">
        <div className="p-4 flex flex-col gap-10 rounded-sm text-white justify-center items-center w-96 shadow-[0_0_10px_black]">
          <img
            src={UserData?.avatar?.secure_url}
            alt="user_image"
            className="w-40 h-40 rounded-full border-2 border-white"
          />
          <h3 className="text-2xl font-semibold text-center capitalize">
            {UserData?.fullName}
          </h3>
          <div className="grid grid-cols-2">
            <p>Email: </p>
            <p>{UserData?.email}</p>
            <p>Role : </p>
            <p>{UserData?.role}</p>
            <p>subscription</p>
            <p>
              {UserData?.subscription?.status == "active"
                ? "Active"
                : "inActive"}
            </p>
          </div>
          <div className=" w-full flex  justify-between items-center  gap-2">
            <Link
              to="/change/password"
              className="w-1/2 text-center bg-yellow-600 hover:bg-yellow-500 transition-all ease-in-out duration-300 rounded-sm font-semibold text-white py-2 px-1"
            >
              <button>Change Password</button>
            </Link>
            <Link
              to="/Update/profile"
              className="w-1/2 text-center bg-yellow-600 hover:bg-yellow-500 transition-all ease-in-out duration-300 rounded-sm font-semibold text-white py-2 px-1"
            >
              <button>Edit Profile</button>
            </Link>
          </div>
          {UserData?.subscription?.status == "active" && (
            <button
              onClick={handelUnsubscribe}
              className="btn btn-secondary w-full hover:scale-95"
            >
              Cancel Subscription
            </button>
          )}
        </div>
      </div>
    </HomeLayout>
  );
}
export default Profile;
