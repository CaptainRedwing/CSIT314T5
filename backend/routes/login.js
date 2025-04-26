import express from "express";
import { login, roles } from "../controller/login.js";

const router = express.Router();

router.post("/", login);
router.get("/roles", roles);

export default router;