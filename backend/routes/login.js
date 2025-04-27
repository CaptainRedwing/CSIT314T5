import express from "express";
import { LoginController } from "../controller/login.js";

const router = express.Router();
const loginController = new LoginController();

router.post("/", (req, res, next) => loginController.login(req, res, next));
router.get("/roles", (req, res, next) => loginController.roles(req, res, next));

export default router;
