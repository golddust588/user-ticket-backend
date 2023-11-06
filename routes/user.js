import express from "express";
import {
  REGISTER_USER,
  LOGIN,
  GET_NEW_JWT_TOKEN,
} from "../controllers/user.js";
import {
  registerValidationMiddleware,
  loginValidationMiddleware,
} from "../middlewares/validation.js";
import {
  userLoginSchema,
  userRegistrationSchema,
} from "../validation/userSchema.js";
const router = express.Router();

router.post(
  "/register",
  registerValidationMiddleware(userRegistrationSchema),
  REGISTER_USER
);
router.post("/login", loginValidationMiddleware(userLoginSchema), LOGIN);
router.get("/token", GET_NEW_JWT_TOKEN);

export default router;
