import { config } from "dotenv";
config();
import app from "./app.js";
import cloudinary, { v2 } from "cloudinary";
import Razorpay from "razorpay";
const PORT = process.env.PORT;

export const razorpay = new Razorpay({
  key_id: process.env.KEY_ID,
  key_secret: process.env.SECRET_ID,
});

v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

app.listen(PORT, () => {
  console.log(`sever is listen is http://localhost::${PORT}`);
});
