import { _descriptors } from "chart.js/helpers";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  getRazorPayId,
  purchaseCourseBundle,
  verifyUserPayment,
} from "../../Redux/slice/razorpaySlice";
import { useEffect } from "react";
import HomeLayout from "../../Layout/homeLayout";
import { BiRupee } from "react-icons/bi";

function Checkout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const razorpaykey = useSelector((state) => state?.razorpay?.key);
  const subscription_id = useSelector(
    (state) => state?.razorpay?.subscription_id
  );

  const isPaymentVerified = useSelector((state) => state?.razorpay?.key);

  const UserData = useSelector((state) => state?.auth?.data);

  const PaymentDetails = {
    razorpay_payment_id: "",
    razorpay_subscription_id: "",
    razorpay_signature: "",
  };
  async function handelSubscription(e) {
    e.preventDefault();
    if (!razorpaykey || !subscription_id) {
      toast.error("Something went wrong ....");
      return;
    }
    const Option = {
      key: razorpaykey,
      subscription_id: subscription_id,
      name: "Coursify  pvt. ltd.",
      descriptors: "Subscription ",
      theme: {
        color: "#F37254",
      },
      handler: async function (response) {
        PaymentDetails.razorpay_payment_id = response.razorpay_payment_id;
        PaymentDetails.razorpay_signature = response.razorpay_signature;
        PaymentDetails.razorpay_subscription_id =
          response.razorpay_subscription_id;

        const res = await dispatch(verifyUserPayment(PaymentDetails));
        console.log(res);
        console.log(Option);

        res?.payload?.success
          ? navigate("/checkout/Success")
          : navigate("/Checkout/Fail");
      },
    };
    const paymentObject = new window.Razorpay(Option);
    paymentObject.open();
  }
  async function load() {
    const res = await dispatch(getRazorPayId());
    console.log(res);
    const res2 = await dispatch(purchaseCourseBundle());
    console.log(res2);
  }
  useEffect(() => {
    load();
  }, []);

  return (
    <HomeLayout>
      <form
        onSubmit={handelSubscription}
        className="min-h-[90vh]  flex flex-col justify-center items-center text-white "
      >
        <div className="w-80 max-[780px]:w-[90%]  max-[780px]:h-[30rem] h-[26rem] flex flex-col justify-center shadow-[0_0_10px_black] rounded-sm relative">
          <h1 className="bg-yellow-300 absolute top-0 w-full text-center py-4 text-2xl font-bold  rounded-tl-l grounded-tr-lg">
            Subscription Bundle
          </h1>
          <div className="px-4 space-y-5 text-center">
            <p className="text-[17px]">
              This purchase will allow you to access all available course of our
              platform for{" "}
              <span className="text-yellow-200 font-bold">
                <br />1 year duration
              </span>{" "}
              All the existing and new launched courses will be also available
            </p>
            <p className="flex items-center justify-center gap-1 text-2xl font-bold text-yellow-300">
              <BiRupee /> <span>499</span>Only
            </p>
            <p className="flex items-center justify-center gap-1 text-1xl text-red-400">
              this project only showcase but payment is system Secure
            </p>
            <div className=" text-gray-500">
              <p>100% refund on cancellation</p>
              <p>* Terms and conditions applied *</p>
            </div>
            <button
              type="submit"
              className="bg-yellow-500 hover:bg-yellow-600 transition-all ease-in-out duration-300 absolute bottom-0 w-full left-0 text-xl font-bold rounded-bl-lg rounded-br-lg py-2"
            >
              Buy now
            </button>
          </div>
        </div>
      </form>
    </HomeLayout>
  );
}
export default Checkout;
