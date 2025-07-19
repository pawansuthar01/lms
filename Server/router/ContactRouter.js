import Router from "express";
import Contact from "../controllers/ContactController.js";
const ContactRouter = Router();

ContactRouter.post("/", Contact);
export default ContactRouter;
