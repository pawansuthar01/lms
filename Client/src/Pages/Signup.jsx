import { useState } from "react";
import HomeLayout from "../Layout/homeLayout";
import { BsPersonCircle } from "react-icons/bs";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";
import { createAccount } from "../Redux/slice/AuthSlice";
import { isEmail, isValidPassword } from "../helper/regexMatch";

function SignUp() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [previewImage, setPreviewImage] = useState("");

  const [signUpData, setSignUpData] = useState({
    fullName: "",
    email: "",
    password: "",
    avatar: "",
  });

  function handelUserInput(e) {
    const { name, value } = e.target;
    setSignUpData({
      ...signUpData,
      [name]: value,
    });
  }

  function handelImageInput(e) {
    e.preventDefault();
    const uploadedImage = e.target.files[0];
    if (uploadedImage) {
      setSignUpData({
        ...signUpData,
        avatar: uploadedImage,
      });
      const fileReader = new FileReader();
      fileReader.readAsDataURL(uploadedImage);
      fileReader.addEventListener("load", function () {
        setPreviewImage(this.result);
      });
    }
  }

  async function NewAccountCreate(event) {
    event.preventDefault();
    if (
      !signUpData.fullName ||
      !signUpData.email ||
      !signUpData.password ||
      !signUpData.avatar
    ) {
      toast.error("All filed is required");
      return;
    }

    if (signUpData.fullName.length < 5) {
      toast.error("name should be atLeast 5 character");
      return;
    }
    if (!isEmail(signUpData.email)) {
      toast.error("Invalid email");
      return;
    }
    if (!isValidPassword(signUpData.password)) {
      toast.error(
        "password should be 6-16 character long and atLest a number and special character "
      );
      return;
    }

    const formData = new FormData();
    formData.append("fullName", signUpData.fullName);
    formData.append("email", signUpData.email);
    formData.append("password", signUpData.password);
    formData.append("avatar", signUpData.avatar);

    const response = await dispatch(createAccount(formData));

    if (response?.payload?.success) navigate("/");

    setSignUpData({
      fullName: "",
      email: "",
      password: "",
      avatar: "",
    });

    setPreviewImage("");
  }

  return (
    <HomeLayout>
      <div className="flex  overflow-x-auto  items-center justify-center h-[90vh]">
        <form
          noValidate
          onSubmit={NewAccountCreate}
          className="flex flex-col  justify-center gap-3  rounded-lg p-4 text-white w-96  shadow-[0_0_10px_white] "
        >
          <h1 className="text-2xl text-center font-bold">Registration Page</h1>
          <label htmlFor="image_uploads" className=" cursor-pointer">
            {previewImage ? (
              <div>
                <img
                  src={previewImage}
                  className="w-24 h-24 rounded-full m-auto"
                />
              </div>
            ) : (
              <div>
                <BsPersonCircle className="w-24 h-24 rounded-full m-auto" />
              </div>
            )}
          </label>
          <input
            type="file"
            onChange={handelImageInput}
            className="hidden "
            name="image_uploads"
            id="image_uploads"
            accept=".png ,.svg ,.jpeg ,.jpg"
          />
          <div className="flex flex-col gap-1">
            <label htmlFor="fullName">FullName</label>
            <input
              onChange={handelUserInput}
              value={signUpData.fullName}
              type="text"
              name="fullName"
              required
              id="fullName"
              placeholder="Enter your Name.."
              className="px-2 py-4 bg-transparent border "
            />
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="email">Email</label>
            <input
              onChange={handelUserInput}
              value={signUpData.email}
              type="email"
              required
              name="email"
              id="email"
              placeholder="Enter your email.."
              className="px-2 py-4 bg-transparent border "
            />
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="password">Password</label>
            <input
              onChange={handelUserInput}
              value={signUpData.password}
              type="Password"
              name="password"
              id="password"
              placeholder="Enter your Password.."
              className="px-2 py-4 bg-transparent border "
            />
          </div>
          <button className="btn btn-primary font-bold ">Create account</button>
          <p className="mt-1  text-center">
            Already have an account ?
            <Link to="/Login" className="link text-blue-600 pl-1">
              Login
            </Link>
          </p>
        </form>
      </div>
    </HomeLayout>
  );
}
export default SignUp;
