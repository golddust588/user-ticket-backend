import express from "express";
import {
  REGISTER_USER,
  LOGIN,
  GET_NEW_JWT_TOKEN,
  GET_ALL_USERS,
  GET_USER_BY_ID,
  BUY_TICKET,
  GET_ALL_USERS_WITH_TICKETS,
  GET_USER_BY_ID_WITH_TICKETS,
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
router.get("/withTickets", auth, GET_ALL_USERS_WITH_TICKETS);
router.get("/:id", auth, GET_USER_BY_ID);
router.get("/:id/withTickets", auth, GET_USER_BY_ID_WITH_TICKETS);
router.put("/:id/buyTicket", auth, BUY_TICKET);

export default router;
