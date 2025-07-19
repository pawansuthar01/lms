import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

mongoose.set("strictQuery", false);

const databaseConnect = async () => {
  try {
    const { connection } = await mongoose.connect(process.env.MONGO_URI);
    if (connection) {
      console.log(`Connected to Database ${connection.host} `);
    }
  } catch (error) {
    console.log(error.message);
    process.exit(1);
  }
};

export default databaseConnect;
