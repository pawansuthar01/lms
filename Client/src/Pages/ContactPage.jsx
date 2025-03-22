import { useState } from "react";
import HomeLayout from "../Layout/homeLayout";
import toast from "react-hot-toast";
import axiosInstance from "../helper/axiosinstance";
import { isEmail } from "../helper/regexMatch";

function ContactPage() {
  const [ContactInput, setContactInput] = useState({
    name: "",
    email: "",
    message: "",
  });
  function handelInput(e) {
    const { name, value } = e.target;
    setContactInput({
      ...ContactInput,
      [name]: value,
    });
  }
  async function ofFormSubmit(e) {
    e.preventDefault();
    if (!ContactInput.name || !ContactInput.email || !ContactInput.message) {
      toast.error("all failed is required");
      return;
    }

    if (!isEmail(ContactInput.email)) {
      toast.error("Invalid email");
      return;
    }

    try {
      const res = axiosInstance.post("/api/v1/Contact", ContactInput);
      toast.promise(res, {
        loading: "Submitting your messages....",
        success: "successfully message Submitting...",
        error: (data) => {
          return data?.response?.data?.message;
        },
      });
      const ContactResponse = await res;

      if (ContactResponse?.data?.success) {
        setContactInput({
          name: "",
          email: "",
          message: "",
        });
      }
    } catch (e) {
      toast.error(e?.response?.message);
    }
  }

  return (
    <HomeLayout>
      <div className="flex justify-center items-center max-[780px]:p-5 max-[780px]:pt-20 h-[90vh] ">
        <form
          onSubmit={ofFormSubmit}
          className=" flex flex-col items-center justify-center gap-2 p-4  rounded-sm text-white  shadow-[0_0_10px_white] w-[22rem]"
        >
          <h1 className="text-3xl font-semibold">Contact form</h1>
          <div className=" flex flex-col w-full gap-1">
            <label htmlFor="name" className=" font-semibold text-xl ">
              Name
            </label>
            <input
              onChange={handelInput}
              value={ContactInput.name}
              type="text"
              id="name"
              name="name"
              placeholder="Enter your Name.."
              className="bg-transparent border px-2 py-1 rounded-sm"
            />
          </div>
          <div className=" flex flex-col w-full gap-1">
            <label htmlFor="email" className=" font-semibold text-xl ">
              Email
            </label>
            <input
              onChange={handelInput}
              value={ContactInput.email}
              type="text"
              id="email"
              name="email"
              placeholder="Enter your email.."
              className="bg-transparent border px-2 py-1 rounded-sm"
            />
          </div>
          <div className=" flex flex-col w-full gap-1">
            <label htmlFor="message" className=" font-semibold text-xl ">
              message
            </label>
            <textarea
              onChange={handelInput}
              value={ContactInput.message}
              id="message"
              name="message"
              placeholder="Enter your message .."
              className="  h-40 bg-transparent border px-2 py-1 rounded-sm resize-none"
            />
          </div>
          <button
            type="submit"
            className="bg-green-500 px-4 py-2 font-semibold tex-xl text-white w-full mt-2 rounded-lg hover:bg-green-400"
          >
            Submit !
          </button>
        </form>
      </div>
    </HomeLayout>
  );
}
export default ContactPage;
