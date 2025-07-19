import { Route, Routes } from "react-router-dom";
import "./App.css";
import HomePage from "./Pages/homePage";
import AboutPage from "./Pages/AboutUs";
import NotFoundPage from "./Pages/NotFoundPage";
import SignUp from "./Pages/Signup";
import Login from "./Pages/Login";
import CoursesList from "./Pages/Course/coursesList";
import ContactPage from "./Pages/ContactPage";
import Denied from "./Pages/Denied.page";
import CourseDescription from "./Pages/Course/CourseDescription";
import RequireAuth from "./components/Auth/RequireAuth";
import CoursesCreate from "./Pages/Course/CourseCreate";
import Profile from "./Pages/User/ProfliePage";
import UpdateProfile from "./Pages/User/UpdateProfile";
import Checkout from "./Pages/payment/Checkout";
import PaymentSuccess from "./Pages/payment/paymentSuccess";
import PaymentFailed from "./Pages/payment/paymentFailed";
import Lecture from "./Pages/DashBoard/Lecture";
import AdminDashboard from "./Pages/DashBoard/AdminDashboard";
import AddLectures from "./Pages/DashBoard/AddLecuter";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage />}></Route>
        <Route path="/About" element={<AboutPage />}></Route>
        <Route path="/SignUp" element={<SignUp />}></Route>
        <Route path="/Login" element={<Login />}></Route>
        <Route path="/Contact" element={<ContactPage />}></Route>
        <Route element={<RequireAuth allowedRole={["ADMIN"]} />}>
          <Route path="/Course/Create" element={<CoursesCreate />}></Route>
          <Route path="/Course/AddLectures" element={<AddLectures />}></Route>
          <Route path="/Admin/DashBoard" element={<AdminDashboard />}></Route>
        </Route>

        <Route element={<RequireAuth allowedRole={["ADMIN", "USER"]} />}>
          <Route path="/Description" element={<CourseDescription />}></Route>
          <Route path="Course/Lecture" element={<Lecture />}></Route>
          <Route path="/Profile" element={<Profile />}></Route>
          <Route path="/Update/profile" element={<UpdateProfile />}></Route>
        </Route>

        <Route element={<RequireAuth allowedRole={["USER"]} />}>
          <Route path="/Checkout" element={<Checkout />}></Route>
          <Route path="/Checkout/Success" element={<PaymentSuccess />}></Route>
          <Route path="/Checkout/Fail" element={<PaymentFailed />}></Route>
        </Route>

        <Route path="/Denied" element={<Denied />}></Route>
        <Route path="/Courses" element={<CoursesList />}></Route>
        <Route path="*" element={<NotFoundPage />}></Route>
      </Routes>
    </>
  );
}

export default App;
