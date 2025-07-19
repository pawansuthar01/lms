import contact from "../module/Contact.module.js";
import AppError from "../utils/apperror.js";

async function Contact(req, res, next) {
  const { name, email, message } = req.body;
  if (!name || !email || !message) {
    return next(new AppError("All failed is required", 440));
  }
  try {
    const Contact = await contact.create({
      name,
      email,
      message,
    });
    if (!Contact) {
      return next(new AppError("pleases try again", 480));
    }

    await Contact.save();
    res.status(200).json({
      success: true,
      data: Contact,
      message: "your Contact Successfully Send..",
    });
  } catch (error) {
    return next(new AppError(error.message, 400));
  }
}
export default Contact;
