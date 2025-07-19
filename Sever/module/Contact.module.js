import { model, Schema } from "mongoose";
const ContactSchema = new Schema(
  {
    name: {
      type: "string",
      required: [true, "name is required"],
    },
    email: {
      type: "string",
      required: [true, "email is required"],
    },
    message: {
      type: "string",
      required: [true, "message is required"],
    },
  },
  {
    timestamps: true,
  }
);
const contact = model("Contact", ContactSchema);

export default contact;
