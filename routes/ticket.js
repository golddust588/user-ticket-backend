import express from "express";
import INSERT_TICKET from "../controllers/ticket.js";
import auth from "../middlewares/auth.js";
const router = express.Router();

router.post("/", auth, INSERT_TICKET);

export default router;
