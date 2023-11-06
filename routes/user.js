import express from "express";
import { REGISTER_USER } from "../controllers/user.js";
import validation from "../middlewares/validation.js";
import { userRegistrationSchema } from "../validation/userSchema.js";
const router = express.Router();

router.post("/register", validation(userRegistrationSchema), REGISTER_USER);

export default router;
