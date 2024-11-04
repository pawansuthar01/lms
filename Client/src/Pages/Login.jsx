import { useState } from "react";
import HomeLayout from "../Layout/homeLayout";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";
import { login } from "../Redux/slice/AuthSlice";

function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [LoginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  function handelUserInput(e) {
    const { name, value } = e.target;
    setLoginData({
      ...LoginData,
      [name]: value,
    });
  }

  async function Login(event) {
    event.preventDefault();
    if (!LoginData.email || !LoginData.password) {
      toast.error("All filed is required");
      return;
    }

    const response = await dispatch(login(LoginData));

    if (response?.payload?.success) navigate("/");

    setLoginData({
      email: "",
      password: "",
    });
  }

  return (
    <HomeLayout>
      <div className="flex  overflow-x-auto  items-center justify-center h-[90vh]">
        <form
          noValidate
          onSubmit={Login}
          className="flex flex-col  justify-center gap-3  rounded-lg p-4 text-white w-96  shadow-[0_0_10px_white] "
        >
          <h1 className="text-2xl text-center font-bold">Login Page</h1>

          <div className="flex flex-col gap-1">
            <label htmlFor="email">Email</label>
            <input
              onChange={handelUserInput}
              value={LoginData.email}
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
              value={LoginData.password}
              type="Password"
              name="password"
              id="password"
              placeholder="Enter your Password.."
              className="px-2 py-4 bg-transparent border "
            />
          </div>
          <button className="btn btn-primary font-bold ">Login</button>
          <p className="mt-1  text-center">
            Do not have a Account ?
            <Link to="/SignUp" className="link text-blue-600 pl-1">
              Create Account
            </Link>
          </p>
        </form>
      </div>
    </HomeLayout>
  );
}
export default Login;
