import express from "express";
import { UserAdminController } from "../controller/userAdmin.js";

const router = express.Router();
const userAdminController = new UserAdminController();

router.get("/search", (req, res, next) => userAdminController.viewAccountByUserNameRole(req, res, next));
router.get("/", (req, res, next) => userAdminController.viewUserAccount(req, res, next));
router.post("/", (req, res, next) => userAdminController.createUserAccount(req, res, next));
router.put("/:id", (req, res, next) => userAdminController.updateUserAccount(req, res, next));
router.get("/:id", (req, res, next) => userAdminController.findSpecificUserAccount(req, res, next));
router.delete("/:id", (req, res, next) => userAdminController.suspendUserAccount(req, res, next));

export default router;
