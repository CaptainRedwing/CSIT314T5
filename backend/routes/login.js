import express from "express";
import { LoginController } from "../controller/login/login.js";

const router = express.Router();

router.post("/", LoginController.login);
router.get("/roles",LoginController.roles);

export default router;
