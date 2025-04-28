import express from "express";
import { UserAdminController } from "../controller/userAdmin.js";

const router = express.Router();

router.get("/search", UserAdminController.viewAccountByUserNameRole);
router.get("/", UserAdminController.viewUserAccount);
router.post("/", UserAdminController.createUserAccount);
router.put("/:id", UserAdminController.updateUserAccount);
router.get("/:id", UserAdminController.findSpecificUserAccount);
router.delete("/:id", UserAdminController.suspendUserAccount);

export default router;
