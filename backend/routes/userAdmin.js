import express from "express";
import { createUserAccountController } from "../controller/createUserAccount.js";
import { viewUserAccountController } from "../controller/viewUserAccountController.js";
import { viewAccountByUserNameRoleController } from "../controller/viewAccountByUserNameRoleController.js";
import { findSpecificUserAccountController } from "../controller/findSpecificUserAccountController.js";
import { suspendUserAccountController } from "../controller/suspendUserAccountController.js";
import { updateUserAccountController } from "../controller/updateUserAccountController.js";



const router = express.Router();

router.get("/search", viewAccountByUserNameRoleController.viewAccountByUserNameRole);
router.get("/", viewUserAccountController.viewUserAccount);
router.post("/", createUserAccountController.createUserAccount);
router.put("/:id", updateUserAccountController.updateUserAccount);
router.get("/:id", findSpecificUserAccountController.findSpecificUserAccount);
router.delete("/:id", suspendUserAccountController.suspendUserAccount);

export default router;
