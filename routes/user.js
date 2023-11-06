import express from "express";
import {
  REGISTER_USER,
  LOGIN,
  GET_NEW_JWT_TOKEN,
  GET_ALL_USERS,
  GET_USER_BY_ID,
} from "../controllers/user.js";
import auth from "../middlewares/auth.js";
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
router.get("/", auth, GET_ALL_USERS);
router.get("/:id", auth, GET_USER_BY_ID);

export default router;
